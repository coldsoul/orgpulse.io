---
title: "Understanding Your Dashboard"
description: "A tour of the OrgPulse dashboard — health score, active diagnoses, metrics, and confidence indicators."
type: tutorial
order: 2
category: tutorials
---

# Understanding Your OrgPulse Dashboard

Welcome to OrgPulse. You've completed the initial setup, and your team's first 14 days of data has been collected. Now you're ready to read your live health dashboard for the first time. This tutorial teaches you how to interpret the information on your screen, understand what each panel is telling you, and take action on any issues OrgPulse detects.

By the end of this tutorial, you'll know:

- How to read your team's health score and grade
- What each metric in the Metrics panel means
- How to read a diagnosis card
- How to expand and explore diagnosis details
- How to snooze a diagnosis temporarily
- How to mark a situation as intentional (and clear it later)
- How to navigate to Settings and back

**Prerequisites**

- OrgPulse is installed in your Jira workspace
- You have completed the onboarding wizard (status and issue type mapping)
- At least 14 days have passed since installation (calibration is complete)
- You are a team lead or project administrator
- Your team has completed at least one sprint of work

---

## Step 1: Read Your Health Score and Grade

Open your OrgPulse dashboard by navigating to the Jira project page where OrgPulse is installed.

Look at the top left corner of the page. You'll see a coloured circle with a number inside (0–100) and a letter next to it (A, B, C, D, or F). The number is your **health score**. The letter is your **health grade**.

The circle and grade change colour based on how your team is performing:

- **Green circle + A grade**: Healthy (score 85–100)
- **Blue circle + B grade**: Needs Attention (score 70–84)
- **Amber circle + C grade**: Under Pressure (score 55–69)
- **Red circle + D or F grade**: At Risk or Critical (score below 55)

If you see an amber badge next to the app name that says "N active issues", that tells you how many workflow problems OrgPulse has detected that you should review.

**You should see:** A coloured health score circle with a number and a letter grade. If there are active issues, you'll also see a small amber "N active issues" badge.

---

## Step 2: Read the Metrics Panel (Left Column)

Look at the left side of the page below the header. You'll see a section labelled "METRICS" containing five rows. These are your team's key performance indicators.

Each row shows:

- **Metric name** (e.g., "Cycle Time")
- **Current value** and **unit** (e.g., "3.2 days")
- **Confidence signal bars** on the right (three vertical bars that indicate how reliable this data is)

The five metrics are:

1. **Cycle Time** — How long items take from when work starts until they're done. Lower is better; this means work moves quickly.
2. **Lead Time** — How long items take from creation until they're done. Includes waiting time before work begins.
3. **Throughput** — How many issues your team completes each sprint. Higher means more capacity.
4. **WIP** — How many items are in progress right now. High WIP often slows everything down.
5. **Cycle Time Variance** — How much cycle time fluctuates. Lower means more predictable delivery.

Each metric has **confidence signal bars** on the right showing how much you should trust the number:

- **Three green bars + "High"**: Reliable data. Trust this metric.
- **Two amber bars + "Med"**: Enough data but may shift slightly. Reasonable confidence.
- **One grey bar + "Low"**: Limited data. Treat with caution; this may change as more data comes in.

If any metric has an **amber background highlight**, that means it's currently more than 20% above your team's normal baseline. Check the Diagnoses panel (right column) for more details about why.

At the bottom of the Metrics panel, you'll see "Last synced: [date and time]". This tells you when OrgPulse last pulled data from Jira. OrgPulse updates daily automatically, but you can trigger a manual refresh anytime by clicking "Sync Now" in the header.

**You should see:** Five rows of metrics with names, values, units, and coloured signal bars. Some rows may have amber backgrounds if metrics are elevated above baseline.

---

## Step 3: Read the Diagnoses Panel (Right Column)

Look at the right side of the page, below the header. This is the **Diagnoses panel**. It contains cards that describe any workflow issues OrgPulse has detected.

If your team looks healthy and no issues have been found, you'll see a message: "No active issues — Your team looks healthy!" In that case, you can skip the remaining steps in this tutorial.

If issues have been detected, you'll see diagnosis cards stacked vertically. Each card shows:

1. **Severity badge** (top left) — coloured lozenge that says "Watch", "Warning", or "Critical":
   - **Watch** (light grey) — lowest severity; worth noting but not urgent (−5 health points)
   - **Warning** (amber) — moderate severity; needs attention (−15 health points)
   - **Critical** (red) — highest severity; urgent (−30 health points)

2. **Pattern name** (bold text) — the name of the issue detected, e.g., "Chronic WIP Inflation" or "Stalled Flow"

3. **Insight text** — one or two plain-English sentences explaining what the data is showing and why it matters

4. **Metric evidence** — one or two small columns showing the affected metric name, current value (in red if abnormal, normal colour otherwise), and baseline comparison (e.g., "baseline: 4.2 issues")

5. **Fired date** — when the issue was first detected

6. **Action buttons** (bottom right):
   - **Snooze** (clock icon) — temporarily hides this diagnosis for 2 sprints. Use when you know about the issue and are already handling it.
   - **Mark Intentional** (checkmark icon) — tells OrgPulse this situation is deliberate (e.g., planned crunch or a strategic decision). Use when the situation isn't actually a problem for your team.

