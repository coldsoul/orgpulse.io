---
title: "How Diagnoses Work"
description: "The pipeline behind every diagnosis — from data ingestion through baseline comparison, confidence gating, and false positive defence."
type: explanation
order: 1
category: explanation
---

# Understanding OrgPulse Diagnoses

This document explains how OrgPulse detects workflow problems, why it compares your team against itself rather than industry benchmarks, and what each diagnosis actually tells you about your team's operating patterns. It is written for engineering team leads and managers who use OrgPulse to understand their team's health.

For specific trigger conditions, thresholds, and detailed recommended actions, refer to the [Diagnoses Reference](/docs/diagnoses).

---

## How a Diagnosis is Made

When a diagnosis appears in your OrgPulse dashboard, your team's workflow data has passed through a deliberate sequence of gates. Understanding this pipeline helps explain why diagnoses take time to appear and why the system sometimes remains silent even when a metric looks concerning.

### The Pipeline in Plain English

Every six hours, OrgPulse silently ingests your team's Jira data: which issues moved to which workflow states, when they were created, and when they were completed. This raw changelog is then transformed through several stages before any diagnosis is raised.

First, the system normalises your workflow. Jira statuses vary widely across teams — some use "In Dev," others "In Progress," others "Development." OrgPulse translates these into five universal states (not started, actively being worked on, blocked, in review, done) so that metrics mean the same thing regardless of your team's specific terminology.

Next, the system computes five key metrics from this normalised data: how long items typically take to complete (cycle time), how long they wait from creation until work starts (lead time), how many items finish each sprint (throughput), how many are in active work right now (work in progress), and how variable completion times are (cycle time variance). These five numbers describe different dimensions of your team's workflow efficiency.

The system does not immediately report these metrics as-is. Instead, it scores how reliable they are. Are there enough items to create statistically meaningful numbers? Do most items have complete status history, or are there gaps? Did items cluster suspiciously at sprint end? The confidence score captures this assessment. Metrics that fail this quality check cannot trigger diagnoses.

Only then does OrgPulse compare your current metrics against your team's own baseline — what is normal for you. This baseline is not static. It learns from your team's recent history, with recent sprints influencing it more than older ones. The comparison asks a single question: "Has this metric changed significantly from what is normal for this team?"

If a metric has changed, that alone is not enough. The system checks whether this change persists. Most patterns require evidence from at least two consecutive sprints before a diagnosis is considered. Volatile metrics and one-off sprints do not trigger diagnoses.

Once the system identifies that a pattern is genuinely present, it applies additional checks. Has your team already marked this diagnosis as intentional — something you know about and have chosen? Has the team reported this pattern as inaccurate before? Are there other contextual reasons the diagnosis might be a false alarm? These checks, collectively, filter out noise.

Only after passing all these gates does a diagnosis appear on your dashboard. By that point, the system has confirmed that a meaningful, sustained change in your workflow has occurred.

---

## Personal Baselines: Why Your Team is Compared to Itself

The most important principle in OrgPulse is this: diagnoses are always relative to your team's own history, never to industry averages or other teams.

This matters because what constitutes "healthy" varies enormously across teams. A 10-person team working on a complex enterprise product might routinely have 20 items in active progress simultaneously. That same number for a 4-person mobile team would be chaos. Both teams could be working at their optimal efficiency.

A fixed threshold — say, "more than 15 items in progress is a problem" — would either miss problems on large teams or create constant false alarms on small teams. OrgPulse avoids this trap by asking: "Is this team's current WIP higher than *this* team's normal WIP?" The answer depends on each team's operating context, not on a universal standard.

### How the Baseline Learns

Your baseline is not set once and frozen. It evolves as your team's performance evolves. When you first install OrgPulse, the system begins collecting data. Recent sprints have more influence on the baseline than older ones, so if your team genuinely improves over time, the baseline shifts with you. This prevents a frustrating paradox: a team that improves would otherwise start getting false-positive diagnoses because their old (higher) baseline now looks abnormally high.

The baseline is also not a simple average. It stores not just the typical value but the spread: the 50th, 75th, and 90th percentile values for each metric. This matters because a team might have normal cycle times of 3–5 days most of the time, with occasional outliers at 20 days. The percentiles capture this spread. When OrgPulse detects that cycle time variance has increased, it is comparing the observed spread against this historical spread.

### What This Means When Your Team Changes

If your team undergoes a genuine change — a major reorganisation, a shift in project mix, new tools — your baseline can be reset. The system archives the old baseline and starts fresh. This prevents the old history from creating false positives during a transition period. However, baseline resets are intentional and deliberate; the system is designed to learn gradually, not to be reset after every difficult sprint.

