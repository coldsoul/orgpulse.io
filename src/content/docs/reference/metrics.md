---
title: "Metrics Reference"
description: "How OrgPulse computes cycle time, lead time, throughput, WIP, and cycle time variance — with confidence scoring."
type: reference
order: 2
category: reference
---

# OrgPulse Metrics, Diagnostic Patterns, and Their Relationships

Complete reference for the five core metrics, five diagnostic patterns, the confidence scoring system that gates them, and the false positive guard architecture that prevents spurious alarms.

---

## Metrics

### Cycle Time

**Measures**: Time from first `ACTIVE` state to first `DONE` state per issue. Active work time only; excludes queue time.

**Inputs**: `NormalisedIssueEvent[]` (Jira issue changelogs), optional `sprintIds` filter, `OUTLIER_THRESHOLD_DAYS`.

**Computation** (`src/metrics/cycleTime.ts`):
1. For each event, find first `ACTIVE` → first subsequent `DONE` transition pair.
2. Compute `durationMs = doneTimestamp - activeTimestamp`.
3. Filter: discard `< 60 seconds` (seed data), `> 30 days` (outlier removal).
4. Apply sprint filter if provided.
5. Require ≥ 5 valid durations; return zero result if fewer.
6. Compute `median`, `p75`, `p90`, `stdDev` from sorted array.
7. Compute `varianceRatioByType` (per-category stdDev / overall stdDev).
8. Compute `endOfSprintClusteringRatio` (completions within ±24 hours of sprint end).

**Output** (`CycleTimeResult`):
- `median`, `p75`, `p90` — days
- `stdDev` — days (population)
- `sampleSize` — valid durations counted
- `varianceRatioByType` — object mapping issue type → ratio
- `confidenceInput` — fed to confidence scorer

**Confidence scoring inputs**: `dataPointCount` (valid durations), `transitionCoverageRatio` (durations / input events), `reopenedIssueRate`, `endOfSprintClusteringRatio`.

**Thresholds and edge cases**:
- Minimum: 5 valid durations after filters; zero result below this.
- Outlier cap: 30 days (removed from computation).
- Minimum duration: 60 seconds (excludes rapid updates, test data).
- Sprint end window: ±24 hours (86,400,000 ms).
- Reopened issues: only first ACTIVE → DONE pair counted; rework excluded from cycle time.
- Issues with no ACTIVE transition: excluded entirely (backlog only).
- Pathologically stalled issues (> 30 days): dropped silently by outlier filter; P-005 (lead time) partially compensates.

**Related patterns**: P-002 (Stalled Flow), P-005 (Invisible Backlog Pressure — informational context only).

**Sources**: `src/metrics/cycleTime.ts` (lines 1–130), `src/utils/constants.ts` (MIN_DURATION_MS, OUTLIER_THRESHOLD_DAYS), `docs/architecture.md` (§2.4).

---

### Lead Time

**Measures**: Time from issue creation (`createdAt`) to first `DONE` state. Full lifecycle including backlog queue time.

**Inputs**: `NormalisedIssueEvent[]`, mandatory `sprintIds` filter.

**Computation** (`src/metrics/leadTime.ts`):
1. For each event with a `DONE` transition, compute `days = (doneMs - createdMs) / MS_PER_DAY`.
2. Apply sprint filter (mandatory for lead time).
3. If `days > LEAD_TIME_OUTLIER_CAP_DAYS` (42): increment `stalledTicketCount`, skip duration.
4. Require ≥ 5 valid durations after outlier removal; return zero result if fewer.
5. Compute `median`, `p75`, `p90` from sorted durations.

**Output** (`LeadTimeResult`):
- `median`, `p75`, `p90` — days
- `sampleSize` — issues included in sample (post sprint filter, post outlier removal)
- `stalledTicketCount` — issues completed in sprint but excluded by 42-day cap
- `confidenceInput` — fed to confidence scorer

**Confidence scoring inputs**: `dataPointCount` (events with DONE, pre-filter), `transitionCoverageRatio` (eventsWithDone / events.length), `reopenedIssueRate`, `endOfSprintClusteringRatio` (defaults to 0), `commentStatusTimestampDivergence` (defaults to 0).

