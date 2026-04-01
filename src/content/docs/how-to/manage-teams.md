---
title: "Manage Teams"
description: "Add, edit, and remove teams from OrgPulse."
type: how-to
order: 2
category: how-to
---

# How to Manage Teams and Access

This guide shows you how to manage who can view OrgPulse and configure your team's size settings.

## Before you start

You must be able to view the OrgPulse dashboard for your Jira project. If you see an "Access restricted" message, contact your project administrator.

For background on how team metrics work, see [Understanding Metrics](/docs/understanding-metrics).

---

## Task 1: Open the Settings screen

1. Open the OrgPulse dashboard for your Jira project.
2. Click the **Settings** button in the top right of the dashboard header.
3. The Settings screen opens with four sections: Status Mapping, Issue Type Mapping, Team Size, and Access Management.

---

## Task 2: Add a user to the dashboard

Use this task to grant someone access to view OrgPulse data for your project.

1. Scroll down to the **Access Management** section.
2. In the search field below "Only users on this list (and project administrators) can view OrgPulse", type the user's name.
3. Wait for the dropdown to appear. You must type at least 2 characters before search results show.
4. The dropdown displays up to 10 matching users (users already on the allowlist are excluded).
5. Click the user's name.
6. The user is added immediately — no confirmation dialog appears.
7. The user now appears in the allowlist below the search field.

**Note**: The user who completed the onboarding wizard during initial setup is automatically added to the allowlist and does not need to be added again.

---

## Task 3: Remove a user from the dashboard

Use this task to revoke someone's access to OrgPulse data.

**Warning**: Removing a user revokes their access immediately. They will see an "Access restricted" message on their next page load.

**Critical**: If you remove yourself from the allowlist, you will be locked out of OrgPulse unless you are a Jira project administrator. Project administrators always have access regardless of the allowlist.

1. Scroll down to the **Access Management** section.
2. Find the user you want to remove in the allowlist below the search field.
3. Click the **Remove** button next to the user's name.
4. The user is removed immediately — no confirmation dialog appears.
5. On their next page load, the user will see the access-restricted message and cannot view OrgPulse data.

---

## Task 4: Understand the default access state

The access model works as follows:

**Empty allowlist (default)**
If no users have been added to the allowlist, all members of the Jira project can view OrgPulse.

**Non-empty allowlist**
Once you add the first user, OrgPulse becomes restricted. Only the following users can view OrgPulse:
- Users explicitly listed in the allowlist
- Jira project administrators (regardless of the allowlist)

There are no access tiers within OrgPulse (such as "view-only" vs "admin"). All users who can view OrgPulse see the same dashboard and settings.

---

## Task 5: Configure team size

Use this task to set or adjust the team size that OrgPulse uses for diagnostic thresholds.

### Understanding auto-detection

OrgPulse auto-detects team size by calculating the median number of unique assignees across the last 8 sprints. The auto-detected value updates after each computation cycle. For more detail, see [Understanding Metrics](/docs/understanding-metrics).

### Set a manual override

1. Scroll down to the **Team Size** section.
2. The card displays the current team size and source label ("Auto-detected" or "Manual override").
3. Enter a number between 1 and 100 in the input field below "Override team size".
4. Click **Set Override**.
5. The override is applied immediately. If you enter a value outside 1–100, an error message appears and the override is not applied.

### Clear a manual override

1. Scroll down to the **Team Size** section.
2. If an override is active, a **Clear Override** button is visible below the input field.
3. Click **Clear Override**.
4. The team size returns to the auto-detected value (or 0 if there is insufficient sprint history).

### Why team size matters

Team size affects the WIP (work in progress) thresholds that trigger diagnostic warnings. Specifically, OrgPulse fires a WIP overload warning when work in progress exceeds three times the team size. Adjust this setting to match your actual team capacity.

---

## Task 6: Understand who has access

### The allowlist and project administrators

Access is determined in this order:

1. If the allowlist is empty, all project members can view OrgPulse.
2. If the allowlist contains users, only those users can view OrgPulse.
3. Jira project administrators always have access, regardless of the allowlist.

### What unauthorised users see

Users who are not on the allowlist and are not project administrators see this message:

> "OrgPulse is available to team leads and project administrators. Contact your project administrator for access."

They cannot view any dashboard data, metrics, diagnoses, or settings.

---

## Next steps

- **Need to understand how diagnoses work?** See [How Diagnoses Work](/docs/how-diagnoses-work)
- **Setting up OrgPulse for the first time?** See [Getting Started](/docs/getting-started)
- **Configuring status or issue type mapping?** See [Configure Status Mapping](/docs/configure-status-mapping)
