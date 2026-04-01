---
title: "Getting Started with OrgPulse"
description: "Install OrgPulse from the Atlassian Marketplace, connect your team, and get your first health score in under 5 minutes."
type: tutorial
order: 1
category: tutorials
---

# Getting Started with OrgPulse

Welcome to OrgPulse. In this tutorial, you'll install OrgPulse from the Atlassian Marketplace, configure it for your team, and see your first health score and diagnosis.

By the end, you'll have a working health dashboard ready for your team's use.

## Before you begin

You'll need:

- Admin access to your Jira Cloud workspace
- A Jira project with at least one sprint's worth of workflow data
- 10–15 minutes

OrgPulse reads only your workflow data — issue statuses, types, and transitions. OrgPulse does not store issue titles, descriptions, comments, or assignee names. [Learn more about privacy.](/privacy)

## Step 1: Install OrgPulse from the Atlassian Marketplace

1. In your Jira workspace, click **Settings** (bottom left) → **Apps** → **Find new apps**.
2. Search for **OrgPulse**.
3. Click the OrgPulse card and then **Get app** (or **Install** if you see it).
4. Jira will show a permissions screen. Review the scopes listed — all are read-only, and no data leaves Atlassian. Click **Accept**.

You should see a confirmation message: "OrgPulse installed successfully."

## Step 2: Open OrgPulse

1. Open any Jira project.
2. In the left sidebar under the project name, you'll see a new link: **OrgPulse**. Click it.
3. The app will load. If this is your first time, you'll see an onboarding wizard with a progress bar at the top showing three steps: **Mapping** → **Access** → **Complete**.

You should see the first step heading: "Map your Jira statuses".

## Step 3: Map your Jira statuses

1. You'll see an information banner explaining that OrgPulse needs to discover your workflow. Click **Discover Statuses & Issue Types**.
2. OrgPulse will scan your Jira project for all workflow statuses and issue types. This usually takes less than a minute. A spinner will appear while it works.
3. Once the scan completes, you'll see two tables.

### Understanding the status mapping table

The first table shows all statuses in your Jira workflow. Each row has three columns:

- **Jira Status** — the status name as it appears in Jira (e.g. "Backlog", "In Progress", "Done")
- **Auto-detected** — a badge showing how OrgPulse guessed the mapping (from status category or name pattern)
- **OrgPulse State** — a dropdown with five universal states OrgPulse uses

OrgPulse uses five universal states to compare teams fairly across any Jira workflow:

| OrgPulse State | Meaning | Equivalent Jira statuses |
|---|---|---|
| To Do | Work not yet started | Backlog, Open, Ready, To Do |
| In Progress | Work actively being done | In Development, In Progress, WIP |
| Blocked | Work paused waiting for something | Blocked, Waiting, On Hold |
| In Review | Work done but waiting for sign-off | In Review, Code Review, Testing, QA |
| Done | Work complete | Done, Closed, Resolved |

OrgPulse has already auto-mapped your statuses using smart rules — matching keywords and Jira status categories. Most of the time, the defaults are correct.

> **Note:** The dropdown options use OrgPulse's internal state names (for example, `NOT_STARTED`, `ACTIVE`, `BLOCKED`, `REVIEW`, `DONE`). Use the table above to match them to the plain-English names (To Do, In Progress, Blocked, In Review, Done).

4. Review each row. If an auto-mapping is wrong, click the dropdown and select the correct OrgPulse State.

You should see the status table with dropdowns pre-filled. If your Jira workflow uses "Blocked" as a status, it should be mapped to "Blocked". If you have a "Code Review" status, it should be mapped to "In Review".

### Understanding the issue type mapping table

Below the status table, you'll see the issue type table. This shows all issue types in your Jira project.

OrgPulse classifies issue types into two categories:

| Category | Meaning |
|---|---|
| Bug | Issue type is a defect, incident, regression, or bug |
| Non-Bug | Issue type is a feature request, task, or story |

Why does this matter? OrgPulse uses bug classification to detect a pattern called "Quality Crisis Signal" — when your team's bug rate suddenly increases while throughput drops.

5. Review each row. Auto-mapping has already classified issue types containing keywords like "bug", "defect", or "incident" as bugs. Everything else defaults to non-bug. Adjust if needed.