**Thresholds and edge cases**:
- Minimum: 5 completed issues within sprint set (after outlier removal); zero result below.
- Outlier cap: `LEAD_TIME_OUTLIER_CAP_DAYS = 42` — tickets exceeding this are excluded from median computation and counted in `stalledTicketCount` instead.
- `dataPointCount` is pre-sprint-filter count: confidence does not degrade from sprint filtering, only from missing DONE transitions.
- Issues created before sprint but assigned to sprint: included with correct lead time.

**Related patterns**: P-005 (Invisible Backlog Pressure — primary signal).

**Sources**: `src/metrics/leadTime.ts` (lines 1–84), `src/utils/constants.ts` (LEAD_TIME_OUTLIER_CAP_DAYS), `docs/architecture.md` (§2.4).

---

### Throughput

**Measures**: Count of issues reaching `DONE` state per sprint (scrum) or per time window (kanban).

**Inputs — Scrum**: `NormalisedIssueEvent[]`, `sprintSet`, sprint metadata.
**Inputs — Kanban**: `NormalisedIssueEvent[]`, `windowWeeks` (default: 2).

**Computation — Scrum** (`computeThroughput` in `src/metrics/throughput.ts`):
1. Initialize all sprints with count = 0.
2. For each event, find any `DONE` transition.
3. If event has `sprintId` in sprint set, increment `countPerSprint[sprintId]`.
4. Compute `rollingAverage = sum(countPerSprint) / count(sprints)`.
5. Attribution by `sprintId` field (from Jira `customfield_10020`), not by completion timestamp.

**Computation — Kanban** (`computeThroughputKanban`):
1. Collect all `DONE` transition timestamps.
2. Bucket into rolling 2-week windows.
3. Count completions per window; compute rolling average.

**Output** (`ThroughputResult`):
- `countPerSprint` — map of sprint/window ID → completion count
- `rollingAverage` — average across all periods
- `confidenceInput` — fed to confidence scorer

**Confidence scoring inputs**: `dataPointCount` (eventsWithDone), `transitionCoverageRatio` (eventsWithDone / events.length), `reopenedIssueRate`.

**Thresholds and edge cases**:
- No minimum data points; `rollingAverage = 0` if no DONE transitions.
- Confidence near-zero when `dataPointCount < 5`.
- Story points: ignored; throughput is pure count.
- Unsprintified issues: counted in `eventsWithDone` for confidence, excluded from `countPerSprint`.
- Empty sprints (zero items): appear in map with count 0, depress rolling average.
- Kanban window (2 weeks default) does not align with sprint cadence; cross-mode comparison unreliable.

**Related patterns**: P-001 (Chronic WIP Inflation — flat confirmation), P-003 (Overloaded Team — decline confirmation), P-004 (Quality Crisis Signal — decline confirmation).

**Sources**: `src/metrics/throughput.ts` (lines 1–121), `docs/architecture.md` (§2.4).

---

### WIP (Work In Progress)

**Measures**: Count of issues in `ACTIVE` or `REVIEW` state at sprint midpoint (scrum) or 2-week window midpoint (kanban).

**Inputs**: `NormalisedIssueEvent[]`, sprint/window metadata.

**Computation — Scrum** (`computeWip` in `src/metrics/wip.ts`):
1. For each sprint, compute `midpointMs = (startMs + endMs) / 2`.
2. For each event, call `isInWipAtMidpoint(event, midpointMs)`.
3. Scan transitions chronologically to midpoint; take last state.
4. Count if last state is `ACTIVE` or `REVIEW`.

**Computation — Kanban** (`computeWipKanban`):
1. Derive 2-week rolling windows from transition timestamps.
2. Apply same midpoint logic to each window.

**Output** (`WipResult`):
- `countPerSprint` — map of sprint/window ID → WIP count
- `confidenceInput` — fed to confidence scorer

**Confidence scoring inputs**: `dataPointCount` (all events), `transitionCoverageRatio` (eventsWithTransitions / events.length), `reopenedIssueRate`, `endOfSprintClusteringRatio` (DONE completions within ±24 hours of sprint end).

