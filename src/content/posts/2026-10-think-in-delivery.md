---
title: "The Old Habit That Separates Great Engineers in the AI Age"
date: 2026-10-16
tags:
  - Tech Industry
  - Architecture
section: engineering-at-speed
order: 1
description: The engineers I've most wanted to work with were never the fastest or the most careful. They were the ones who could do both at once, and that has always been the job.
image: ../../assets/images/posts/think-in-delivery.jpg
---

*The engineering attitude you need to succeed in a fast-moving industry.*

"Ship fast" has a reputation problem, and honestly, it's earned.

Most engineers have a story: the quick fix that grew into something nobody wanted to touch, the "temporary" shortcut that became load-bearing, the sprint that left the next team months of cleanup. When someone says "let's move fast," the instinct to wince is reasonable. It usually means someone is about to make your life harder.

But shipping fast and shipping recklessly aren't the same thing, and treating them as if they are is where a lot of good engineers get stuck.

There are two paths that feel safe in engineering. One optimizes for speed at the expense of everything else: move fast, ship something, deal with the consequences later. The other optimizes for quality at the expense of movement: do it right, take the time it takes, ship when it's ready.

Both take real skill. Neither asks you to hold both at once.

The hard path is holding both at the same time. Moving with urgency *and* shipping with care. Not as a compromise between the two, but as a real ability to find the fastest responsible path to something shippable, on any problem, in any context.

I call that thinking in delivery. Right now it matters more than it ever has, but it isn't new. It's what the best engineers have always done.

## The ground is moving faster

Software has always been built on moving ground. What's different now is the speed.

The thing we ship next month might need reshaping three months later, because the platform changed, the users changed, or the whole idea of what the product should be shifted underneath us. We can't spend a year building toward a target that won't be standing still when we get there.

And AI is changing what's expected of us. When a lot of the code can be written for us, the job moves toward everything around the code: deciding what to build, shaping it so it can bend, checking that what came back is sound, and owning what ships.

Pivoting used to be an occasional event. Now it's the normal shape of the work.

## The engineers we remember

Think about the best engineer you've ever worked with. The one you'd want on your team again tomorrow.

I'd bet they weren't the fastest typist in the room, and they weren't the one who polished every function until it gleamed. They were the one who could look at a messy, half-defined problem and get something real and solid out the door, then learn from it, then make it better. The one whose work you could build on. The one who, somehow, always seemed to know which corners were safe to cut and which ones would come back to haunt everyone.

When I look back at the engineers who grew into the tech leads and architects people actually wanted to follow, that's the common thread. Not raw speed. Not perfectionism. Delivery.

None of this is new, either. Fred Brooks was telling us to "plan to throw one away" back in 1975. John Gall observed around the same time that complex systems that work tend to grow out of simple systems that worked, not get designed whole from scratch. Engineers have been rediscovering the value of shipping working software early and often for decades.

The only thing that's changed is how fast the ground moves. Thinking in delivery used to be what set the best engineers apart. Increasingly, it's the job.

## What the attitude actually is

It's worth being specific about what this feels like from the inside, because it's easy to mistake it for something else.

It's not anxiety. It's not a deadline bearing down, or the fear of falling behind. Engineers who ship fast out of anxiety tend to cut corners because they're scared, and the work shows it.

The delivery attitude is closer to eagerness. It's the instinct that makes you look at a big problem and immediately start asking: what's the smallest real version of this that's honest and useful? What could I get in front of someone this week? What would I learn from shipping something sooner rather than later?

It's a bias toward movement, held calmly.

The anxious version of urgency and the calm version can look similar from a distance. Both move fast. But they come from different places, and they produce different work.

This is also why most advice about shipping fast misses the point. It tells you to prioritize ruthlessly, cut scope, move faster. That advice isn't wrong, but it's about tactics, not attitude. An engineer who doesn't *want* to ship soon will treat every one of those tactics as a reluctant concession. The attitude is what makes the tactics feel natural instead of uncomfortable. It has to come first.

## Why it makes you better, not just faster

Here's the part I care about most. A deadline can push you to move faster, but it can't teach you judgment. The attitude, practiced consistently and for its own sake, does. Wanting to ship soon, and meaning it, puts real pressure on your engineering, and over time that pressure builds skills that are valuable everywhere.

### Shipping is how you learn

Every time you ship something, the world tells you things your design process couldn't. A feature that seemed solid on a diagram behaves unexpectedly once real people use it. An architecture that looked clean on paper bends under real load in ways you didn't anticipate.

Getting something out there isn't giving up on quality. It's running the most important test you have.

And it compounds. An engineer who ships something real every couple of weeks gets dozens of these lessons a year. An engineer who ships once a quarter gets four. Over a career, that difference is enormous. This is the engine underneath everything else on this list.

![Four lessons a year vs dozens or more lessons a year. Over a career, the difference is enormous.](../../assets/images/posts/think-in-delivery-comparison.jpg)
*Four lessons a year vs dozens or more lessons a year. Over a career, the difference is enormous.*

### You learn to read the shape of a problem

