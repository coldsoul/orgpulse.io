---
title: "Diagnoses Reference"
description: "Trigger conditions, severity levels, confidence requirements, and recommended actions for all five OrgPulse diagnostic patterns."
type: reference
order: 1
category: reference
---

# OrgPulse Diagnoses Reference

This document describes what OrgPulse diagnoses are, how they are triggered, and what actions teams typically take in response. It is designed for engineering team leads and managers using OrgPulse to understand their team's workflow health.

For detailed information about the metrics that feed diagnoses, see [OrgPulse Metrics Reference](/docs/metrics).

---

## Diagnoses

OrgPulse detects five diagnostic patterns. Each pattern monitors a combination of workflow metrics, compares current values against your team's own baseline (normal operating level), and fires when evidence accumulates across multiple sprints or when an absolute limit is breached. Diagnoses appear in the OrgPulse dashboard with a severity level and recommended actions.

### Chronic WIP Inflation — Warning / Critical

**What it means**

Your team's work in progress has been rising while output stayed flat, or WIP has exceeded safe limits. This typically signals that the team is starting more work than it can finish, causing context-switching and bottlenecks.

**Triggers**

This diagnosis fires in two scenarios:

1. **Trend (Warning)** — WIP rises for 4 consecutive sprints while throughput remains stable (within 10% of your baseline). Both metrics must have adequate data confidence.

2. **Absolute overload (Critical)** — WIP exceeds 3 times your team size in a single sprint. This indicates extreme parallel load that typically fragments focus regardless of trend history.

**Data confidence required**

- Trend detection: High confidence on both WIP and throughput metrics
- Absolute overload: Moderate-to-high confidence on WIP metric only

**Recommended actions**

- Introduce or enforce explicit work-in-progress limits in your workflow
- Audit in-progress items to confirm they are actively being worked on (not stalled)
- Review new work intake with stakeholders — discuss which items can be paused or de-scoped to clear the queue
- Identify competing priorities; reduce them or sequence them explicitly

---

### Stalled Flow — Warning

**What it means**

Cycle time has become unpredictable: some items move quickly while others get stuck. The variability in how long items take suggests bottlenecks or dependencies that are not affecting all work equally.

**Triggers**

Cycle time unpredictability (measured by variance) exceeds your baseline by 50% or more for 2 consecutive sprints, and both metrics have adequate data confidence.

**Data confidence required**

High confidence on both cycle time and cycle time variance metrics.

**Recommended actions**

- Examine items that have spent more than one full sprint in progress; escalate blockers
- Review dependencies on external teams or approvals — are they creating bottlenecks?
- Verify whether your team's "ready" criteria are being applied consistently; unclear requirements can cause rework and delays
- Discuss work item sizing: are some items causing longer cycle times because they are too large or complex?

---

### Overloaded Team — Warning / Critical

**What it means**

Your team has more work in progress than usual and is completing less work. This is the classic overload pattern: adding more work to an overloaded team slows everything down further.

**Triggers**

This diagnosis fires in two scenarios:

1. **Trend (Warning)** — For 2 consecutive sprints, WIP stays more than 20% above your baseline AND throughput drops below 85% of your baseline (a 15% decline). Both conditions must be true simultaneously.

2. **Absolute overload (Critical)** — WIP exceeds 3 times your team size while throughput is also declining. This indicates the team is overloaded and losing capacity.

**Data confidence required**

- Trend detection: High confidence on both WIP and throughput metrics
- Absolute overload: Moderate confidence on WIP, any confidence on throughput

**Recommended actions**

- Reduce active WIP to sustainable levels; use your team's typical completed-work-per-sprint as a guide
- Shield the team from mid-sprint scope additions and interrupts
- Discuss with stakeholders which active work streams are truly necessary; deprioritise or defer lower-priority streams
- Consider whether team members are context-switching across too many items; clarify focus

---

### Quality Crisis Signal — Critical

**What it means**

Your team is producing significantly more bugs than normal while completing less work. Quality controls may be under strain, or pressured delivery is reducing time for testing and review.

**Triggers**

In a single sprint, the proportion of bugs among newly created issues rises more than 30% above your team's typical bug rate, and throughput declines compared to baseline. Both conditions must occur together.

**Data confidence required**

Moderate-to-high confidence on both throughput and bug rate metrics (lower gate than other patterns, reflecting the inherent variability in quality signals).

**Recommended actions**

- Review recent changes to your release or code review process; have you relaxed quality gates?
- Examine whether WIP limits are being respected; rushed work tends to produce more bugs
- Discuss consciously with the team: were quality trade-offs made intentionally to meet a deadline? If so, plan time to address the resulting debt
- Check for increases in technical debt; a fragile codebase is more likely to produce bugs
- Review recent scope changes; unclear acceptance criteria often become rework-as-bugs

---

### Invisible Backlog Pressure — Watch / Critical

**What it means**

Items are waiting longer before work starts. Lead time (total time from creation to completion) is rising while cycle time (active work time) is stable, indicating the bottleneck is in your backlog, not in active work.

**Triggers**

This diagnosis fires in two scenarios:

1. **Trend (Watch)** — Lead time exceeds your baseline by 25% or more for 3 consecutive sprints while cycle time remains stable. This indicates backlog queue pressure.