**Thresholds and edge cases**:
- No minimum; WIP = 0 is valid (unusual but valid).
- Midpoint calculation: wall-clock time from sprint start to end / 2.
- `BLOCKED` state: NOT included in WIP. Blocked items at midpoint contribute 0.
- Issues created after midpoint: invisible to that sprint's WIP.
- Pattern detection uses `countPerSprint[latestSprintId]` (single snapshot), not rolling average.
- Absolute floor for P-001 and P-003: `WIP > teamSize × 3.0` at confidence ≥ 0.60.

**Related patterns**: P-001 (Chronic WIP Inflation — primary signal), P-003 (Overloaded Team — primary signal).

**Sources**: `src/metrics/wip.ts` (lines 1–145), `src/utils/constants.ts` (CLUSTERING_WINDOW_MS).

---

### Cycle Time Variance

**Measures**: Population standard deviation of cycle time distribution. Rising variance indicates increasing unpredictability.

**Inputs**: `NormalisedIssueEvent[]`, optional `sprintIds`, `OUTLIER_THRESHOLD_DAYS`.

**Computation** (`src/metrics/cycleTimeVariance.ts`):
1. Extract cycle time durations using same ACTIVE → DONE logic as Cycle Time.
2. Apply 30-day outlier filter (same as cycle time).
3. Apply 60-second minimum duration filter (same as Cycle Time — `MIN_DURATION_MS` from `src/utils/constants.ts`).
4. Require ≥ 5 valid durations; return zero result if fewer.
5. Compute `mean` and `stdDev` from durations.
6. Compute `endOfSprintClusteringRatio` (±24 hour window).

**Output** (`CycleTimeVarianceResult`):
- `stdDev` — days (population standard deviation)
- `mean` — days
- `sampleSize` — valid durations
- `confidenceInput` — fed to confidence scorer
- **Quality extension**: Baseline record carries `bugCreationRate`, `reopenedRate` fields (populated by `updateQualityBaseline()`).

**Confidence scoring inputs**: `dataPointCount` (durations), `transitionCoverageRatio` (durations / events.length), `reopenedIssueRate`, `endOfSprintClusteringRatio`.

**Thresholds and edge cases**:
- Minimum: 5 valid durations after outlier filter; zero result below.
- Outlier cap: 30 days (same as Cycle Time).
- Minimum duration: 60 seconds (`MIN_DURATION_MS`) — consistent with Cycle Time.
- `varianceRatioByType`: skipped when overall stdDev = 0.
- Relationship to Cycle Time: both use same duration extraction and 30-day filter; computed independently but on shared raw input.
- **Coupling**: `bugCreationRate` is not a named metric. It is computed inline in `computeAllMetrics` (`src/computation/index.ts:229-230`) as `bugEvents.length / events.length` directly from raw normalised events, stored in the `extra` bag of the `RawMetricResult`, then promoted to `MetricSnapshot.bugCreationRate` by `buildSnapshot` (`index.ts:69-72`). A parallel write via `updateQualityBaseline` (`index.ts:361-369`) persists it to `BaselineRecord.bugCreationRate`. P-004 reads both sides to compare current vs. historical rate.

**Related patterns**: P-002 (Stalled Flow — primary signal), P-004 (Quality Crisis Signal — quality proxy carrier via `bugCreationRate`).

**Sources**: `src/metrics/cycleTimeVariance.ts`, `src/baseline/index.ts` (lines 209–230), `src/utils/constants.ts`.

---

## Confidence Scoring System

### Architecture

Every metric produces a `ConfidenceScorerInput` alongside its value. This input is passed to `computeConfidenceScore()` to derive a score (0.0–1.0) that gates pattern detection eligibility.

**`ConfidenceScorerInput` fields** (`src/metrics/confidenceScorer.ts`):
- `dataPointCount` — number of valid data points in computation
- `transitionCoverageRatio` — fraction of input issues contributing usable transitions (0.0–1.0)
- `endOfSprintClusteringRatio` — fraction of completions bunched near sprint end (0.0–1.0)
- `commentStatusTimestampDivergence` — gap in hours between comment and status update activity
- `reopenedIssueRate` — fraction of issues reopened at least once (0.0–1.0)

### Penalty Schedule

