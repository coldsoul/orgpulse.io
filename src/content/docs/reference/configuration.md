---
title: "Configuration Reference"
description: "All OrgPulse configuration options — status mapping, team settings, baseline resets, and notification settings."
type: reference
order: 3
category: reference
---

# OrgPulse Configuration Reference

This document describes every configuration setting in OrgPulse, the values they accept, and the effects they have on metrics and diagnoses. Configuration is per-team and persists from the moment of first setup onwards.

For step-by-step instructions on changing these settings, see [Configure Status Mapping](/docs/configure-status-mapping), [Manage Teams](/docs/manage-teams), and [Getting Started](/docs/getting-started).

---

## Status Mapping

OrgPulse normalises your Jira workflow statuses to five semantic states. This mapping is required before any metric computation or diagnosis can run. The mapping is per-team and is auto-detected on first setup based on status names and Jira category hints, then confirmed by the user.

### The Five Semantic States

| State | Meaning | Typical Jira statuses |
|---|---|---|
| **Not Started** | Work has not begun | Backlog, To Do, Open, New, Ready, Untriaged |
| **In Progress** | Work is actively being done | In Progress, In Dev, Doing, WIP, Development, In Flight |
| **Blocked** | Work is impeded or waiting | Blocked, On Hold, Waiting, Impediment, Parked, Pending |
| **In Review** | Work is being reviewed or tested | In Review, Code Review, QA, Testing, UAT, Staging, Awaiting Release |
| **Done** | Work is complete | Done, Closed, Resolved, Released, Completed, Deployed, Shipped |

### Auto-Mapping

When you first access OrgPulse Settings, the system automatically suggests a mapping for each of your team's Jira statuses using this logic:

**Step 1 — Keyword match** (checked first)

The status name is lowercased and checked for these keywords:

| Keyword(s) | Mapped to |
|---|---|
| Contains `block` | **Blocked** |
| Contains `review`, `qa`, or `testing` | **In Review** |

**Step 2 — Jira category fallback** (if no keyword match)

| Jira `statusCategory` | Mapped to |
|---|---|
| `TO_DO` or `new` | **Not Started** |
| `IN_PROGRESS` or `indeterminate` | **In Progress** |
| `DONE` or `complete` | **Done** |

**Step 3 — Default** (if neither rule matches)

The status is assigned to **In Progress**. The UI will render this without a suggested category indicator, so you know to review it.

### Server-Side Matching During Ingestion

When OrgPulse syncs your Jira data, it matches each transition in the changelog to a semantic state using four-step fallback logic:

1. Exact match (case-sensitive) against your saved status mapping
2. Case-insensitive match against your saved mapping
3. Partial keyword match against OrgPulse's default pattern library (30 predefined patterns across the five states)
4. Unmapped (returns `null` if no match at any step)

### Unmapped Statuses

If a Jira status cannot be mapped by the four-step process above, OrgPulse records it as **unmapped**.

**Consequence**: Transitions into an unmapped status are silently excluded from all metrics. Transitions from an unmapped status are recorded with a `null` source state. If key intermediate statuses in your workflow are left unmapped, cycle time measurements and WIP counts become less accurate.

**Required action**: All Jira statuses should appear in your status mapping for accurate metrics.

### When Changes Take Effect

Changes to status mapping apply from the **next sync cycle** onwards. They do not affect historical data already ingested. Syncs run daily automatically; you can also trigger a sync on demand via the "Sync Now" button on the dashboard.

---

## Issue Type Mapping

OrgPulse classifies every Jira issue type as either **Bug** or **Non-Bug**. This classification feeds the Quality Crisis Signal (P-004) diagnosis and helps OrgPulse understand your team's work composition. The mapping is per-team and auto-detected on first setup.

### The Two Issue Type Categories

| Category | Meaning | Used for |
|---|---|---|
| **Bug** | Defect, incident, regression, hotfix | Quality crisis detection (P-004) |
| **Non-Bug** | Feature, task, story, spike, chore | Flow and throughput metrics |

### Auto-Mapping

When you first access OrgPulse Settings, the system suggests a mapping based on this rule:

| Keyword(s) in type name | Mapped to |
|---|---|
| Contains `bug`, `defect`, `incident`, `fault`, or `regression` | **Bug** |
| No keyword match (default) | **Non-Bug** |

### Server-Side Matching During Ingestion

When OrgPulse syncs your Jira data, it matches each issue type using four-step logic:

1. Exact match (case-sensitive) against your saved issue type mapping
2. Case-insensitive match
3. Partial keyword match against OrgPulse's default patterns:
   - **Bug patterns**: Bug, Defect, Incident, Production Issue, Hot Fix, Hotfix, Regression, Error, Outage
   - **Non-Bug patterns**: Story, Task, Epic, Spike, Feature, Improvement, Tech Debt, Sub-task, Subtask, Chore
4. Unmapped (returns `null` if no match)

### Unmapped Issue Types

If an issue type cannot be mapped, the entire issue is dropped from all metrics. This is more restrictive than status unmapping because issue type is fundamental to deciding whether an issue contributes to flow metrics at all.

**Required action**: Ensure all your issue types appear in the issue type mapping.

### When Changes Take Effect

Changes apply from the next sync cycle onwards. Syncs run daily automatically; use "Sync Now" on the dashboard to sync immediately.

---

## Team Size

Team size is used to calculate the WIP (work in progress) absolute floor alarm threshold and to determine your team's size cohort for contextual baseline comparisons. OrgPulse can detect team size automatically or accept a manual override.

### Team Size Buckets

