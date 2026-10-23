---
title: "Software's “It Depends” Isn’t a Dodge. It’s Physics."
date: 2026-10-18
tags:
  - Architecture
  - Localization
section: physics-of-software
order: 3
description: "Ask an expert, get “it depends.” It’s the most precise answer in software, and Galileo knew why in 1632. Here’s how to read the frame behind any advice."
image: ../../assets/images/posts/it-depends-frame-of-reference.jpg
video: 3El6r5OmYXM
---

There's a phrase that gets tossed around in software, and it frustrates almost everyone who runs into it: "It depends." You go to an expert, you ask a question, you expect solid advice, and you get something that feels unhelpful. It depends.

I hear it a lot when I help with right-to-left support. "Should I mirror my icons for right-to-left languages?" It depends. "Should we flip the interface?" It depends. It really does.

And every time, I watch the small disappointment land. They wanted a rule. A yes or a no they could hand to their team and move on. A clear path forward they could estimate, plan for, and implement.

But there isn't one.

A back arrow should flip, because in Hebrew or Arabic, "back" points right. A clock icon shouldn't, because clocks turn the same way everywhere. A play button usually stays put too, since it points the way tape moves, not the way text reads. A checkmark stays put. And a help icon with a question mark? Flip it for Arabic, which writes its question mark mirrored (؟). Leave it alone for Hebrew, which doesn't. Same icon, same "RTL support," two right answers, depending on which RTL readers you're building for.

So: it depends. On the icon, what it means, where it sits, and who's looking at it.