| Condition | Penalty | Final Score Multiplier |
|-----------|---------|------------------------|
| **Data point count** | | |
| < 5 points | Immediate zero return | 0.0 |
| < 10 points | Underweight | 0.5 |
| < 20 points | Underweight | 0.75 |
| **Transition coverage** | | |
| < 40% coverage | Severe penalty | 0.5 |
| < 70% coverage | Moderate penalty | 0.7 |
| **End-of-sprint clustering** | | |
| > 60% clustering | High noise penalty | 0.7 |
| > 40% clustering | Moderate noise penalty | 0.85 |
| **Comment/status divergence** | | |
| > 72 hours | Severe misalignment | 0.8 |
| > 24 hours | Moderate misalignment | 0.9 |
| **Reopened issue rate** | | |
| > 30% reopened | Rework penalty | 0.75 |
| > 15% reopened | Minor rework penalty | 0.9 |

Final score clamped to [0.0, 1.0] after all multipliers applied.

### Confidence Eligibility Thresholds

| Threshold | Applies To | Eligibility |
|-----------|-----------|---|
| ≥ 0.85 | P-001, P-002, P-003, P-005 (trend detection) | High confidence; eligible for pattern detection |
| ≥ 0.60 | P-001, P-003, P-005 (floor breach only) | Pattern may fire CRITICAL on absolute floor |
| ≥ 0.60 | P-004 (all conditions) | Quality patterns use lower gate |
| 0.60–0.84 | Dashboard display | Medium confidence; metrics shown, no diagnoses |
| < 0.60 | Dashboard display | Low confidence; suppressed with tooltip |

**Gating functions** (`src/metrics/confidenceScorer.ts`):
- `isEligibleForDiagnosis(score)` returns `true` if `score >= 0.85`
- `isEligibleForMetricsDisplay(score)` returns `true` if `score >= 0.60`

### Zero Confidence Input

When metric computation fails to produce a result, `zeroConfidenceInput()` is used (`src/metrics/metricPipeline.ts`):

| Situation | `transitionCoverageRatio` | Interpretation |
|-----------|---------------------------|---|
| `events.length === 0` | 1.0 | Nothing is missing; there is simply no data |
| `events.length > 0, no valid result` | 0.0 | Events exist but missing/incomplete transition data |

This distinction matters: empty team data returns neutral confidence; team data with missing transitions returns penalised confidence.

**Sources**: `src/metrics/confidenceScorer.ts` (lines 1–60), `src/metrics/metricPipeline.ts` (lines 1–43).

---

## Diagnostic Patterns

### P-001 · Chronic WIP Inflation

**Severity**: WARNING (trend), CRITICAL (floor breach)

**Detects**: Team accumulates WIP without increasing output; flow collapse risk.

**Primary metric**: `wip` | **Supporting metric**: `throughput`

**Trigger Conditions — Trend (WARNING)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Confidence gate | `wipSnap.confidenceScore >= 0.85` AND `tpSnap.confidenceScore >= 0.85` | Both metrics must be high-confidence |
| Baseline existence | `baseline.wip` and `baseline.throughput` non-null | Per-team baseline required |
| History minimum | `histories.wip.length >= 4` | At least 4 sprint records |
| WIP trend | Last 4 WIP entries strictly monotonically increasing | Each > previous, consecutive |
| Throughput stability | `\|tpSnap.value - tpBase.ewma\| / tpBase.ewma <= (0.10 / thresholdMultiplier)` | Throughput within ±10% of EWMA baseline |
| Persistence | 4 consecutive sprints meeting above | Trend must sustain |

**Trigger Conditions — Absolute Floor (CRITICAL)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| WIP breach | `wipSnap.value > config.teamSize * 3.0` | WIP exceeds 3× team size |
| Confidence gate | `wipSnap.confidenceScore >= 0.60` | Moderate confidence sufficient for floor |
| Baseline required | No | Floor fires without baseline |

**Metrics consumed**: `wip` (primary), `throughput` (corroboration).

**Threshold adjustment**: `thresholdMultiplier` applied to throughput flat tolerance; feedback loop tightens it by 10% after 3 NOT_ACCURATE signals.

**False positive guards applied**: Layer 1 (persistence), Layer 2 (per-team baseline), Layer 3 (confidence gate), Layer 4 (snooze/intentional suppression), Layer 5 (feedback adjustment).

**Sources**: `src/diagnostic/patterns/p001.ts` (lines 1–89), `src/diagnostic/patternBase.ts` (lines 10–11).