---

## The Calibration Period

When OrgPulse is first installed on your team, diagnoses do not appear immediately. For the first 14 calendar days (or three complete sprints, whichever comes first), the system operates in calibration mode. During this period, it is learning: collecting data about how many items you typically complete, how long they usually take, how much variation is normal.

This is not a delay imposed to be annoying. It is a prerequisite. Diagnoses work by comparing current metrics against your team's baseline. Without baseline data, there is nothing to compare against. Imagine a doctor trying to assess whether your blood pressure is abnormally high without ever knowing what your normal blood pressure is — the diagnosis would be meaningless. The calibration period is OrgPulse learning your "normal."

Once calibration completes, the system cannot be re-calibrated. This one-way gate prevents the risk of teams resetting calibration repeatedly to suppress diagnoses. Your baseline is built once and then evolves naturally.

### What You Should Do During Calibration

Continue using OrgPulse as normal. Use the metrics view to familiarise yourself with the system. After 14 days (or your third complete sprint), diagnoses will begin to appear automatically. The system will not alert you when calibration completes — diagnoses will simply start appearing.

---

## What Each Diagnosis is Actually Detecting

OrgPulse monitors five distinct workflow patterns. Each one tells a specific story about what is happening in your team's process.

### Chronic WIP Inflation

This pattern detects a team that is starting more work than it can finish. Over multiple sprints, items continuously enter active work, but the number leaving (completed items) remains flat. The queue of in-progress work grows. Conceptually, the team has lost the discipline of finishing work before starting more.

Why does this matter? A common instinct in management is "if progress is slow, start more work to increase output." The reverse is true. When WIP grows without a corresponding increase in completions, every individual item experiences more delay. Context switching increases. The cost to switch between one item and another — retrieving context, reorienting — multiplies. The team feels busier but actually finishes less.

The recommended actions address the structural cause: introduce explicit WIP limits, audit whether in-progress items are actually being worked on (some may be blocked or forgotten), and discuss with stakeholders which items can be paused. These are workflow interventions, not finger-pointing at the team.

### Stalled Flow

This pattern detects unpredictability in cycle time. On the surface, average cycle time might look normal. But some items move through the sprint quickly while others get stuck for disproportionately long periods. The variability — the spread between fastest and slowest items — has widened.

This pattern is often invisible because teams track averages. A team might complete 12 items in a sprint with an average cycle time of 4 days. But if 10 items took 2–3 days and 2 items took 18 days, the spread has widened without the average moving much. Those two slow items are signals of a hidden bottleneck.

The bottleneck is often a blocker that was not raised, a dependency on another team that created a waiting period, or unclear requirements that forced rework. The recommended actions are targeted: find items taking longer than one sprint, escalate blockers, and examine whether your "ready" criteria are preventing incomplete work from entering the sprint.

### Overloaded Team

This is the downstream consequence of unchecked WIP inflation. Two things are true simultaneously: the team has more items in progress than they normally do, and they are completing fewer items than normal. More work has not increased output — it has decreased it.

The insight is straightforward: the team has taken on more simultaneous work than their working memory and task-switching capacity can handle. Each person is juggling too many contexts. The system has detected this by observing that WIP is elevated while throughput is falling — the signature of multi-tasking overload.

Conceptually, this is where WIP Inflation becomes critical. If WIP Inflation goes unaddressed, Overloaded Team usually follows. The team lead's response is structural: reduce the number of active items to align with what the team actually completes per sprint, protect the team from mid-sprint additions, and explicitly sequence competing work streams rather than running them in parallel.

### Quality Crisis Signal

This pattern detects a rise in bugs coinciding with a decline in completed work. The interpretation is that the team is spending more time on rework and quality problems than on new delivery. Quality controls may have been loosened under deadline pressure. Testing or review time may have been compressed.

Importantly, this pattern requires a rise in bugs *combined with* falling throughput. A rise in bugs alone might reflect improved bug reporting or a more thorough testing process — actually a healthy sign. A fall in throughput alone might reflect a strategic shift to focus on quality. But the combination — more bugs and fewer completions — signals stress in the development process.

The recommended actions are process-oriented: review whether release or review processes have changed recently, examine whether WIP limits are being respected (rushed work produces more bugs), and discuss with the team whether quality trade-offs were made consciously as a deliberate decision rather than as an accident of being overwhelmed.

### Invisible Backlog Pressure

