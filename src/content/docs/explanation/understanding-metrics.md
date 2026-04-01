---
title: "Understanding Metrics"
description: "Why OrgPulse uses these five metrics, how they relate to each other, and what they reveal about team workflow health."
type: explanation
order: 2
category: explanation
---

# Understanding OrgPulse Metrics

## Why OrgPulse Measures Flow, Not Output

When teams ask "How healthy is our engineering team?", the instinct is often to look for a single score: lines of code, bugs fixed, features shipped. But those numbers hide as much as they reveal. Two teams shipping the same number of features might have completely different experiences: one pulling work steadily from a lean backlog, the other drowning in a three-sprint queue. One completing work predictably, the other oscillating wildly between fast and slow sprints.

OrgPulse does not measure individual output. It measures how work moves through your team — the flow of issues from creation through completion. This is a fundamentally different question, and it reveals something more useful: whether your team's system itself is healthy, regardless of how hard people are working.

Flow health matters because a team with healthy flow can commit to deadlines and scale without falling apart. A team with broken flow will struggle no matter how talented the engineers are.

The five metrics OrgPulse tracks all answer the same underlying question: where is time being spent, and is it changing? Together they paint a picture of whether your team is speeding up, slowing down, or stuck in a pattern that is starting to break.

## The Five Metrics — In Flow Sequence

Your work travels the same basic journey: someone requests it, someone picks it up, they work on it, it gets reviewed, and finally it ships. The five metrics each track a different leg of that journey.

### Lead Time: The Full Journey From Request to Delivery

Lead time measures the total time from when an issue is created to when it is marked done. This is the number your stakeholders care about most — it is how long they have to wait for their feature or fix.

A long lead time means work is languishing somewhere in the pipeline: either waiting in the backlog to be picked up, or sitting in active work and review stages. Lead time includes all of this — every minute from creation to ship.

When lead time is high, the natural question is "why?" Is the team slow at executing work, or is work accumulating in the queue faster than they can start it? That is where cycle time comes in. If lead time is rising but cycle time (the actual time to complete work once started) stays flat, you have a queueing problem — work is being requested faster than the team can start it. This is the pattern OrgPulse calls "Invisible Backlog Pressure": the bottleneck is not the team's speed, it is the intake rate.

One important detail: lead time includes time when nobody is working. Work sitting in a code review for three days contributes three days to lead time, even though the team was not actively working on it. That is the point — lead time is the customer's experience, not the team's effort.

### Cycle Time: How Fast Work Gets Done Once Started

Cycle time measures how long issues spend actively being worked on. It starts when work first moves to "In Progress" and ends when the issue is marked "Done". This excludes all queue time — time sitting in the backlog waiting to be picked up.

A short cycle time means your team is executing efficiently once they start something. A long cycle time suggests work is getting stuck in the execution phase: tasks might be too large, dependencies might be blocking people, or interruptions might be fragmenting focus.

Cycle time is measured in days and becomes unreliable for outliers: issues that stall for more than 30 days are filtered out of the calculation (those pathological cases are caught through other signals). The metric requires at least five completed issues to calculate — teams with very low volume will see low confidence scores instead.

The relationship between lead time and cycle time is instructive. If both are rising together, execution is slowing. If lead time is rising but cycle time is stable, queueing is the problem. A team with a 14-day lead time and a 5-day cycle time has a 9-day backlog queue. A team with the same 14-day lead time but a 1-day cycle time has a 13-day queue — their team is very fast but work waits a long time before anyone picks it up.

### Work in Progress: How Much Is Being Done at Once

Work in progress, or WIP, counts how many issues are actively being worked on at a single moment in time. OrgPulse measures WIP at the midpoint of each sprint (halfway through the sprint cycle) to avoid the distortions of sprint-end scrambles. An issue counts as WIP if it is in "In Progress" or "In Review" state — "Blocked" items are excluded, because blocking is not the same as actively working.