---

### P-002 · Stalled Flow

**Severity**: WARNING

**Detects**: Cycle time variance rising sharply; work completion is becoming unpredictable; some issues fly through while others stall.

**Primary metric**: `cycle_time_variance` | **Supporting metric**: `cycle_time` (informational context only)

**Trigger Conditions**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Confidence gate | `varSnap.confidenceScore >= 0.85` AND `ctSnap.confidenceScore >= 0.85` | Both metrics must be high-confidence |
| Baseline existence | `baseline.cycle_time_variance` non-null, `ewma > 0` | Baseline required and non-zero |
| History minimum | `histories.cycle_time_variance.length >= 2` | At least 2 sprint records |
| Variance trend | All 2 most-recent variance entries > `varBase.ewma * 1.5 * thresholdMultiplier` | Variance exceeds 50% above baseline for 2 sprints |
| Persistence | 2 consecutive sprints meeting above | Trend must sustain |
| Note | Cycle time stability (`CYCLE_TIME_STABLE_BAND = 0.20`) computed but NOT a gate | Informational evidence only; stability not required |

**Metrics consumed**: `cycle_time_variance` (primary), `cycle_time` (context only).

**Threshold adjustment**: `thresholdMultiplier` applied to variance multiplier; adjusted by feedback loop.

**False positive guards applied**: Layer 1 (persistence), Layer 2 (baseline comparison), Layer 3 (confidence gate), Layer 4 (suppression), Layer 5 (feedback adjustment).

**Sources**: `src/diagnostic/patterns/p002.ts` (lines 1–60).

---

### P-003 · Overloaded Team

**Severity**: WARNING (trend), CRITICAL (floor breach)

**Detects**: Team carrying elevated WIP while throughput declines; team is overloaded and output suffering.

**Primary metrics**: `wip`, `throughput`

**Trigger Conditions — Trend (WARNING)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Confidence gate | `wipSnap.confidenceScore >= 0.85` AND `tpSnap.confidenceScore >= 0.85` | Both metrics must be high-confidence |
| Baseline existence | `baseline.wip.ewma > 0` AND `baseline.throughput.ewma > 0` | Both baselines required, non-zero |
| History minimum | `histories.wip.length >= 2` AND `histories.throughput.length >= 2` | At least 2 sprint records each |
| WIP elevation | Last 2 WIP entries > `wipBase.ewma * 1.20 * thresholdMultiplier` | WIP > 20% above baseline for 2 sprints |
| Throughput decline | Last 2 throughput entries < `tpBase.ewma * 0.85 / thresholdMultiplier` | Throughput < 85% of baseline, i.e., >15% below, for 2 sprints |
| Persistence | 2 consecutive sprints meeting all above | Trend must sustain |

**Trigger Conditions — Absolute Floor (CRITICAL)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| WIP breach | `wipSnap.value > config.teamSize * 3.0` | WIP exceeds 3× team size |
| Confidence gate | `wipSnap.confidenceScore >= 0.60` | Moderate confidence sufficient for floor |
| Baseline required | No | Floor fires without baseline |
| Throughput required | No | Throughput not checked for floor path |

**Metrics consumed**: `wip` (primary), `throughput` (primary corroboration).

**Threshold adjustment**: `thresholdMultiplier` applied to both WIP and throughput thresholds; adjusted by feedback.

**False positive guards applied**: Layer 1 (persistence), Layer 2 (baseline), Layer 3 (confidence), Layer 4 (suppression), Layer 5 (feedback).

**Sources**: `src/diagnostic/patterns/p003.ts` (lines 1–108), `src/diagnostic/patternBase.ts` (lines 10–11).

---

### P-004 · Quality Crisis Signal

**Severity**: CRITICAL

**Detects**: Bug creation rate rising sharply while throughput falls; quality is deteriorating and consuming team capacity.

**Primary metric**: `cycle_time_variance` (quality proxy) | **Supporting metric**: `throughput`

