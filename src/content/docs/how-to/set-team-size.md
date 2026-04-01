---
title: "Set Team Size"
description: "Configure the team size OrgPulse uses for WIP-per-person calculations."
type: how-to
order: 3
category: how-to
---

# How to Set Team Size

OrgPulse uses your team size to calculate work-in-progress thresholds and establish performance baselines. This guide shows you how to view and adjust your team size setting.

## View your current team size

1. In your OrgPulse dashboard, click **Settings** in the top-right corner.
2. Scroll to the **Team Size** card (the third card on the Settings page).
3. You'll see:
   - Your current team size (displayed as a large number)
   - A label showing the size category (e.g. "5–8 members")
   - A source indicator: either "Auto-detected" or "Manual override"
   - Optionally, the date when the size was last auto-detected

**Auto-detected** means OrgPulse counted the number of unique assignees across your sprints and calculated the median. **Manual override** means a team lead has set the size explicitly.

To return to the dashboard, click **← Back to Dashboard** at the top of the Settings page.

## Set a manual team size

If you need to correct an inaccurate team size or configure the size immediately (before auto-detection has enough data):

1. Open Settings and scroll to the **Team Size** card.
2. In the input field labelled "Enter team size", type a whole number between **1 and 100** representing your team's actual headcount.
3. Click the **Set Override** button.
4. Your change is saved immediately. The source indicator updates to "Manual override".

**Important:** Enter a whole number within the valid range (1–100). If the **Set Override** button appears unresponsive after clicking, check that your entry is a valid whole number within this range.

You have now set a manual override that will remain active until you clear it.

## When to override team size

You should set a manual override in these scenarios:

### Your team is newly formed

OrgPulse's auto-detection requires at least two sprints with assignee data before it can calculate a reliable team size. If your team is brand new, auto-detection will show no size yet. Setting a manual override immediately activates the correct WIP threshold.

### Your team size changed significantly

If your team was recently reorganised, expanded, or contracted, auto-detection may lag behind reality for several sprints (because it uses the median across recent history). A manual override immediately reflects your current team headcount.

### Auto-detected size is inaccurate

Sometimes the auto-detected size does not match your actual team. This can happen if:

- Contractors or external contributors are regularly assigned work but are not permanent team members
- Cross-functional team members inflate the assignee count
- You want to measure metrics against a different reference size

In these cases, override the auto-detected value with your actual team size.

## Clear a manual override

If you have set a manual override and your team has now accumulated sufficient sprint data, you can revert to auto-detection:

1. Open Settings and scroll to the **Team Size** card.
2. Click the **Clear Override** button. This button is only visible when an override is currently active.
3. OrgPulse immediately reverts to auto-detection. The source indicator updates to "Auto-detected" (or shows no size if insufficient sprint data exists yet).

After clearing an override, the team size adjusts to whatever auto-detection currently calculates. If you have fewer than two sprints of data, the team size may reset to zero until auto-detection produces a result.

## Understand the effect on WIP alarms

Your team size determines the absolute threshold for work-in-progress (WIP) alarms. The formula is:

**WIP limit = team size × 3**

For example:
- A team of 5 people has a WIP limit of 15 items
- A team of 12 people has a WIP limit of 36 items

If your team's active work exceeds this limit in any sprint, OrgPulse raises a Critical alarm regardless of your historical baseline. This catches cases of extreme overload that fragment focus and harm productivity.

An incorrect team size can cause false alarms:
- **Too small**: A team size lower than your actual headcount makes the WIP limit too strict, triggering unnecessary Critical alarms
- **Too large**: A team size higher than your actual headcount raises the WIP limit, potentially allowing genuine overload to go undetected

Set your team size accurately to ensure WIP alarms are meaningful.

## See also

- [Getting Started](/docs/getting-started) — Initial setup and onboarding
- [Configuration Reference](/docs/configuration) — All settings available in OrgPulse, including team size buckets and the WIP calculation
- [Understanding Metrics](/docs/understanding-metrics) — How team size relates to work-in-progress and flow
- [How Diagnoses Work](/docs/how-diagnoses-work) — Why WIP thresholds matter for diagnosis detection