**You should see:** One or more diagnosis cards in the right column, each with a severity badge, pattern name, insight text, evidence columns, and action buttons. If no issues are found, you'll see "No active issues — Your team looks healthy!"

---

## Step 4: Expand "What Could Be Happening?" (If Available)

Some diagnosis cards have a toggle button that says "What could be happening?" with a small arrow (▸) next to it. This toggle appears only if the diagnosis has additional context.

Click the toggle to expand it. You'll see two sections:

- **Common process factors** — a bulleted list of likely root causes (e.g., "Too many competing priorities" or "Team members blocked waiting for another team")
- **Consider** — a bulleted list of suggested actions you might take to investigate or address the issue

Read through these to understand what might be causing the detected issue and what steps you could explore.

Click the toggle again (now showing ▾) to collapse this section.

**You should see:** Additional details appear when you click the toggle, including likely causes and suggested actions. If the toggle button doesn't appear on a diagnosis, that diagnosis doesn't have extra context.

---

## Step 5: Snooze a Diagnosis

If you see a diagnosis card and you're already aware of the issue and actively working on it, you can snooze it so it doesn't clutter your dashboard temporarily.

Hover over the **Snooze button** (clock icon) on the diagnosis card. A tooltip will appear: "Hide this diagnosis for 2 sprints. It will return if the signal persists."

Click the button. The diagnosis card will immediately move to a "RESOLVED / SNOOZED" section at the bottom of the Diagnoses panel and will stay hidden for 2 sprints. If the underlying issue persists, the diagnosis will reappear in the active list automatically when the 2-sprint window closes.

If you change your mind, you can click into the "RESOLVED / SNOOZED" section, find the card, and click "Unsnooze" to bring it back to the active list immediately.

**You should see:** The diagnosis card moves to the "RESOLVED / SNOOZED" section and disappears from the active list.

---

## Step 6: Mark a Diagnosis as Intentional (and Clear It Later)

If you're in a period where the detected issue is actually deliberate — for example, you're running a planned crunch sprint, accepting technical debt intentionally, or making a strategic trade-off — you can tell OrgPulse that the situation isn't a problem.

Hover over the **Mark Intentional button** (checkmark icon) on the diagnosis card. A tooltip will appear: "Tell OrgPulse this situation is deliberate (e.g. planned crunch). Suppresses future alerts for this pattern."

Click the button. The diagnosis card will move to the "RESOLVED / SNOOZED" section and gain a green badge that says "intentional". OrgPulse will stop alerting you about this pattern until you clear the intentional flag.

**To clear an intentional flag later:**

1. Scroll down in the Diagnoses panel to the "RESOLVED / SNOOZED" section
2. Find the card marked "intentional"
3. Click the expand arrow (▸) to open the full card
4. You'll see a warning message: "This pattern is suppressed indefinitely. Future signals will not alert unless you clear this."
5. Click the "Clear intentional" button
6. The diagnosis returns to active status and future alerts will resume

**You should see:** The diagnosis card moves to the "RESOLVED / SNOOZED" section with a green "intentional" badge. When you clear it later, the card returns to the active list.

---

## Step 7: Navigate to Settings and Return

If you need to adjust how OrgPulse maps your team's workflow (changing which statuses mean "in progress" or "done", adjusting team size, managing access, or updating issue type rules), you can navigate to Settings.

Look at the top right of the dashboard header. You'll see a subtle **Settings button** to the left of the "Sync Now" button. Click it.

The page will transition to the Settings page, which has four sections:

- **Status Mapping** — configure which Jira statuses correspond to workflow states
- **Issue Type Mapping** — configure which issue types are bugs vs. regular work
- **Team Size** — set the size of your team
- **Access Management** — manage which users can see the dashboard

(You don't need to make changes right now; this is just showing you where Settings is.)

At the top of the Settings page, you'll see a **"← Back to Dashboard" link**. Click it to return to your live dashboard.

**You should see:** The Settings page opens when you click Settings. The "← Back to Dashboard" link takes you back to the dashboard.

---

## What's Next?

You now know how to read your team's health score, understand your metrics, and interpret diagnoses. Here are some natural next steps:

- **Learn more about metrics** — See [Understanding Metrics](/docs/understanding-metrics) to understand how each metric is calculated and what high/low values mean for your team.

- **Dive deeper into diagnoses** — See [How OrgPulse Diagnoses Work](/docs/how-diagnoses-work) to understand the patterns OrgPulse detects, why they matter, and what assumptions it makes.

- **Look up a specific diagnosis** — See [Diagnoses Reference](/docs/diagnoses) for a complete reference of all five diagnosis patterns, their criteria, and typical remedies.

- **Configure your team's workflow** (coming soon) — See [Configure Status Mapping](/docs/configure-status-mapping) to customise how OrgPulse interprets your Jira statuses.

- **Manage team membership and size** (coming soon) — See [Manage Teams](/docs/manage-teams) to add or remove team members and adjust team size.

---

**Questions?** Check the [Diagnoses Reference](/docs/diagnoses) or [Metrics Reference](/docs/metrics) for specifics about any pattern or metric you see on your dashboard.