**Trigger Conditions**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Metric availability | `varSnap` and `tpSnap` snapshots both exist | Both required |
| Confidence gate | `varSnap.confidenceScore >= 0.60` AND `tpSnap.confidenceScore >= 0.60` | **Lower threshold than other patterns** (0.60 not 0.85) |
| Issue type mapping | `config.issueTypeMapping` non-empty | Type mapping must be configured |
| Baseline bug rate | `baseline.cycle_time_variance.bugCreationRate > 0` | Baseline bug rate defined and > 0 |
| Baseline throughput | `baseline.throughput` non-null | Throughput baseline required |
| Bug rate spike | `varSnap.bugCreationRate > baselineBugRate * 1.30 * thresholdMultiplier` | Bug rate exceeds 30% above baseline |
| Throughput decline | `tpSnap.value < tpBase.ewma` | Throughput any amount below baseline |
| Persistence | None | Fires in single sprint when both conditions met |

**Metrics consumed**: `cycle_time_variance` (via `bugCreationRate` field, not variance value), `throughput`.

**Threshold adjustment**: `thresholdMultiplier` applied to bug rate threshold; adjusted by feedback.

**False positive guards applied**: Layer 2 (baseline comparison), Layer 3 (confidence gate at 0.60), Layer 4 (suppression), Layer 5 (feedback).

**Sources**: `src/diagnostic/patterns/p004.ts` (lines 1–72), `src/computation/index.ts` (lines 32–40, 69–72, 229–242, 361–369), `src/utils/types.ts` (line 170).

---

### P-005 · Invisible Backlog Pressure

**Severity**: WATCH (trend), CRITICAL (floor breach)

**Detects**: Lead time rising while cycle time stable; backlog is growing faster than team can work through it.

**Primary metric**: `lead_time` | **Supporting metric**: `cycle_time` (informational context only)

**Trigger Conditions — Trend (WATCH)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Confidence gate | `ltSnap.confidenceScore >= 0.85` AND `ctSnap.confidenceScore >= 0.85` | Both metrics must be high-confidence |
| Baseline existence | `baseline.lead_time` and `baseline.cycle_time` non-null | Both baselines required |
| History minimum | `histories.lead_time.length >= 3` | At least 3 sprint records |
| Lead time trend | All 3 most-recent lead time entries > `ltBase.ewma * 1.25 * thresholdMultiplier` | Lead time exceeds 25% above baseline for 3 sprints |
| Cycle time stability | `CYCLE_TIME_STABLE_MAX_DEVIATION = 0.20` computed and included in evidence | NOT a gate; informational only |
| Persistence | 3 consecutive sprints meeting above | Trend must sustain |

**Trigger Conditions — Absolute Floor (CRITICAL)**:

| Condition | Requirement | Threshold |
|-----------|-------------|-----------|
| Confidence gate | `ltSnap.confidenceScore >= 0.85` AND `ctSnap.confidenceScore >= 0.85` | High confidence required |
| Lead time breach | `ltSnap.value > 60` | Lead time exceeds 60 days |
| Baseline required | No | Floor fires without baseline |

**Metrics consumed**: `lead_time` (primary), `cycle_time` (context only).

**Threshold adjustment**: `thresholdMultiplier` applied to lead time multiplier; adjusted by feedback.

**False positive guards applied**: Layer 1 (persistence), Layer 2 (baseline), Layer 3 (confidence), Layer 4 (suppression), Layer 5 (feedback).

**Sources**: `src/diagnostic/patterns/p005.ts` (lines 1–97).

---

## Metric-to-Pattern Dependency Map

### Metric Consumers

| Metric | Consumed By | Role |
|--------|-------------|------|
| `cycle_time` | P-002, P-005 | P-002: context only; P-005: stability check (not a gate) |
| `cycle_time_variance` | P-002, P-004 | P-002: primary signal (stdDev); P-004: quality proxy (bugCreationRate field) |
| `lead_time` | P-005 | Primary detection signal |
| `throughput` | P-001, P-003, P-004 | P-001: flat confirmation; P-003: decline confirmation; P-004: decline confirmation |
| `wip` | P-001, P-003 | Both: primary detection signal |

### Pattern Input Requirements