| Bucket | Raw size range |
|---|---|
| **1–4** | 1 to 4 people |
| **5–8** | 5 to 8 people |
| **9–15** | 9 to 15 people |
| **15+** | 16 or more people |

### Auto-Detection

OrgPulse counts the number of unique assignees per sprint during ingestion. After 2 or more sprints of data are accumulated, it computes the **median** of those assignee counts and uses it as your detected team size.

**Note**: Account IDs are never stored. Only the count of unique people per sprint is tracked.

**When to override**:
- Your team is new and lacks sufficient historical sprint data
- Your team size changed significantly and auto-detection lags behind reality
- You want to constrain the WIP threshold more or less aggressively

### Manual Override

| Parameter | Valid range | Default |
|---|---|---|
| Team size override | 1 to 100 | (auto-detected) |

When you set an override, it immediately becomes the effective team size for all metrics until you clear it. When you clear the override, OrgPulse reverts to the current auto-detected value.

To change team size, see [Manage Teams](/docs/manage-teams).

### WIP Floor Threshold

Formula: WIP > **team size × 3.0**

If work in progress exceeds this absolute threshold in a single sprint, OrgPulse fires the Chronic WIP Inflation diagnosis (P-001) at Critical severity, regardless of your baseline history. This is a hard ceiling meant to catch extreme overload that fragments focus.

This threshold is not configurable.

---

## Access Management

OrgPulse uses an allowlist-based access model to control which Jira users can view the dashboard. The allowlist is empty by default (allowing all project members to access OrgPulse) and becomes restrictive only when you add the first user to it.

### Access Rules

The system checks these conditions in order:

| Condition | Result | Notes |
|---|---|---|
| No configuration exists yet | **Allow** | Before setup is complete |
| Allowlist is empty | **Allow** | Unrestricted — all project members can view |
| User is on the allowlist | **Allow** | Explicitly granted |
| User is a project administrator in Jira | **Allow** | Admins always bypass the allowlist |
| None of the above | **Deny** | User sees: "OrgPulse is available to team leads and project administrators. Contact your project administrator for access." |

### Allowlist Seeding

When you complete the OrgPulse onboarding wizard, the user account who completed onboarding is automatically added to the allowlist. This ensures at least one person can access OrgPulse immediately after setup.

### Default State

The allowlist starts empty. All project members can access OrgPulse. The UI shows: "No users added yet. All project members can currently view OrgPulse."

### Adding and Removing Users

The allowlist has no enforced maximum size. When you search to add a user, OrgPulse shows up to 10 matching users at a time (UI affordance only; the underlying allowlist has no size cap).

**Removal takes effect immediately**. Users removed from the allowlist can no longer access OrgPulse on their next page load.

To manage access, see [Manage Teams](/docs/manage-teams).

---

## Sync and Data Ingestion

OrgPulse regularly syncs your Jira data, ingests it, computes metrics, and updates diagnoses. Sync behaviour is not configurable but is observable.

### Sync Cadence

OrgPulse runs a full computation cycle **once per day** via an automated scheduled trigger. This cadence is fixed and cannot be changed per team or per workspace.

### Incremental vs. Full Sync

The ingestion engine automatically chooses between incremental and full sync:

| Condition | Mode | Scope |
|---|---|---|
| First ever sync (no prior `lastSyncedAt` timestamp) | Full fetch | All issues in the project |
| Last sync was within 7 days | Incremental | Only issues modified in the last 7 days |
| Last sync was more than 7 days ago | Full fetch | All issues (data gap recovery) |

The 7-day threshold is fixed and not configurable. Incremental sync is more efficient; full sync is triggered automatically if OrgPulse detects it has missed more than a week of data.

### Manual "Sync Now"

The OrgPulse dashboard has a "Sync Now" button that triggers an immediate full computation cycle without waiting for the next scheduled time. This is useful for testing configuration changes or when you want immediate feedback.

---

## Calibration Period

The calibration period is a mandatory warm-up phase after you first install OrgPulse. During this period, metrics are visible and labelled "learning", but diagnostic patterns do not fire. Calibration ensures OrgPulse has enough baseline data before it starts raising alarms.

### Calibration Duration

Calibration completes automatically when **either** of these conditions is met (whichever comes first):

| Condition | Duration |
|---|---|
| Time elapsed since install | 14 days |
| Sprints of data ingested | 3 sprints |

Calibration cannot be manually started, paused, or reset. Once it completes, it remains complete for the lifetime of your team configuration in OrgPulse.

### What Happens During Calibration

- Metrics are computed and visible on the dashboard
- Metrics are labelled "learning" to indicate limited historical data
- No diagnostic patterns fire
- Your team's baseline is being established

### What Happens After Calibration

- Diagnostic patterns can now fire and appear on the dashboard
- Confidence scores become active
- Baselines are considered established and subsequent data is compared against them

---

## Cross-References

For step-by-step instructions on configuring these settings:

- **Status mapping**: [Configure Status Mapping](/docs/configure-status-mapping)
- **Issue type mapping**: Covered in [Configure Status Mapping](/docs/configure-status-mapping)
- **Team size and access**: [Manage Teams](/docs/manage-teams)
- **First-time setup**: [Getting Started](/docs/getting-started)
- **Understanding the dashboard**: [Understanding Your Dashboard](/docs/understanding-your-dashboard)

For background on the metrics and diagnoses that depend on these configurations:

- [Metrics Reference](/docs/metrics)
- [Diagnoses Reference](/docs/diagnoses)
- [How Diagnoses Work](/docs/how-diagnoses-work)
- [Understanding Metrics](/docs/understanding-metrics)
