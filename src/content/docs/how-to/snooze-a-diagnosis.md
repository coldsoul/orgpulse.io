---
title: "Snooze a Diagnosis"
description: "Temporarily suppress a diagnosis when the underlying cause is intentional or already being addressed."
type: how-to
order: 4
category: how-to
---

# How to Snooze a Diagnosis

This guide shows you how to snooze a diagnosis temporarily, unsnooze it if needed, mark a situation as intentional, and clear an intentional marking. These actions help you manage diagnoses that don't require immediate attention or that describe deliberate team decisions.

## Prerequisites

- OrgPulse is installed in your Jira workspace
- You have completed the onboarding wizard
- At least 14 days have passed since installation (calibration is complete)
- You are a team lead or project administrator
- You have one or more active diagnoses on your dashboard to manage

---

## Snooze a diagnosis

When you see an active diagnosis card on your dashboard and you're already aware of the issue or are actively working on it, you can snooze it to remove it from your active list temporarily.

1. Look at the bottom-right corner of the active diagnosis card.
2. Hover over the **Snooze button** (clock icon). A tooltip will appear: "Hide this diagnosis for 2 sprints. It will return if the signal persists."
3. Click the Snooze button.
4. The diagnosis card immediately moves to the **"Resolved / Snoozed"** section at the bottom of the Diagnoses panel. The card now displays a blue status badge showing "snoozed · until [date]" (or "snoozed · indefinitely" if sprint dates are unavailable).

**Duration:** The diagnosis remains hidden for exactly 2 sprints. If the underlying signal is still present after those 2 sprints, a new active diagnosis card will appear on the next daily sync. The original snoozed card stays in the "Resolved / Snoozed" section.

---

## Unsnooze a diagnosis

If you change your mind and want to bring a snoozed diagnosis back to the active list before the 2-sprint period ends, you can unsnooze it.

1. Scroll down in the Diagnoses panel to the **"Resolved / Snoozed"** section.
2. Find the snoozed diagnosis card (it will show a blue badge with "snoozed · until [date]").
3. Click the expand arrow (▸) on the left side of the card row to open the full card view.
4. Click the **"Unsnooze"** button at the bottom right of the expanded card.
5. The diagnosis immediately returns to the active Diagnoses list at the top of the panel.

---

## Mark a diagnosis as Intentional

When a detected pattern describes a deliberate situation — for example, a planned crunch sprint, intentional scope expansion, or a known reorganisation — you can tell OrgPulse that the situation isn't a problem by marking it as Intentional. This suppresses the pattern from alerting you in future.

1. Look at the bottom-right corner of the active diagnosis card.
2. Hover over the **"Mark Intentional"** button (checkmark icon). A tooltip will appear: "Tell OrgPulse this situation is deliberate (e.g. planned crunch). Suppresses future alerts for this pattern."
3. Click the button.
4. The diagnosis card immediately moves to the **"Resolved / Snoozed"** section. The card now displays a green status badge saying "intentional".

**Duration:** The suppression is indefinite. The pattern will not re-fire until you explicitly clear the intentional marking. Use this action only when you are confident the situation will not change soon.

**Warning:** There is no confirmation dialog before this action executes. Once you mark a diagnosis as Intentional, it is suppressed indefinitely. Make sure this is the right choice before clicking.

---

## Clear an intentional marking

When you've finished the deliberate period or want to resume receiving alerts for a pattern, you can clear an intentional marking and return the diagnosis to active status.

1. Scroll down in the Diagnoses panel to the **"Resolved / Snoozed"** section.
2. Find the diagnosis with the green "intentional" badge.
3. Click the expand arrow (▸) on the left side of the card row to open the full card view.
4. You'll see an amber warning message inside the expanded card: "Indefinitely suppressed — This pattern is suppressed indefinitely. Future signals will not alert unless you clear this."
5. Click the **"Clear intentional"** button at the bottom right of the expanded card.
6. The diagnosis immediately returns to active status. Future detection cycles can alert you about this pattern again if the signal persists.

---

## Choose between Snooze and Mark Intentional

**Snooze** is temporary (2 sprints) and best for situations where you're unsure about long-term direction or want to check back later. The diagnosis will re-fire as a new active card if the signal persists after the snooze period expires.

**Mark Intentional** is permanent until you clear it, and is best when you know for certain the situation is deliberate and intentional (e.g. a planned crunch you've committed to). Use this when you don't expect the pattern to resolve soon and you want to stop receiving alerts entirely.

---

## See also

- [Understanding Your Dashboard](/docs/understanding-your-dashboard) — Read diagnosis cards and navigate your dashboard
- [Diagnoses Reference](/docs/diagnoses) — What each diagnosis pattern means and how to interpret it
- [How OrgPulse Diagnoses Work](/docs/how-diagnoses-work) — Why diagnoses fire and how the detection engine works