| Pattern | Required Snapshots | Required Baselines | Required Histories | Confidence Gate |
|---------|-------------------|-------------------|-------------------|---|
| P-001 | `wip`, `throughput` | Both (trend only); none (floor) | `wip` ≥ 4 (trend only) | 0.85 (trend); 0.60 (floor) |
| P-002 | `cycle_time_variance`, `cycle_time` | `cycle_time_variance` (ewma > 0) | `cycle_time_variance` ≥ 2 | 0.85 |
| P-003 | `wip`, `throughput` | Both (trend only); none (floor) | Both ≥ 2 (trend only) | 0.85 (trend); 0.60 (floor) |
| P-004 | `cycle_time_variance`, `throughput` | Both required | None | 0.60 |
| P-005 | `lead_time`, `cycle_time` | Both (trend only); none (floor) | `lead_time` ≥ 3 (trend only) | 0.85 |

### Baseline EWMA Calculation

Each pattern compares current snapshot value against `baseline[metric].ewma` — the exponentially weighted moving average.

```
ewma_new = 0.3 * newValue + 0.7 * ewma_previous
```

**Characteristics**:
- Alpha coefficient: 0.3 (recent sprints weighted more)
- Adaptation window: 2–3 sprints to reach 90% of new level
- Rolling window bound: 24 entries maximum (`MAX_WINDOW_SIZE`)
- Stored alongside: `p50/p75/p90/stdDev` for full distribution context

**Usage**: All percentage-deviation thresholds in patterns are relative to EWMA. Universal thresholds (e.g., WIP > teamSize × 3.0) are floor overrides only.

**Sources**: `src/baseline/index.ts` (lines 18, 158–161), `docs/architecture.md` (§2.4).

### Snapshot History vs. Baseline EWMA

Two distinct data structures:

1. **`SnapshotHistories`** (per-sprint snapshots from `getSnapshotHistory()`): Used to verify persistence — whether signal appeared in consecutive sprints.
2. **`BaselineRecord.ewma`**: Comparison threshold for percentage-deviation checks.

Persistence verified via snapshot histories; threshold determined by EWMA.

---

## Confidence Gating and Calibration

### Calibration Gate

Before any pattern detection runs, `runPatternDetection()` in `src/diagnostic/engine.ts` calls `isCalibrationComplete(config)`. This function checks `config.calibrationComplete`.

**Calibration window**: 14 days from install (wall-clock time) OR after minimum sprint count threshold.

**Behavior when not complete**: `runPatternDetection` returns `[]` immediately. No patterns fire, no baselines are compared.

**After calibration complete**: All 5 patterns are eligible to fire.

**Sources**: `src/diagnostic/engine.ts` (lines 22–87), `src/computation/calibration.ts`, `docs/architecture.md` (§2.7).

### Threshold Multiplier (Feedback Loop)

`thresholdMultiplier` starts at 1.0 and is adjusted by the feedback loop (Layer 5) when users mark diagnoses as NOT_ACCURATE.

| NOT_ACCURATE Count | Effect | Mechanism |
|---|---|---|
| 0–2 | No adjustment | thresholdMultiplier = 1.0 |
| 3+ | Tighten thresholds by 10% | thresholdMultiplier = 1.1 (all % thresholds increase) |
| 5+ | Suppress pattern entirely | Pattern will not fire (logged as feedback_loop suppression) |

**Example**: P-003 with 3 NOT_ACCURATE signals:
- Normal WIP threshold: `wipBase.ewma * 1.20`
- Adjusted WIP threshold: `wipBase.ewma * 1.20 * 1.1 = wipBase.ewma * 1.32` (requires 32% above baseline instead of 20%)

**Stored as**: `thresholdMultiplier` record per (workspaceId, teamId, patternId).

**Sources**: `src/diagnostic/falsePositiveGuard.ts` (lines 77–89), `docs/architecture.md` (§2.8).

---

## False Positive Guard Architecture

Five-layer defence system. Layers 1–3 enforced by pattern detectors. Layers 4–5 enforced by `applyFalsePositiveGuard()`.

### Layer 1: Persistence Gates

**Enforced**: Inside each pattern's `detect*` function.

**Mechanism**: Candidate produced only if N consecutive sprints meet trigger condition. Any sprint failing condition → no candidate → pattern does not fire.

| Pattern | Persistence Requirement |
|---------|---|
| P-001 | 4 consecutive sprints with strictly increasing WIP |
| P-002 | 2 consecutive sprints with variance ≥ 50% above baseline |
| P-003 | 2 consecutive sprints with elevated WIP AND depressed throughput |
| P-004 | None (single-sprint fire) |
| P-005 | 3 consecutive sprints with lead time ≥ 25% above baseline |