There is a well-established relationship in flow systems: higher WIP correlates with longer cycle time. This is Little's Law, and it is one of the most reliable patterns in queuing theory. If your team has work in progress equal to twenty items but can only complete five items per sprint, cycle time will balloon as each item waits its turn. Conversely, a team that keeps WIP low — perhaps five or six items per sprint — will have faster turnaround and less context-switching.

High WIP is a leading indicator. A team might not notice a throughput decline for a sprint or two, but rising WIP shows up immediately. This is why OrgPulse flags sustained WIP increases: they predict future problems before throughput collapses.

There is an absolute floor: if WIP exceeds three times your team size, OrgPulse raises an alarm regardless of your team's historical baseline. A team of five should not have more than fifteen things in progress. At that load level, context-switching and coordination overhead become the limiting factor, and performance almost universally declines.

### Throughput: How Much Gets Finished

Throughput counts the number of issues your team completes per sprint. It is a pure count — story points are not used, complexity estimates are ignored. Two teams with identical velocity in story points might have very different throughput: one team might estimate conservatively (large points, few issues) while the other estimates aggressively (small points, many issues). OrgPulse avoids this subjectivity by counting issues.

High throughput combined with healthy WIP and short cycle time indicates a team in good flow. Declining throughput is a red flag, especially if WIP is not declining proportionally. If WIP stays constant but throughput falls, it means the team is starting work at the same rate but finishing slower — a classic sign of increasing cycle time and bottlenecks.

For teams using Kanban instead of fixed sprints, OrgPulse calculates throughput over rolling two-week windows instead of sprint boundaries.

Throughput alone is not sufficient to understand team health. A team might complete many items per sprint but all of them might be tiny fixes and none of them customer-visible improvements. That is where the other metrics add context. But as a proxy for "how much is actually getting done", throughput is direct and unambiguous.

### Cycle Time Variance: How Predictable Is Completion?

Cycle time variance measures how spread out cycle times are. Imagine two teams, both with an average cycle time of five days. Team A completes most issues in three to seven days — the team is predictable. Team B completes some issues in one day and others in two weeks — the team is chaotic. Both have the same average, but they feel very different to work with.

Variance is measured as standard deviation, but you do not need to understand the maths. The question is simple: "If I tell a stakeholder something will take about five days, how confident am I?" Low variance means "quite confident". High variance means "it could be done tomorrow or in three weeks".

High variance often signals hidden bottlenecks: some work flows through smoothly while other work gets stuck. The pattern might be obvious — bugs might take much longer than features — or subtle, hidden in a subset of dependencies or a specialist who is a bottleneck. OrgPulse breaks down variance by issue type to help you see if one category of work is dragging the whole metric down.

Rising variance is especially telling. A team with stable variance is predictable. A team where variance is climbing is losing consistency — something in the system is getting noisier or more chaotic. This is what OrgPulse looks for in the "Stalled Flow" pattern: if variance is rising over consecutive sprints, something is increasingly blocking or interrupting work.

## Your Team's Own Baseline: Why Comparison to Yourself Matters

OrgPulse does not compare your team to industry benchmarks or to other teams. It compares your team to itself. This is a deliberate design choice, and it is crucial to understanding how the system works.

A fourteen-day lead time could be excellent for a large enterprise platform team and alarming for a startup shipping weekly releases. The same fourteen days could mean "perfectly normal" for a team maintaining a legacy monolith, or "we are drowning" for a team that used to ship in three days. Industry numbers do not know your context.

Instead, OrgPulse learns your team's normal operating level. Over the first few weeks of use (the calibration period), the system accumulates data and establishes a baseline: "This team typically completes issues in eight days" or "This team usually has three items in progress". Once the baseline is set, OrgPulse only alerts when something changes relative to that normal. If your cycle time rises from eight days to twelve days, that is a signal. If it stays at eight days, you are in normal territory.