This pattern is unique because it points to a bottleneck upstream of the team's active work. Lead time (the total time from when an item is created to when it is completed) is rising. But cycle time (the time from when work actively starts to when it finishes) is stable. The delay is not inside active work — it is in the queue of items waiting to be started.

The insight is called "invisible" because the team's internal metrics might look healthy. WIP might be normal. Throughput might be normal. Cycle time might be normal. But something outside the team's direct control — backlog intake, prioritisation, approval processes — is causing items to wait longer before being picked up.

The recommended actions address backlog management: review whether the backlog contains items that should be closed or deprioritised (a growing backlog with no outflow means average wait times rise even with stable team throughput), check whether new work is being added faster than the team can complete work, and examine whether the prioritisation process is genuinely prioritising or just accumulating approvals.

---

## Confidence: Data Quality, Not Severity

Every diagnosis carries a confidence indicator: high, medium, or low. It is crucial to understand that confidence measures data quality and statistical reliability, not the severity of the problem.

A diagnosis with high confidence means OrgPulse has sufficient data, complete status histories, and stable metrics to be certain in the diagnosis. A diagnosis with medium confidence means the pattern is real but the supporting data is adequate rather than excellent — perhaps the team has few issues in a sprint, or most issues have incomplete histories. A diagnosis with low confidence means data quality is limited and the signal might be statistical noise.

Low confidence does not mean "ignore this diagnosis." It means "use your judgment in combination with the data." If a diagnosis fires at low confidence and your team independently recognises the problem from their own experience, the diagnosis is consistent with ground truth and worth acting on. If you do not recognise the problem, the recommendation is to wait for more data.

The reason OrgPulse has confidence gates is to prevent false positives. The system would rather remain silent when data is poor than mislead you with a diagnosis built on unreliable numbers. This is a conservative design choice: it prefers missed signals to false alarms.

Some patterns use lower confidence thresholds than others. Quality-related patterns, for example, are inherently noisier than flow metrics because bug creation is influenced by testing intensity, not just team capacity. The system accounts for this by allowing these patterns to fire at slightly lower confidence. This does not make them less reliable overall — it acknowledges that quality signals are inherently more variable.

---

## How OrgPulse Avoids False Alarms

OrgPulse goes to extraordinary lengths to prevent incorrect diagnoses. This is intentional design: false alarms erode trust more than missed signals.

### Persistence Gates

A single bad sprint does not trigger a diagnosis. Most patterns require the signal to persist across 2+ consecutive sprints. Invisible Backlog Pressure requires 3 sprints. This filters out one-off events: a major release, a team offsite, a company holiday week, an unexpected urgent incident. These are real events that affect metrics, but they do not signal a change in team process.

### Personal Baselines

As described earlier, all comparison is against your team's own baseline, not universal thresholds. This prevents the most common source of false positives: applying standards from one context to another.

### Confidence Gating

Patterns do not fire unless the underlying metrics have sufficient data quality. Sparse data, incomplete status histories, and early-stage tracking cannot trigger diagnoses. This prevents statistical noise from creating false alarms.

### Contextual Suppression

Even when the system detects a genuine signal, it checks whether you have contextually overridden it. If your team marks a diagnosis as "intentional" (we know WIP is high this sprint because of a critical release) or snoozes it, OrgPulse does not re-raise it. This respects your team's agency and prevents the system from crying wolf about decisions you have made consciously.

### Feedback Loop

If your team reports a diagnosis as "Not Accurate," OrgPulse learns from that feedback. After accumulating feedback on a pattern, the system adjusts automatically to reduce false positives for your team. This is not a configuration you have to manage manually — the system observes your feedback and self-corrects.

Together, these five layers create a system that is conservative: it errs toward silence when uncertain, requires signal confirmation before acting, and respects your team's knowledge about their own context. The result is that when a diagnosis does appear, it has earned credibility.

---

## Summary

OrgPulse diagnoses are the product of a deliberate, multi-stage pipeline that compares your team's current metrics against your team's own history. Diagnoses take time to appear not because the system is slow, but because they are built on a foundation: a baseline that captures what "normal" means for your team. Confidence measures data quality, not severity. False positive safeguards work together to keep signals actionable and meaningful.

For specific trigger conditions, thresholds, and recommended actions for each diagnosis, see the [Diagnoses Reference](/docs/diagnoses).

---

## Related

- [OrgPulse Diagnoses Reference](/docs/diagnoses) — exact triggers, thresholds, severity levels, and recommended actions
- [OrgPulse Metrics Reference](/docs/metrics) — detailed information about the five core metrics
