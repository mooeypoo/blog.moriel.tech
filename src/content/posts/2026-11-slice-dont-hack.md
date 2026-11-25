---
title: "Slice, Don't Hack: Breaking Down Big Problems in the AI Age"
date: 2026-11-25
tags:
  - Architecture
  - Tech Industry
  - Gen AI
section: engineering-at-speed
order: 2
description: You need to ship something big, and fast, whether you write the code yourself or direct an AI to write it. The real choice isn't between doing it right and doing it fast. It's between finding the real pieces inside the problem and hacking through it.
image: ../../assets/images/posts/slice-dont-hack.jpg
---

You need to ship a feature fast. It's a complicated one, too big to solve in one go. There's a sense of urgency around you. Ship it. Ship something. There are real goals behind this, and everyone wants to see it working.

Under that pressure, you have three real options. Solve it whole, and risk taking so long that priorities shift before you're done. Hack through it, cut corners, and hope you find time to fix it later. Or find the real pieces inside it, and ship those one at a time, fast and honest.

These three options exist whether you're typing the code yourself or directing an AI to write it.

That third option is the hard one. And it's the one this post is about.

## AI changes the speed, not the problem

These days, someone in the room is likely to ask: _couldn't an agent just build the whole thing by Friday?_ And honestly, it might be able to produce something by Friday. Whether that something is still a good, solid product three months from now is a different question.

Big problems still need to be broken down, even when AI is doing the building. That's not a skeptic's worry; it's standard practice, and the advice around this topic agrees.