You should see the issue type table with all your issue types listed and pre-mapped.

6. Click **Next** to save both mappings and move to the next step.

The wizard should advance to step 2: "Manage access".

## Step 4: Manage access

1. You'll see a heading: "Manage access" and an explanatory message about who can view the dashboard.

By default, all project members can see the OrgPulse dashboard. You can add specific team leads to restrict access — only workspace admins and the team leads you add will be able to view health data.

2. In the search field, type a team lead's name (minimum 2 characters to trigger search).
3. A dropdown will show matching Jira users with their avatars. Click a user to add them.
4. The user appears in the list below with a **Remove** button if you change your mind.
5. Repeat to add more team leads if needed.

You should see a search field and a list of any users you've added. If you've added no one, it should say "No users added yet. All project members can currently view OrgPulse."

6. Click **Next** to save access settings and move to the final step.

The wizard should advance to step 3: "Setup complete".

## Step 5: Complete onboarding

1. You'll see a success banner explaining that OrgPulse is now entering a 14-day calibration period.

OrgPulse needs 14 days of workflow data to establish personal baselines for your team. During these 14 days, OrgPulse collects data but won't fire any diagnoses yet. This prevents false alarms based on incomplete data.

2. Below the banner, you'll see two summary cards showing:
   - How many statuses you mapped (e.g. "7 statuses mapped")
   - How many issue types you classified (e.g. "12 issue types / 2 bugs, 10 non-bugs")

3. Click **Go to Dashboard** to finish onboarding.

You should see the main OrgPulse dashboard appear. At the top is a health score circle (currently showing low confidence data) and a letter grade. Below is a layout with metrics on the left and a diagnoses panel on the right.

## Step 6: Your dashboard during calibration

You're now on the dashboard. A blue banner near the top says:

> **Calibration in progress**
> First baseline results will be available within 14 days of install.

This is normal. OrgPulse is collecting your team's workflow data. After 14 days, the banner will disappear and your first diagnoses will appear (if any patterns are detected).

### What you see now

- **Health score circle** (top left) — currently shows a low-confidence score because OrgPulse hasn't gathered enough data yet
- **Metrics panel** (left column) — five metrics: Cycle Time, Lead Time, Throughput, WIP, and Cycle Time Variance. Each shows a current value and a confidence indicator (High/Med/Low). During calibration, confidence will likely be Low or Medium.
- **Diagnoses panel** (right column) — currently shows "No active issues — Your team looks healthy!" because no patterns have fired yet

The "Sync Now" button (top right) forces OrgPulse to pull the latest data from Jira immediately instead of waiting for the automatic daily sync.

You should see the health score and all five metrics displayed. Clicking on any metric name shows a tooltip explaining what it measures.

## What happens next

Over the next 14 days:

- OrgPulse pulls your team's workflow data daily
- Once calibration completes, the blue banner disappears
- If any diagnostic patterns are detected, diagnosis cards will appear in the right panel with plain-English insights about what's happening

For example, you might see: "Chronic WIP Inflation — Your team's WIP has been rising for 4 sprints while throughput remains flat."

### Learn more

Once you see your first diagnosis (or any time after calibration), you can:

- **Understand diagnoses** — [Read how OrgPulse diagnoses work](/docs/how-diagnoses-work)
- **Look up a specific diagnosis** — [View all diagnoses and what they mean](/docs/diagnoses)
- **Understand metrics** — [Learn what Cycle Time, Lead Time, and other metrics measure](/docs/metrics)
- **Adjust status mapping** — [How to reconfigure status mapping after onboarding](/docs/configure-status-mapping) *(coming soon)*
- **Manage team access** — [How to add or remove team members from the dashboard](/docs/manage-teams) *(coming soon)*

## You're done

You have successfully:

- Installed OrgPulse from the Atlassian Marketplace
- Mapped your Jira statuses to OrgPulse's five universal states
- Classified your issue types as bugs or non-bugs
- Set up team access
- Reached the dashboard and started calibration

OrgPulse is now working. Return to the dashboard in 14 days to see your first results. If you have questions before then, check the documentation above or contact your workspace admin.

Welcome to the team.
