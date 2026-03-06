---
title: What AI Exposed About Iterative Development
date: 2026-03-05
tags: 
  - Gen AI
  - Localization
description: I asked AI to build an app step by step – and to document every assumption it made along the way. What emerged was a striking mirror of how real software teams drift into invisible defaults and expensive "later" fixes.
---

We usually think of software development as this super intentional process where every little choice – like field names, validation rules, or the UI layout – is completely deliberate. 

But... we've all been there. We all know that's not quite true in real development situations.

Software usually grows through a bunch of assumptions. Some we talk about, some we don't recognize, and most of them seem totally reasonable at the time.

Iterative development gives us lots of benefits – from shipping fast so we can test things, to constantly verifying our app's real life behaviors in front of real life users, to making sure we can pivot quickly when needed.

But iterative development also requires us to keep track of the assumptions we're making, shift those when needed, and, potentially, recognize whether (and when) we need to rethink an earlier approach when more and more requirements and pivots come in. We tend to refer to those cases as "sunk cost fallacies", or "loss aversion", or "decision blindness". There are books and books out there talking about how to avoid falling into these – because they're normal for the industry. They're hard to avoid, and when they happen, they're hard to overcome.

Iterating fast on a piece of software also makes us lean towards prioritizing smaller changes over bigger ones, which is understandable, but if each iteration carries assumptions with it, it's gets harder and harder to keep track on dependent and resulting assumptions, and which may need to be reassessed.

Some of the eventual requirements are really hard to anticipate in advance.   
And some get hard to fix and implement later.

... Like localization concerns. 

## Experiment: Reviewing Gen AI iterative assumptions

So, I ran a little experiment: I had a generative AI build an application piece by piece.

I gave really vague, open-ended instructions, the kind you hear all the time early in a project: "add a user profile", "make it possible to add a user" or "add a feature to allow the user to set how they want to be referred."

The twist was what I asked *every single time*: I made the AI spell out all the assumptions it was making, flag any ambiguities it recognized, and explain how it decided to resolve them. It's a level of systematic self-reflection that rarely gets documented or explored, regardless of AI.

### Goal 1: Expose (and examine) iterative assumptions

The main goal was to watch those decisions being made in real-time, and see how initial assumptions influence later work. 

I wanted to see how the small, often silent, choices–both explicit and implicit–quietly mold the system's architecture, basically deciding what's going to be a simple fix or a huge headache later.

### Goal 2: What happens when we "localize later"

A secondary goal was testing how localization (all the stuff like identity, language, text direction, and culture) gets worked in over time. Teams often put off localization, saying, "we'll deal with it later." I deliberately copied that real-world habit by just dropping localization requests into the development prompts as we went, instead of having a detailed plan from the start.

## Gen AI is a statistical mirror

The AI's results were an impressive mixed bag: sometimes it was surprisingly good at spotting future problems – better than many industry practices, actually – and other times it made assumptions that it had to pay for later. All of it was illuminating.

Generative AI is essentially a statistical mirror, reflecting all the common habits and patterns from the data it was trained on. So when it builds software, it's not inventing things out of the blue; it's just speeding up and clarifying our industry's collective development instincts.

By forcing these automated instincts to explain themselves, some fascinating trends popped up. You start to see the "gravitational pull" of those early decisions: the assumed users, the context we decided to ignore for now, the invisible defaults, and how the fundamental architecture quietly sets its course.

Assumptions are unavoidable in software; the choice is how we decide to handle them.

## The setup (briefly)

I instructed the AIs to build the app step-by-step, mimicking real-world iterative development without a perfect initial design. 

I purposefully did not hint at wanting localization, I wanted to see how the AIs iterate when localization and translation are added as an "extra" feature without planning for it. Amusingly, I had to redo the first experiment because the AIs deduced it needed to consider localization from the folder name. Sneaky. I renamed the folder and started from scratch.

After each step, I committed the code and added a `step-xx` Git tag, allowing anyone to trace the process. I later built a wrapper app to automatically generate and display the app at every step in an iframe, alongside the agent's notes and the original prompt.

The key was to minimize my intervention, unlike a normal project. The goal was to observe the agents' architectural choices and how they naturally incorporated localization as the app evolved. The results were highly insightful.

You can explore the visual step display here:

* Cursor/Sonnet: [https://mooeypoo.github.io/experiment-genai-localization](https://mooeypoo.github.io/experiment-genai-localization)   
* Copilot: [https://mooeypoo.github.io/experiment-genai-localization-copilot](https://mooeypoo.github.io/experiment-genai-localization-copilot) 

## The Patterns That Emerged

Overall, the agents implemented the app I told them to, as expected. They also made a lot of assumptions – some implicit, some explicit, some they obviously recognized and others they missed, and would need to deal with in later steps. 

It was surprisingly realistic for app development, and I was surprised and excited to see that the agents managed to predict correct best-practices in some occasions where many websites and apps tend to fail. It says a lot about what we tend to assume, and what we might want to pay attention to a bit more.

But this isn't a deep-dive just yet. This is a general introduction, so let me introduce what I found to be the high-level observations about patterns of iterative development – especially when it comes to localization. 

### Small early choices shape big outcomes

**Early decisions become constraints.**

In one early step, I asked the agents to "*enhance the user model to include a preference for how users should be referred to in the UI.*"

Vague, on purpose. One agent interpreted this as adding a display name. Another interpreted it as adding pronouns.

That subtle difference surprised me, and while it didn't make a big difference immediately, it did make a difference later, when we introduced the first translations.

When Spanish and French were introduced, the agent that modeled pronouns (Copilot) anticipated having to handle gendered language in translation and adopted a more robust internationalization setup (using vue-i18n library). The other (Cursor/Sonnet) considered the relatively lightweight translation requirement (only adding two Latin-based languages) as mostly adjusting static text – and missed that potential layer of complexity. 

It ended up deciding that since there aren't many strings to translate, and no pluralization rules (yes, it called that out... it will also learn it is wrong 4 prompts later) it decided that a custom bespoke module is better.

Ultimately, neither one of these decisions were strictly wrong, but those early decisions influenced the subsequent architecture pretty significantly. Cursor/Sonnet agent persisted with the custom translation component even when the prompts added more and more complex translation requirements. It consistently rationalized that it was simpler to incrementally add complexity ("duct-tape") onto the existing structure rather than pausing, re-evaluating the comprehensive requirements, and refactoring to incorporate the substantially more robust `vue-i18n` module.

By the end prompt, when I requested to "*improve dynamic text so that messages feel natural across supported languages*", Copilot (which used vue-i18n from the earlier step and added pronoun support) recognized the gendered language issue and adjusted strings and operations for it. Sonnet (which chose a custom i18n component, and no pronouns) stuck with pluralization rules, ignoring the gendered language aspect of all languages. It was, indeed, simpler... but it was very noticeable for users.

**Observation: Early decisions feel light – until they aren't. And sometimes we don't recognize that shift, and risk drifting into space.**

![Comparison of Copilot and Sonnet's interpretation of user preference modeling and translation approach](/images/posts/step5-comparison.png)
*Copilot's choice to model pronouns early led to a more robust i18n architecture using vue-i18n. Sonnet's custom approach meant that by the end, it underestimated the complexity of gendered languages.*

### The user you didn't model still exists

**If you don't model the user explicitly, the system invents one.**

When asked to create a form to add users, both agents automatically decided to not request a username, but rather to automatically generate one from the name that the user fills in. They both considered the option of naming collisions and handled those. Clean. Sensible.

When it came to localization potential, both agents considered it... and resolved it in fatefully different ways.

Cursor/Sonnet considered the option of non-Latin letters in the Full Name and decided to strip those out to avoid problematic usernames.

Copilot seemed to decide that if it can't create a username from the given name, it will create a \`userXX\` username with some ascending counter.

Interestingly, neither agent revisited these assumptions, even when I gave the prompts to add non-Latin Right-to-Left languages (Hebrew, Arabic and Farsi). As a result, if you try to insert a full name in one of those languages to the finalized app, Cursor/Sonnet app will show nothing (an empty @ symbol) and Copilot app will show a generic \`@user10\` naming fallback.

The implicit expectation that was initially made here was that users will have normalized ascii-based names, and if they don't, it's okay to "normalize" them to ascii-based username. That changed in later prompts, and while both agents didn't quite seem to revisit this – it seems that if I had insisted on a fix, they both would have needed to reimplement the username operation completely.

**Observation: If you don't define who your users are, your system quietly defines them for you.**

![Example of Hebrew display name producing empty or fallback username](/images/posts/agents-rtl-username.png)
*When neither agent revisited assumptions about ASCII-based names, RTL language users ended up with broken or generic usernames.*

### Adding context later – ripples

**Context deferred becomes complexity.**

Localization wasn't introduced as a foundational constraint. It arrived later.

When it did, identity modeling decisions suddenly mattered more. Translation required structural adjustments. Dynamic text got more nuanced. What looked simple earlier became cross-cutting.

Nothing broke dramatically, but changes rippled. Localization isn't expensive because it's inherently complicated. It's expensive because it was deferred.

**Observation: If we don't pay attention, iterative development can quietly reinforce foundational constraints.**

### Technically correct Isn't experientially correct

**Best practices are guidance. Users are the truth.**

Both agents implemented right-to-left language support when Hebrew, Arabic and Farsi were added. The interface flipped. Directionality was respected.

Technically, this was mostly correct.  
Then I switched the interface to Right to Left, visually, in the app.

The layout flipped – but user-generated content didn't isolate properly. Posts, comments, and usernames mixed directions awkwardly. The result was visually broken in subtle but very real ways. The agents did not take into account the potential difference between UI and content direction, and while the app interface can be translated, the content of posts and comments is user-generated. These do not get magically translated. When they are displayed in RTL context, their alignment and layout breaks.

Technically, RTL was supported. Experientially, it wasn't.

These aren't exotic edge cases. They're everyday realities in a global web. It's the reason why I built [rtl.wtf](https://rtl.wtf), because RTL users run into these types of behaviors practically all the time.   
(Go check it out.)

A simple fix – isolating user-generated content using `<bdi>` – would have helped here, putting some visual guardrails even before getting into the potentially bigger support adjustments.   
But the deeper lesson isn't about an html tag.

It's about lived reality. You can follow best practices and still miss what it feels like to actually use the system.

**Observation: AI can simulate best practices. It cannot simulate lived experience, or lived friction.**

![Example of non-isolated LTR content in RTL context, causing layout misalignment](/images/posts/rtl-nonbdi.png)
*While technical RTL support was implemented, user-generated content displayed in RTL contexts created visual misalignment. This illustrates the gap between following best practices and actual user experience.*

## This Isn't an AI Problem

The AI agents didn't invent these assumptions. They reproduced patterns that already exist in our ecosystem.

In fact, the request that I made for them to expose their assumptions and ambiguities exposed a lot of the decision making that we – the humans of the industry – tend to overlook, even when we make those assumptions and decisions more explicitly.

Humans tend to optimize for speed and delivery. AI optimizes for statistical coherence. Both will embed narrow defaults unless context is made explicit. And when context and reasonings are made explicit, decisions can be made more rationally. They can be explained properly later, and we can re-examine them later to decide whether they need to be changed in a much more coherent and stable way.

The experiment wasn't about proving AI flawed (it wasn't flawed at all). It was about making assumption formation visible, and learning from how statistics-driven AI makes those assumptions, and what it can expose about us – the industry – and our assumptions.

Once it's visible, it's hard to unsee.

## Make Assumptions Visible

We expect engineers to explain trade-offs, to surface ambiguities, to document reasoning. When we don't, even excellent code becomes opaque, and decisions become impossible to reason about.

The same applies to generative systems.  
If we let AI emit code without explaining its assumptions, we inherit those assumptions silently.

But when we ask:

* What ambiguities did you detect?  
* What did you assume?  
* Why did you choose this structure?

We turn a black box into a conversation.

That doesn't eliminate the "gravity" of early decisions, but it does make it visible, intentional, and much more possible to reason through and, when we need to, adjust.

Sudoish recently [explored this idea as it related to code review](https://www.youtube.com/watch?v=gcnvjy1kQR4): "*AI can produce large, professional-looking PRs quickly, but reviewers lack the reasoning trail behind the changes, creating opaque code that's hard to validate.*" 

Exactly. Opaque assumptions create opaque code.

## What all of this means

We are entering an age of rapid software development, which means we will be building more applications, faster.

This speed comes at a cost: assumptions will solidify at an accelerated pace.

Software is more than its features; **it's a crystallized set of decisions about the people who will use it**. If these decisions remain unstated, they become invisible and unchangeable truths. When they are made explicit, however, they can be examined, adjusted, and improved.

Core elements like localization, identity management, text directionality, and naming conventions are not optional features. They are fundamental expressions of whom your software is designed to accommodate.

Ultimately, the responsibility for these decisions rests with us, whether the software is built by a person or a machine.

Assumptions are unavoidable, but we can make them explicit and visible. 

## Next Steps: Dive Deeper

The high-level patterns I've discussed here are just the tip of the iceberg. The full, step-by-step evolution of both AI-built applications contains dozens of subtle decisions, architectural trade-offs, and unexpected "gems" that are worth exploring.

I encourage you to dive into the repositories and the visual step-by-step displays. Trace the changes from one prompt to the next. See for yourself how a single early assumption solidified into a major architectural constraint later on.

If you spot a particularly interesting decision or an insightful assumption, I'd love to hear about it.

I'm considering a couple of deeper dives into specific elements of the experiment, looking into some of the specific tradeoffs of translations or right-to-left support and what we can learn from those. Stay tuned for more analysis, but in the meantime, come explore the data yourself and let me know what you find.