### Layer 2: Per-Team Baselines

**Enforced**: Inside pattern detectors.

**Mechanism**: All percentage thresholds relative to `baseline[metric].ewma` (team-specific). Absolute universal thresholds never used for trend detection.

**Example**: Team A (normal WIP = 30) does not fire P-001 at WIP = 32. Team B (normal WIP = 8) fires at WIP = 9.7 (>20% threshold for P-003).

**Absolute floor multiplier** (only universal threshold): `teamSize * 3.0` for WIP; `60 days` for lead time.

**Sources**: `src/diagnostic/patterns/*.ts`, `src/baseline/index.ts`.

### Layer 3: Confidence Gating

**Enforced**: `meetsConfidence()` called in each pattern's `detect*` function.

**Mechanism**: `meetsConfidence(threshold, ...snaps)` returns `false` if any snapshot's `confidenceScore` < threshold. Pattern candidate not produced.

| Threshold | Applied To |
|-----------|-----------|
| 0.85 | P-001 (trend), P-002, P-003 (trend), P-005 (trend) |
| 0.60 | P-001 (floor), P-003 (floor), P-004 (all), P-005 (floor) |

**Gate logic**: Standard patterns need high confidence (0.85) for trend detection. Quality pattern (P-004) accepts moderate confidence (0.60). Floor breaches use 0.60 regardless of normal gate.

### Layer 4: Contextual Suppression

**Enforced**: `applyFalsePositiveGuard()` (`src/diagnostic/falsePositiveGuard.ts` lines 64–75).

**Mechanism**: Query existing `DiagnosisEvent` records for same `patternId`. Suppress candidate if:
- Any matching event has `status === 'INTENTIONAL'`, OR
- Any matching event has `status === 'SNOOZED'` and `snoozedUntilSprint > candidate.sprintId`, OR
- Any matching event has `status === 'ACTIVE'` (prevents duplicate active diagnoses)

**Effect**: User can mark a pattern "don't bother me" (INTENTIONAL) or "remind me later" (SNOOZED), and the pattern will not fire while suppressed.

### Layer 5: Feedback Loop

**Enforced**: `applyFalsePositiveGuard()` (lines 77–89).

**Mechanism**: Count `FeedbackEvent` records with `feedbackType === 'NOT_ACCURATE'` linked to diagnoses of this pattern ID.

| NOT_ACCURATE Count | Action |
|---|---|
| 0–2 | No action; thresholdMultiplier remains 1.0 |
| 3+ | Call `setNotAccurateAdjustment(workspaceId, teamId, patternId, 1.1)` → stores 1.10 multiplier |
| 5+ | Log suppression reason `feedback_loop`; pattern will not fire |

**On next cycle**: `runPatternDetection` passes `adjustments[i] ?? 1.0` as `thresholdMultiplier` to each `detect*`. Multiplier = 1.1 tightens all percentage thresholds by 10%.

**Reset**: Adjustment persists across sprints until explicitly cleared (no auto-decay).

### Layer Interaction Flow

```
[Raw Jira data]
       ↓
[Metric computation] — produces MetricSnapshot with confidenceScore
       ↓
[Calibration gate] (engine.ts) — returns [] if not calibrated
       ↓
[Pattern detectors: P-001 to P-005]
  ├─ Layer 1: Persistence gate (N consecutive sprints in histories)
  ├─ Layer 2: Baseline comparison (% deviation from team EWMA)
  └─ Layer 3: Confidence gate (snapshot.confidenceScore ≥ threshold)
       ↓ (DiagnosisCandidate if all pass)
[applyFalsePositiveGuard()]
  ├─ Layer 4: Contextual suppression (snooze / intentional check)
  └─ Layer 5: Feedback loop (NOT_ACCURATE count tightening)
       ↓ (DiagnosisEvent persisted to Forge Storage)
[Auto-resolve: active diagnoses whose pattern no longer fires → RESOLVED]
```

**Sources**: `src/diagnostic/falsePositiveGuard.ts` (lines 1–140), `src/diagnostic/engine.ts` (lines 22–87), `docs/architecture.md` (§2.8).