The baseline is not static — it evolves continuously. Every new sprint, the system updates the baseline using exponentially weighted moving average (EWMA). This is a mathematical way of saying "recent data matters more than old data, but history still has weight". The math gives recent sprints thirty percent weight and the existing average seventy percent weight. This balance allows the system to respond to genuine change — if your team speeds up, the baseline will gradually shift upward — without over-reacting to a single fast sprint.

After a real change in team behaviour (say, a process improvement or a reorganisation), the baseline typically reflects the new level after two or three sprints. This is why OrgPulse requires patterns to persist across multiple consecutive sprints before raising a diagnosis. A single anomalous sprint (a key person away, a major release) will not trigger an alarm. The system is built for signal, not noise.

If your team undergoes a major structural change — reorganisation, methodology shift, new tooling — the baseline can be manually reset. The old baseline is archived for reference, and the system starts learning afresh. This ensures that genuine improvements are not penalised against historical norms from before the change.

## The Calibration Period: Learning Without Alerting

For the first two weeks after OrgPulse is installed (or until three sprints of data have accumulated), no diagnoses will fire. This is the calibration period — the system is learning what normal looks like for your team.

Why wait? With no baseline, every value looks like an anomaly. If you have completed five issues in a sprint, is that good, bad, or normal? OrgPulse cannot know until it sees data. Firing diagnoses against an empty or minimal baseline would produce meaningless results and erode trust in the system. So the system stays silent during calibration, showing you metrics but no alerts.

During calibration, your metrics are visible in the dashboard — you can see what OrgPulse is measuring — but they carry a "learning" label rather than a confidence score. This is intentional: you can observe the data without being alarmed or reassured by readings that the system is not yet confident about.

After calibration, your metrics will show confidence levels: High (three green bars), Medium (two amber bars), or Low (one grey bar). These mean what they look like — reliable, directional, or "wait for better data".

## Confidence: How to Read the Signal Strength

Each metric shows a confidence level: High (green), Medium (amber), or Low (grey). Think of these like mobile phone signal bars. High confidence means "the system has enough good quality data to make a reliable reading". Low confidence means "we are seeing some data but do not yet trust it fully". Medium confidence means "take this as directional information, not definitive".

Confidence is not a measure of team performance. A Low confidence metric does not mean your team is doing badly. It means the system cannot yet say with confidence what the metric actually is. Low confidence is often temporary — it usually resolves on its own as more data accumulates.

What causes low confidence? Several things:

**Not enough data yet.** A new team or a team that completes very few items per sprint will have few data points. This is normal and resolves over time.

**Issues with Jira workflow consistency.** If many issues in your team's backlog have no status transition history — they were dragged from backlog to done without moving through intermediate states — then OrgPulse cannot accurately measure cycle time or lead time for those issues. The fix: encourage your team to transition issues through workflow states as they work, rather than bulk-moving them at the end.

**Bulk-completing at sprint end.** If your team tends to mark issues done all on the last day of the sprint rather than throughout the sprint, OrgPulse will struggle to get accurate cycle time readings. The metric sees a 1-day cycle time (because the status changed on the last day) when the reality might be a 10-day cycle time. The fix: update issue status as work progresses, not just at sprint review.

**High rework rate.** If many issues are being reopened after being marked done, cycle time measurements become unreliable — the system only counts the first completion, and high rework suggests the team's definition of "done" may not be stable. This is worth investigating independently.

**Confidence is not binary.** Diagnoses that depend on a metric will only fire if confidence is High enough (usually 0.85 on the 0–1 scale). But the metric itself is still shown in the dashboard even at Medium or Low confidence, labelled appropriately so you know how much to trust it. You can still learn from a Low confidence metric — just treat it as directional rather than definitive.

The confidence system is designed to be self-healing. As workflow habits improve, confidence naturally rises. You do not need to do anything special — just use Jira more consistently, and the metrics will become more reliable.

## How Metrics Connect to Diagnoses

OrgPulse detects five diagnostic patterns, each triggered by a distinct combination of metrics:

**Chronic WIP Inflation** signals that work in progress has been climbing for four consecutive sprints while throughput stays flat. The team is starting more work without finishing proportionally more — the classic path to overload.

**Stalled Flow** signals that cycle time variance (consistency of completion times) has risen more than fifty percent above the team's baseline for two consecutive sprints. Some work is flowing smoothly, other work is getting stuck, and the unevenness is accelerating.

**Overloaded Team** signals that WIP is elevated and throughput is falling simultaneously, sustained over two sprints. The team is drowning: they are taking on work but cannot finish it fast enough.

**Quality Crisis Signal** signals that your team's bug creation rate has spiked more than thirty percent above baseline at the same time throughput is falling. Defects are consuming capacity that would otherwise produce features.

**Invisible Backlog Pressure** signals that lead time has risen more than twenty-five percent above baseline for three consecutive sprints while cycle time remains stable. The team is executing efficiently but work is queuing up faster than they can start it.

No single metric fires a diagnosis. Every pattern requires at least two signals correlated over multiple sprints. This is the primary safeguard against false alarms. A team might have an anomalously high WIP in one sprint due to a release cycle or a key person returning from leave. But if WIP is elevated for four consecutive sprints and throughput is flat, something structural has changed and warrants attention.

For specific thresholds and technical details of how each metric is calculated, see the [Metrics reference](/docs/metrics). For deeper understanding of how each diagnosis works, see [How OrgPulse diagnoses work](/docs/how-diagnoses-work).

## What OrgPulse Does Not Measure

It is worth being explicit about what OrgPulse does not track, to avoid misunderstandings:

**Individual output.** OrgPulse does not measure individual engineers or track who completed what. All metrics are aggregated to the team level. This is a design choice based on two principles: team health is a system property (the team's structure and processes matter more than individual effort), and privacy (Forge does not store individual user data for analytics).

**Effort or estimation.** Story points, T-shirt sizes, planning poker estimates — OrgPulse ignores all of them. Estimation is inconsistent and often reflects optimism bias. OrgPulse measures what actually happened (Jira state transitions), not what was predicted.

**Code quality or architecture.** OrgPulse has no insight into code reviews, pull request quality, test coverage, or technical debt. It sees that an issue moved to "In Review" and later to "Done", but not what happened in code review or how many rework cycles occurred before merge.

**Blocked time or root causes.** If work is blocked, OrgPulse sees that an issue is in "Blocked" state and excludes it from WIP (correctly — blocking is not the same as active work). But the system does not know why it is blocked, how long it has been blocked, or whether the blocker is external or internal.

**Individual work habits, meeting time, or interruptions.** OrgPulse sees the outcome (issue states) but not the process (how much time was spent in meetings, how often plans changed, how much context-switching occurred). These things affect metrics indirectly through the numbers that emerge.

This is intentional. OrgPulse is designed to be privacy-respecting and to focus on system health rather than individual performance. If you want to understand why a metric is high, you will usually need to have a conversation with your team — the metrics are a starting point for the investigation, not the investigation itself.

## Getting Started With Your Metrics

When you first log into OrgPulse, you will see all five metrics on your team dashboard. They will likely show Low or Medium confidence during the calibration period — this is normal. Watch how they evolve over the first few weeks. You are not looking for a "good" or "bad" score; you are getting a baseline snapshot of how your team operates.

After calibration, the confidence levels will stabilise and diagnoses will begin to fire if patterns emerge. You may see High confidence on some metrics and Medium on others — this is fine. Each metric's confidence reflects the quality of the underlying data independently.

If you see a diagnosis appear, do not panic. The system is designed to be conservative — it only raises alarms when a pattern has persisted across multiple sprints. The diagnosis is not a verdict; it is a starting point for conversation. Read the diagnosis description to understand what signal triggered it, then talk to your team about what might be causing the underlying metric changes.

For hands-on guidance on using OrgPulse and interpreting your dashboard, see [Getting Started](/docs/getting-started).