![The same interface in left-to-right and right-to-left: the back arrow and progress bar flip, the clock, play button and checkmark don't](../../assets/images/posts/it-depends-rtl-icons.jpg)
*The same interface in left-to-right and right-to-left: the back arrow and progress bar flip, the clock, play button and checkmark don't*

I know it sounds like a dodge. I think it's the opposite. It's the most precise answer available, because most software advice is a measurement taken from inside someone else's frame of reference. "It depends" is how you ask for the frame.

Physics figured this out a long time ago. Longer ago than you'd think.

## Galileo Figured This Out in 1632

When people hear "frames of reference," they think Einstein. Fair enough. But nearly three hundred years before Einstein, Galileo laid out the core idea with a ship, a bowl of fish, and some butterflies.

The argument he was up against went like this: the Earth can't be moving. If it were, we'd feel it. Drop a stone and it would land behind you. Birds would get left behind.

So in his 1632 _Dialogue Concerning the Two Chief World Systems_, Galileo asks you to picture this: Shut yourself in a cabin below deck on a large ship. Bring some flies and butterflies. Set up a bowl with fish in it, and hang a bottle that drips into a basin underneath. While the ship is docked, watch. The butterflies drift in every direction. The fish swim evenly around the bowl. The drips fall straight down. Toss something to a friend, and it takes the same effort in any direction.

Now let the ship sail, smoothly, at any steady speed. Watch again.

Nothing changes. The drips still fall straight into the basin. The butterflies don't pile up against the back wall. There's no experiment you can run inside that cabin that tells you whether the ship is moving.

That was his answer to "we'd feel it": no, you wouldn't. From inside, a steady frame feels exactly like standing still. Everything checks out. Everything is consistent. Nothing hints that there's any other way to see it.

Hold onto that, because it's the trap we fall into in software. The people who were sure the Earth stood still weren't foolish. Their frame was self-consistent. It just wasn't the only one.

Einstein pushed the idea further. Seal yourself in an elevator with no windows. You feel your normal weight. Are you standing still on Earth, or accelerating upward at exactly one g through empty space? Inside a small enough elevator, nothing you measure can tell those two apart. ("Small enough" matters: in a very tall one, you could catch the slight difference in how strongly gravity pulls at the top versus the bottom.) Even gravity depends on your frame.

So what doesn't? This is where relativity gets its backbone. The laws of physics are the same in every frame, and the speed of light is the same for every observer. Time, distance, and velocity are measurements, and measurements depend on where you're standing. Laws don't.

Invariant laws, frame-dependent measurements. Keep that pair. That's the whole point.

## GPS Works Because Someone Did the Frame Translation

My favorite place this shows up is GPS. Yes, even the one in your phone.

GPS satellites carry atomic clocks, and those clocks don't tick at the same rate as clocks on the ground. The satellites move fast, which slows their clocks by about 7 microseconds a day. They're also farther from Earth, where gravity is weaker, which speeds their clocks up by about 45 microseconds a day. The net result is that satellite clocks gain about 38 microseconds a day compared to ours on Earth.

That sounds like nothing. But GPS works out your position from how long signals take to travel, and light covers about 300 meters in a microsecond. Left uncorrected, the error would grow to around 10 kilometers a day.

So which clock is right? Both. Each one is a correct measurement in its own frame.

The engineers didn't settle the problem by picking a winner. They built the translation into the system: the satellite clocks are set to tick slightly slow before launch, so that seen from the ground, they keep the right time. They did the conversion on purpose.

So how long is a second, as a satellite clock counts it? It depends: is the clock in orbit, or on the ground? And once you know _that_ it depends, you can plan for it.

## "Left" Is a Measurement

Back to software, and back to RTL, because that realm has one of the cleanest examples of frames in code.

For years, CSS gave us `margin-left`, `padding-right`, `float: left`. Perfectly reasonable, as long as everyone reads left to right. Then you load the page in Hebrew or Arabic, and everything that was supposed to sit at the start of the line is sitting at the end.

The fix was to stop describing the measurement and describe the thing underneath it: `margin-inline-start` instead of `margin-left`. "Start" is the invariant. Every language has a place where reading begins. "Left" is just what start measures as, from inside a left-to-right frame.

The same thing happens all over our interfaces. Back buttons on the left. Progress bars that fill left to right. Timelines that run left to right. Every one of those was a correct answer, measured in an LTR frame, then shipped everywhere as if it were a law. And from inside that frame, nothing looks wrong. Galileo's cabin again.

I call this **frame importing**: taking advice that was right where it was measured and applying it somewhere else without translating it.

It isn't only an RTL problem. Test-driven development is a great practice when you know what you're building: the test pins down the contract, the code fulfills it, and you ship with confidence. When you're pivoting every three weeks, the same practice becomes an anchor. You write tests for behavior you're about to throw away, and you hesitate to change anything because the tests will break. Same practice, different frame, different measurement.

AI models are about to make this louder. A model trained mostly on one frame (English, left to right, big-company engineering blogs) will give you that frame's answer with complete confidence, and nothing in the answer tells you a frame was assumed.

https://www.youtube.com/watch?v=3El6r5OmYXM

_If you'd rather watch than read, here's the same idea told differently, with a skit, an elevator, and astronauts who aren't in zero gravity._

## Knuth Told You His Frame

"Premature optimization is the root of all evil." You've probably seen it in a code review, usually as the last word in an argument.

Here's the full quote, from Donald Knuth's 1974 paper [_Structured Programming with go to Statements_](https://doi.org/10.1145/356635.356640):

> We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.

Knuth gave you his frame, right there in the same sentence: "about 97% of the time" and "that critical 3%." The advice came with its frame attached. Then the frame got stripped off as the quote was passed around, until all that was left was the part that sounds like a law.

Even the word "premature" is doing frame work. Premature relative to what? In high-frequency trading, or in embedded systems with a few kilobytes of memory, optimizing from day one is the job.

So here's the test I use. When someone says "always do X," ask whether X is a principle or an implementation.

Principles hold in every frame. Performance matters. Text flows from a start to an end. Complexity has a cost. Implementations are measurements: how fast is fast enough, which side is the start, how much complexity your team can carry. If X is a principle, they're probably right. If it's an implementation, ask which frame they measured it in.

## Read the Frame Before You Adopt the Advice

So what do you do with this? The same thing the GPS engineers did. Don't pick a winning frame. Translate.

Before you adopt a practice from a conference talk, a blog post, a senior engineer, or an AI model, run through something like this. Fill it in twice: once for where the advice came from, and once for yourself.

> **Read the frame before you adopt the advice.**
> - **Team:** how many people, and how much shared context?
> - **Scale:** how much traffic and data, and how many users hit this path?
> - **Stage:** still finding the product, or running a stable one?
> - **Stakes:** what does failure cost here (a retry, a refund, a lawsuit)?
> - **Optimizing for:** speed of change, reliability, latency, or cost?
> - **Audience:** who reads, uses, or extends this (your team, open-source contributors, someone reading right to left)?

This is a starting set, not the full list. Your context will add its own lines: regulation in fintech or health, offline users in some markets, hardware limits in embedded work. When a line shows a big gap between their frame and yours, that's where the advice needs translating, or where it may not apply at all.

One more question worth asking about any practice you're recommending: _at what scale or stage does this break?_ If you can't answer that, you don't know the practice well enough yet. People who understand a practice deeply can usually tell you exactly where it stops working.

And when you're stuck in an architecture argument that keeps going in circles, try stating both frames out loud: team size, traffic, stage, what you're optimizing for. A lot of the time, you'll find you don't disagree about the answer. You're measuring from different places and getting different numbers. Both correct.

So, should you mirror that icon for RTL?

It depends. And now you know what it depends on: what the icon means, where it sits, and whose frame you're building for.

You can't feel your frame from inside the cabin. So say it out loud, and then translate.

If you want the video version, skit and elevator included, it's [on YouTube](https://www.youtube.com/watch?v=3El6r5OmYXM). There are more physics laws hiding in our software on the channel, so subscribe if you'd like to see the rest.