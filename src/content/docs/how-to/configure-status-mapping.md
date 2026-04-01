---
title: "Configure Status Mapping"
description: "Map your Jira workflow statuses to OrgPulse's five universal semantic states."
type: how-to
order: 1
category: how-to
---

# How to Configure Status Mapping

This guide shows you how to open settings, change mappings, and handle unmapped statuses in OrgPulse.

After completing the onboarding wizard, your Jira statuses are automatically mapped to five OrgPulse states. You can modify these mappings at any time.

## Open status mapping settings

1. In your OrgPulse dashboard, click **Settings** in the top-right corner.
2. The Settings page opens showing your current status mapping.
3. Click the **Edit** toggle next to "Status Mapping" if the table is collapsed.
4. The full status mapping table is now visible.

To return to the dashboard, click **← Back to Dashboard** at the top of the Settings page.

**Note:** If you just completed onboarding, your status mapping has already been configured during that process.

## Change a status mapping

1. Open Settings and navigate to Status Mapping (see above).
2. Find the Jira status you want to change in the table.
3. Click the dropdown under **OrgPulse State** for that status.
4. Select the correct state from the list:
   - **To Do** — issue is queued, work has not begun
   - **In Progress** — issue is being actively worked on
   - **Blocked** — work is stalled and requires intervention
   - **In Review** — issue is under review or testing
   - **Done** — issue is complete
5. Your change saves automatically when you select a new state. There is no Save button.

After saving, the dropdown updates to show your selection. The change takes effect from the next sync cycle, not immediately. Existing metrics already processed do not retroactively change.

## Re-run auto-mapping for newly discovered statuses

When you add a new status to your Jira workflow and that status appears in OrgPulse for the first time, it is added to your status mapping automatically:

1. When you next open the Settings page, OrgPulse scans Jira and discovers any new statuses.
2. New statuses appear in the table and are automatically mapped using OrgPulse's built-in rules.
3. The mapping uses keyword matching first: if the status name contains "block", it maps to Blocked; if it contains "review", "qa", or "testing", it maps to In Review.
4. If no keyword matches, the mapping falls back to Jira's status category (To Do, In Progress, or Done).

**Warning:** The status mapping table is not automatically refreshed in real time. If you recently added a new Jira status and do not see it in the Settings table, close the Settings page and reopen it to trigger a fresh scan.

## Handle unmapped statuses

A status is unmapped when it does not match any of OrgPulse's auto-mapping rules and has not been manually configured.

### What happens with unmapped statuses

- Transitions to unmapped statuses are silently skipped during metric calculation.
- Issues involving unmapped statuses may show incomplete data.
- Confidence scores may be lowered because transition data is missing.
- Unmapped statuses are excluded from diagnoses if confidence falls below the required threshold.

### Identify unmapped statuses

Currently, OrgPulse does not display a warning badge for unmapped statuses in the dashboard. To find them:

1. Open Settings > Status Mapping.
2. Look for any row where the **OrgPulse State** dropdown shows **ACTIVE** — this is the default applied to all statuses that have not been explicitly configured.
3. If you suspect unmapped statuses are causing issues, contact your workspace administrator.

### Fix an unmapped status

1. Open Settings > Status Mapping > Edit.
2. Find the unmapped status in the table.
3. Click the dropdown under **OrgPulse State** and select the appropriate state.
4. The status is mapped immediately and metrics will reflect it from the next sync.

**Important:** Mapping a status only affects data collected from that point forward. Metrics already computed with that status missing will not be retroactively recalculated.

## Handle new Jira statuses (after setup)

When your team adds a new status to your Jira workflow after initial OrgPulse setup:

1. The new status will first appear in your OrgPulse status mapping table during the next Settings page load.
2. OrgPulse automatically suggests a mapping based on the status name and Jira category.
3. If the auto-suggestion is incorrect, change the mapping manually using the steps in "Change a status mapping" above.
4. The new status is active from the next sync cycle.

## See also

- [Getting Started](/docs/getting-started) — Initial setup and onboarding
- [Configuration Reference](/docs/configuration) — All settings available in OrgPulse
- [How Diagnoses Work](/docs/how-diagnoses-work) — Why status mapping affects your diagnoses