2. **Extreme wait time (Critical)** — Lead time exceeds 60 days in a single sprint. Items spending this much time waiting is unsustainable.

**Data confidence required**

High confidence on both lead time and cycle time metrics (both trend and absolute overload scenarios).

**Recommended actions**

- Review your backlog for items that should be closed, rejected, or explicitly de-prioritised; a growing backlog without outflow causes long queues
- Check your intake process: is new work being added faster than your team can pull from the backlog?
- Examine the prioritisation process; long queues of "approved but not started" items suggest unclear priorities
- Consider whether adjacent teams or upstream approvers can help clear the queue
- If items are very old, discuss with stakeholders whether they are still relevant or can be archived

---

## Severity Levels

OrgPulse uses three severity levels to indicate urgency and health impact:

| Severity | Health Impact | Meaning |
|---|---|---|
| **Watch** | Minor | Early signal. The pattern is emerging. Monitor closely; conditions are developing but immediate action is not required. |
| **Warning** | Moderate | The pattern is established. Review with your team and discuss remediation. Intervention is recommended. |
| **Critical** | Major | Immediate action required. Either an absolute safety limit has been breached or a key quality indicator is deteriorating rapidly. |

---

## Health Score

OrgPulse computes a single health score for your team on a scale of 0–100:

- **100–85 (A)** — Healthy. No active diagnoses, or only minor Watch-level signals.
- **84–70 (B)** — Needs Attention. One or more Warning-level diagnoses active.
- **69–55 (C)** — Under Pressure. Multiple patterns detected or one Critical diagnosis.
- **54–40 (D)** — At Risk. Sustained pressure; multiple Critical diagnoses or combinations of patterns.
- **39–0 (F)** — Critical. Severe workflow dysfunction; immediate intervention recommended.

Each active diagnosis deducts points from your score:
- Watch diagnosis: −5 points
- Warning diagnosis: −15 points
- Critical diagnosis: −30 points

The score provides an at-a-glance view of team workflow health and can be tracked over time to show improvement as diagnoses resolve.

---

## Confidence Indicator

Every diagnosis is accompanied by a confidence indicator:

- **High confidence** — OrgPulse has sufficient data quality and history to be confident in this diagnosis. Act on it.
- **Medium confidence** — OrgPulse has detected the pattern but data quality is adequate rather than excellent. Review the context and use team knowledge to decide on action.
- **Low confidence** — Data quality is limited (early in tracking, or metrics are variable). Monitor the signal; do not action it unless the team independently recognises the issue.

Confidence reflects data completeness and statistical reliability, not severity. A Critical diagnosis at Medium confidence should still be taken seriously; it just means the triggering evidence is less complete than ideal.

OrgPulse prevents false positives by requiring minimum data confidence before raising diagnoses. Patterns do not fire if data quality is too low.

---

## Calibration Period

When OrgPulse is first installed on your team, diagnoses do not appear immediately. OrgPulse enters a 14-day calibration period during which it learns your team's normal operating patterns (baseline throughput, typical cycle time, expected WIP levels, etc.).

**Why?** Diagnoses compare current metrics against your own baseline. Without baseline data, OrgPulse cannot distinguish a normal sprint from an abnormal one.

**When do diagnoses start?** After 14 calendar days, OR once OrgPulse has ingested 3 complete sprints of data, whichever comes first. After calibration completes, it cannot be reset.

**What should you do?** Continue using OrgPulse normally. After the calibration period ends, you will see diagnoses appear automatically when patterns are detected.

---

## False Positive Safeguards

OrgPulse uses multiple protections to prevent incorrect diagnoses:

1. **Minimum data quality gates** — Patterns do not fire unless metrics have sufficient data points and transition history. Sparse or early-stage data cannot trigger diagnoses.

2. **Personal baselines** — Each team has its own baseline (normal operating level). Diagnoses are compared against your own patterns, not industry benchmarks. What is normal for one team may not be for another.

3. **Multi-sprint confirmation** — Most patterns require evidence to persist across 2–4 consecutive sprints. A single abnormal sprint typically does not trigger a diagnosis.

4. **Team feedback loop** — If you mark a diagnosis as "Not Accurate," OrgPulse learns from your feedback. After accumulating feedback on a pattern, OrgPulse automatically adjusts to reduce false positives.

5. **Intentional suppression** — You can mark a diagnosis as intentional (e.g., "we know WIP is high this sprint — it's temporary") or snooze it. While marked intentional or snoozed, OrgPulse will not re-raise that pattern.

These safeguards work together to keep the signal relevant and actionable, minimizing noise while catching real problems.

---

## Summary Table

| Diagnosis | Severity (Typical) | Key Signal | Typical Response |
|---|---|---|---|
| Chronic WIP Inflation | Warning / Critical | Work in progress rising while output flat | Reduce WIP limits; review new intake |
| Stalled Flow | Warning | Unpredictable cycle time; some items stuck | Escalate blockers; check dependencies |
| Overloaded Team | Warning / Critical | High WIP + declining throughput | Reduce active work; protect team from interrupts |
| Quality Crisis Signal | Critical | Bug rate ↑ + throughput ↓ | Review process changes; address technical debt |
| Invisible Backlog Pressure | Watch / Critical | Long wait times before work starts | Review and deprioritise backlog; check intake |