If you need to ship something real soon, you can't afford to build one tangled thing and plan to untangle it later. You have to understand where the natural boundaries are: where a piece can come away cleanly, and where it can't. What's actually coupled, and what only looks that way because of a decision someone made years ago.

The engineer who has done this many times starts to see the shape of problems faster. They know what questions to ask. They know where to look for the seam.

### You learn where you might be wrong

You can't ship everything at once, so you have to choose what to validate first. That forces an honest kind of self-assessment: where is my confidence high enough to commit, and where am I guessing? What's the riskiest assumption in this design, and how do I test it cheaply before building everything on top of it?

That's not caution. It's being strategic about uncertainty.

### You build flexibility where it matters, and nowhere else

There's a trap many of us fall into when we want to be thorough: building for every possible future. Configurable everything, abstract layers on top of abstract layers. The intention is good. The result is usually slower to build, harder for anyone else to understand, and its own kind of maintenance burden.

Thinking in delivery pushes against that, but not toward rigid, unmaintainable code either. It pushes toward architecture that's flexible in the specific places where you know things might change, and simple everywhere else. Knowing which places those are is judgment, and you only get it from repeatedly asking: what do I need to be able to change here, and what can I commit to?

### You see risk in proportion

Not everything is a blocker. One of the most important skills an engineer can develop is telling the difference between a problem that has to be solved before you ship, and one that can be named, tracked, and handled later with its cost out in the open.

Engineers who default to thoroughness often treat every concern as a blocker, because blocking *feels* responsible. But stopping a ship is only responsible when the risk actually warrants it. Everything else is a tax on the team. Asked over and over, across many pieces of work, the question "is this really a blocker?" builds a sense of proportion: the ability to see risk clearly without overstating it.

### You become someone people can move with

The engineer who wants to ship soon can't disappear for two weeks and surface with something nobody else can maintain. They share what they're building, raise risks early, and ask for input before they're too far down a path to turn around. That's not just good manners. The attitude requires it.

It changes how you take feedback, too. When a colleague proposes a different approach, your first instinct stops being to defend your solution and starts being curiosity: does this change what we can ship? Is there a better version here? That goes for everyone, by the way, not only senior people. A junior engineer looking at your code for the first time might notice exactly the thing you stopped seeing because you've been staring at it too long.

And it changes how you handle pivots. Requirements change. Something that was the right thing to build last quarter isn't always the right thing now. For an engineer deeply attached to a specific implementation, a pivot feels like a loss. For an engineer thinking in delivery, it's the next problem to work on. The work was right for what was known when you built it. Now something new is known.

That doesn't mean it doesn't sting when work you're proud of gets cut. It does, and it should. But the thinking you did and the judgment you built while doing it don't disappear with the code. The code isn't the only output. You are an output too.

### And then people trust you with more

Put all of that together, and you get the thing that actually separates the engineers we remember.

People who reliably turn effort into working, sound software, who flag risk in proportion, who can be disagreed with and still move with the team, get handed bigger problems. Then bigger ones. That's how they become the tech leads, the architects, the principals. Not because they were the fastest, and not because they were the most careful, but because they were the ones you could count on to get something good out the door, and to know what "good" needed to mean this time.

It was true before AI. It'll be true after whatever comes next.

## Where this breaks

I'd be doing exactly the thing I'm arguing against if I pretended this attitude has no edges.

**It breaks when "fast" quietly becomes "sloppy."** A shortcut that leans on something it shouldn't, buried where nobody else can see it, isn't delivery. It's a hack, and it borrows against the future to pay for today. If you can't explain plainly what corner you cut and why it was worth cutting, that's a sign you're looking at a hack.

**Some decisions do deserve "build it right, once."** Data models that other systems will build on. Public APIs. Security. Anything that gets expensive to walk back the longer it stands. Thinking in delivery doesn't mean treating those like everything else. Knowing which decisions they are is part of the skill, not an exception to it.

**Mastery still matters.** Some engineers are valued for deep expertise, and they should be. But even there, the ones who have the most impact are the ones who get that expertise into something people can use. Mastery is the engine. Delivery is what connects it to the wheels.

## A small field kit

A few questions I find myself asking, on almost any piece of work:

- **What's the smallest real version of this that's still honest and useful?**
- **What's the assumption I'm least sure about, and how could I test it cheaply?**
- **Where will this need to bend later, and where can I commit now?**
- **Is this concern a blocker, or something I can name and follow up on?**

None of them is a rule. They're just the questions that tend to send me looking in the right direction.

## Ship soon, ship well

Good engineers can move fast. Good engineers can be thorough. Doing both at once, with the instinct to push toward something shippable and the judgment to know what responsible looks like in this particular situation, is harder than either, and rarer.

It doesn't come from following a process. It comes from wanting to ship, and meaning it, and letting that want press on every part of how you work: how you read a problem, how you design a system, how you show up in a review, how you respond when things change. Over time, that pressure builds something. Sharper judgment, better instincts, and a team that trusts you with the hard stuff.

I've been writing down a lot of what I've learned about this over the years, from how teams stay aligned to how to raise a concern without becoming a blocker. More of it is coming here soon.

In the meantime: ship soon. Ship well. The two aren't in tension. Holding them together is the work.