The guides for [Copilot](https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-engineering), [Claude](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-prompts), [Gemini](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/break-down-prompts) and [Codex](https://developers.openai.com/codex/prompting) all tell you to break complex tasks into smaller ones. OpenAI's even gives the same reason this post will: smaller tasks are easier for the agent to test and for you to review. And it's not only about better output: "the whole thing at once" gives you a waterfall product, built to a picture you drew before you knew much, that turns out not to be what you actually wanted.

The only reliable way to get the product you're aiming for, especially when the ground keeps moving, is to build it in pieces. Each piece lets you check the behavior, the code, and the assumptions underneath, without waiting on a finished feature while requirements, users, or the market shift around you.

Breaking a problem down well is hard. Finding where a big problem actually comes apart takes skill, and it's not a part AI can take off your hands.

## This isn't a new problem

Engineers have always had to work out how to break big problems apart, long before AI: how do you balance speed, guardrails, and the things you don't know yet? AI makes it more urgent, and a bit more complicated, but it doesn't change the question. The habits that answered it well before still answer it well now.

If you've been an engineer for a while, you already have feelings about "just ship it iteratively." Maybe not good ones. You've seen the fast version go out, told yourself you'd clean it up later, and later never came. If you read [Think in Delivery](https://blog.moriel.tech/posts/think-in-delivery/), this will sound familiar: "ship iteratively" carries a lot of the same baggage as "ship fast." That reaction is fair, and we'll come back to it. It's not a reason to give up on shipping in real pieces. It's a reason to do it properly.

## Finding the seam

Anyone who has ever cut wood, or fabric, or a sheet of dough, knows there's a difference between cutting along a seam and cutting against one. A seam is a place where the material is already willing to come apart; a little pressure there and it separates cleanly. Cut across it instead, and you're fighting the material the whole way, and both sides end up a little damaged from the fight.

Big problems have seams too: places where a smaller, whole, working piece can come away from the rest without tearing anything. Breaking down a big problem well is mostly the work of finding that seam instead of picking a spot and forcing a cut. That work happens before anyone writes code, human or otherwise. An agent can implement a slice beautifully. Deciding where the slice *is* remains your call.

Finding a real seam takes two things. An attitude: wanting to ship something soon, rather than wanting to solve the whole problem properly. And a skill: understanding the shape of what's in front of you well enough to see where it comes apart. Have the attitude without the skill and you'll cut somewhere that looked fine but wasn't. Have the skill without the attitude and you'll see the seam and never cut, because you're still trying to solve everything at once.

## The attitude: wanting to ship soon

The attitude half is what [Think in Delivery](https://blog.moriel.tech/posts/think-in-delivery/) was about: looking at a big problem and asking what the smallest real, honest, useful version of it is. If you're not looking for a seam, you won't see it, even when it's right there.

That instinct has more to push against now. When code was expensive to write, "solve it whole" was slow, and the slowness itself pushed people toward smaller pieces. Now you can describe the full feature, let the agent run, and get a giant diff back in an afternoon.

### Cheaper to write, not cheaper to own

Writing the code was never the only cost, and it's becoming the smallest one. Someone still has to review that diff, understand it, and live with it. The classic [SmartBear and Cisco code review study](https://www.atlassian.com/blog/add-ons/code-review-best-practices) found that reviewers' ability to catch defects drops off sharply past 200 to 400 lines at a time, and a model writing those lines doesn't make a human reader's attention span any longer.

This isn't hypothetical. Google's [2024 DORA report](https://dora.dev/report/2024) found that as AI adoption went up, delivery stability went down, by an estimated 7.2%. The researchers' leading explanation wasn't bad generated code; it was that AI makes it easy to produce much more code at once, and larger changes have long been tied to riskier deployments. Their recommendation was to hold on to fundamentals like small batch sizes.

So the instinct to slice doesn't become obsolete when generation gets fast. It's what keeps fast generation from turning into fast regret.

### Fast isn't the same as loose

Moving fast and loose optimizes for _something visible, now_. Wanting to ship soon optimizes for _something real, soon_: it works on its own, it's honest about what it isn't yet, and it doesn't make the next step harder.

Being fast and sloppy is easy. Being slow and careful is also easy, in its own way. The hard version, the one that takes real skill, is being **fast and safe at once**. That's not a lesser path than doing things "properly." It's the more interesting one.

## The skill: understanding the shape of the problem

Big problems aren't all the same shape, even when they feel equally big. None of what follows is a formula, just things worth knowing about a problem before you go looking for where it comes apart.

### Wide or vertical

A wide problem spans multiple domains: multiple teams, multiple systems, or both. A vertical problem can be very complex, but one team can see the whole thing without anyone else's system needing to change.

A wide problem often has a seam along its width, letting you ship one part of that width at a time. A vertical problem often has a seam through its depth, letting you ship a thinner version of the whole thing first, then add depth. Neither is a rule. Sometimes a single thin slice through several domains teaches you more. Knowing the shape doesn't hand you the cut; it tells you what to look for.

### Real coupling or chosen coupling

Sometimes two parts of a system are tightly bound because that's how the problem works. But often, what looks like tight coupling is a decision someone made a while ago: a shared table, a shared code path, a shortcut that made sense at the time. That's not a fact about the problem, it's a fact about a choice, and choices can be revisited. A problem that seems to have no seams sometimes comes apart entirely once you draw a boundary nobody had drawn before.

#### AI is optimized for the code that's already there

This is one of the places where working with AI calls for the most attention. Coding agents are very good at following the patterns already in a codebase, including the accidental ones. Ask for a feature, and the agent will usually add it right where the existing code invites it, inheriting whatever coupling is already there. Unless you tell it where the seam is, it won't go looking for one.

GitClear's [2025 code quality research](https://www.gitclear.com/ai_assistant_code_quality_2025_research) points the same way: across 211 million changed lines, duplicated code rose sharply during 2024 while restructured code declined.

Following existing patterns is often exactly what you want. But "where the code expects it" and "where the problem's seam is" aren't always the same place, and telling them apart is a judgment call about the system, not the syntax.

### What a slice would teach you

Sometimes the most valuable first slice isn't the smallest one, it's the one that tests the assumption you're least sure about. Does this approach hold up once real users touch it? Does the architecture survive real traffic? A slice picked this way is valuable even if you never build the rest, because it gives you a real answer instead of a smaller version of a guess.

## When wanting to ship isn't enough

If you have the instinct to ship soon but skip the work of understanding shape, you don't find a seam. You force a cut somewhere else, and what you get is a hack.

### What a hack actually is

A hack is a shortcut that makes the software worse and harder to build on. You add a special case directly into code that wasn't built to hold it, because that's the quickest way to unblock what's in front of you. It ships. It works, today. But there's an assumption buried in that code now that nobody else can see, and the next person who touches that path has to work around it, or break it without knowing why. The next "person" might be an agent, too, and it won't know about the buried assumption any more than a new teammate would. It'll just build on top of it.

It's tempting to call this technical debt, but I'm not sure the person who coined that metaphor would agree. Ward Cunningham introduced the debt idea in his [1992 OOPSLA experience report](https://c2.com/doc/oopsla92.html), and later [clarified in a short video](https://www.youtube.com/watch?v=pqeJFYwnkjE) that he never meant it as permission to write code poorly and clean it up later. The debt he described was code that reflects your current understanding, written cleanly enough to refactor as that understanding improves. That's a slice. A hack is debt you can't pay back, because nothing about it was built to be revisited.

### Why they're easy to mistake

A hack and a real slice can look identical from a distance. Both ship fast. Both pass the demo, and with generated code, both can come with a tidy set of passing tests. The difference is underneath. A real slice is a whole, working piece of the actual problem, small but complete. A hack only works because it's quietly leaning on something it shouldn't, and the bill tends to come due on a day you didn't plan for.

One more tell: a good slice usually teaches you something on the way out. A hack almost never does. If you can't say what you learned from shipping a piece, that's worth a second look.

![Two identical-looking blocks sit side by side on a small stage under the same spotlight, with confetti falling on both. A cutaway view shows what's underneath: the block on the left is solid all the way through and rests on firm ground, while the block on the right is hollow, patched together from scraps, and propped up by a wobbly stick, tape, a bent nail and a wedge that is cracking the support beside it.](../../assets/images/posts/slice-dont-hack-boxes.jpg)
*From the top, you can't tell them apart. The difference is what they're standing on.*

## AI changes the typing, not the judgment

It's easy to read a post like this as "AI makes hacks, so be careful with AI." That's not the point.

AI makes _everything_ faster to produce: hacks, slices, whole features, prototypes. That's great; trying a cut has never been cheaper. What hasn't changed is the cost of choosing the wrong one. The [2025 DORA report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) found AI adoption now linked to teams shipping _more_, a reversal from the year before, but still linked to more instability. Its framing is that AI is an amplifier: it makes good delivery habits more powerful and bad ones more expensive. Working in small batches was one of the habits that made the biggest difference.

In practice, slicing with AI looks a lot like slicing without it:

- **Hand it the slice, not the whole.** An agent given one well-defined piece will usually do a far better job than one asked for the entire feature, for the same reasons a person would. It's also far easier for you to review.
- **Use it to scout.** A throwaway prototype that tests your riskiest assumption used to cost days; now it can cost an hour. Build two candidate cuts and see which one comes apart cleanly.
- **Ask it where the seams are, then decide.** An agent can be a useful second pair of eyes on a problem's shape. Treat that as input to your judgment, the way you'd treat a colleague's suggestion.
- **Review for wholeness, not just correctness.** Not only "does this work?" but "is this piece complete on its own, and what is it leaning on?" That's the question that separates a slice from a hack, and it's yours to ask.

Whether you're writing every line or directing an agent that writes most of them, you're the one deciding where the cut goes, and you're the one who owns what ships.

## The fear, and what's in your control

Back to that fear. You ship the fast version, telling yourself (and your stakeholders) that you'll come back and do it properly. Then the next feature is due. And the one after that. A year later, the codebase is a pile of decisions that were supposed to be temporary. Faster tools don't fix this; they can speed it up.

That fear is earned. Getting an organization to protect time for cleanup is a real problem, big enough to deserve its own post. What belongs here is narrower: do the things under your control to derisk the things that aren't.

### Say what it costs

When you make a real compromise to hit a fast slice, say what it costs, plainly, to whoever needs to know. If nobody was told what corner got cut, nobody agreed to accept that cost; it just happened to them. That includes the corners you let an agent cut. "The generated code handles the main path; edge-case error handling is thin and I've opened a follow-up ticket for it" is a shared, informed decision. Discovering it three months later is not.

It's also a useful test for yourself. If you can explain clearly what you cut and why it was worth it, you're probably looking at a real slice. If you can't explain it without it sounding bad, you're probably looking at a hack.

### Build it so walking away doesn't hurt

Build each slice so that if nobody ever comes back to finish it, things still aren't worse off than before. If you found a real seam, the slice is whole on its own, and walking away from it forever still leaves the software better off. A hack that never gets revisited doesn't just stay incomplete; it keeps costing you, quietly, on every feature that touches it afterward.

Neither of these needs the organization to behave a certain way. Both are things you can do yourself, on any piece of work.

## Finding the seam is the job

Wanting to ship soon is what sends you looking for the seam. Understanding the shape of the problem is what lets you find it instead of guessing. Skip the second one, and the urge to move fast turns into forcing a cut wherever's convenient. Do both, and you get something rarer: real progress that doesn't cost you later.

The tools for cutting have never been faster, and that's a good thing. Finding where to cut is still the job.

Slice, don't hack. The seams are there, in almost every big problem you'll face. All it takes is looking for them.