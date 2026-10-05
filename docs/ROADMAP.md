# Blog Roadmap

The living plan for blog.moriel.tech. Update the checkboxes as work merges, and record new decisions in the **Decisions** section so later conversations don't reopen them.

**Rule for every PR: once merged, it's production-ready.** Each big feature ships as one PR (with as many commits as it needs). It's checked on the Netlify deploy preview and merged only when the live site would be complete and consistent: no half-built pages, no broken links, no nav entries that lead nowhere.

---

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Stay on static Astro + Netlify. No WordPress. | Security (nothing on the server to attack), performance, upgrades can be previewed before going live. Every planned feature can be built at build time. Revisit only for memberships or selling directly, and then look at Ghost first. |
| D2 | Keep Giscus for comments. | No infrastructure, and moderation through GitHub. Revisit (Hyvor Talk / Remark42) if needing a GitHub account, or not being able to approve comments first, becomes a real problem. |
| D3 | **Sections** are the curated categories: at most one per post, each with a hand-written landing page. **Tags** stay as cross-cutting topics. | Sections are a post's "home"; tags describe what it's about. |
| D4 | "Physics of Software" becomes a section and stops being a tag. | Avoids two near-identical pages (`/tags/…` and `/physics-of-software/`). |
| D5 | Post URLs don't depend on the section: `/posts/<slug>`. | Moving a post to another section never breaks links or comments. |
| D6 | Giscus threads are keyed to the post slug (`mapping="specific"`, strict matching), not the URL path. | Comments survive URL and layout changes. Done now, while there are no comments to lose. |
| D7 | All posts appear in `/posts` and the main RSS, whatever their section. Sections also get their own RSS. | Sections are categories, not separate audiences. |
| D8 | The order of posts within a section lives in frontmatter (`order`), never in the URL. Posts are sorted by `order`, and posts without one follow by date. `order` never changes the post's displayed `date`. | Reordering chapters must not change URLs, and an episode's blog post can be published long after the episode (or out of sequence) and still land in episode order. See [Ordering](#ordering-and-previousnext). |
| D9 | Sections with no published posts don't appear in the nav, but their landing page still builds (a "coming soon" state). | Lets the book page exist before the first post. |
| D10 | Physics of Software landing page lists posts only (no list of episodes pulled from YouTube). | Keep it simple; revisit later. |
| D11 | Landing pages are top-level (`/physics-of-software/`), protected by a build check against reserved route names. | Shortest URLs for YouTube descriptions and the book. The build check makes a clash impossible. See [URL options](#url-options). |
| D12 | Post URLs carry no date. Dated filenames are fine; the date prefix is stripped from the slug. The already-published dated URLs get 301 redirects. | Uniqueness is enforced by a build check instead, and evergreen posts don't look dated. |

## Open questions

- [ ] Delivery Engineering section: intro text and hero image (from Moriel). It can ship as "coming soon" without them.

---

## PR plan

Ordered by urgency. PR 1 comes first because the comment mapping only stays free to change until the first comment arrives.

### PR 1: Stable post identity (slugs, comments, redirects)

- [x] Decide on dates in slugs (D12).
- [x] Generate the post ID with the glob loader's `generateId` (drop the `YYYY-MM[-DD]-` filename prefix), allow an optional `slug` frontmatter override, and add 301 redirects in `public/_redirects` for the two published dated URLs.
- [x] Build fails on duplicate slugs.
- [x] Stop tracking the generated `.astro/` folder; replace the leftover Nuxt `.gitignore` with one for Astro.
- [x] Import `z` from `astro/zod` (the `astro:content` export is deprecated and removed in Astro 7).
- [x] Giscus: `data-mapping="specific"`, `data-term` = post slug (overridable with an optional `commentsId` frontmatter field, so a renamed post keeps its thread), `data-strict="1"`. Strict matters: with fuzzy matching, `intro` could pick up the `dddnd-intro` thread.
- [ ] Delete any empty discussions already auto-created in `mooeypoo/blog.moriel.tech-discussion` (as of 2026-10-05: #2, `posts/genai-localization-experiment-intro/`, empty).
- [ ] Preview: old URLs redirect, each post loads its own (empty) thread, and posting a test comment creates a discussion titled with the slug (then delete it).

### PR 2: Upgrade to Astro 7

Before the image and sections work, so neither is built against APIs that are about to change.

- [x] Upgrade `astro` 6 → 7 and `@astrojs/vue` 6 → 7 together (`@astrojs/vue` 7 requires Astro 7); bump `@astrojs/sitemap`.
- [x] Work through the official Astro 7 upgrade guide for breaking changes that affect this site. What applied: Markdown now runs through Sätteri (the rehype link plugin was ported to a Sätteri hast plugin), and `compressHTML` defaults to JSX-style whitespace stripping (set back to `true`). Sätteri renders `--` as an en dash rather than an em dash, so prefer a literal `—` or `---` in posts.
- [x] `z` already comes from `astro/zod` (done in PR 1), since `astro:content`'s `z` is removed in 7.
- [x] Bump `engines.node`, `.nvmrc`, `netlify.toml` and CI if Astro 7 needs a newer Node. (Not needed: Astro 7 requires Node ≥ 22.12.0, which is what we pin.)
- [x] Markdown links: only external links open in a new tab, marked with an icon plus screen-reader text; links within the blog stay in the same tab.
- [x] Approve esbuild's install script (npm `allowScripts`).
- [ ] Preview: compare every page type against production (home, `/posts`, pagination, tags, a post with images, RSS, `latest-posts.json`, sitemap, theme toggle, comments).

### PR 3: Image performance

- [x] Post hero: stop using the raw source PNG as a CSS background (currently 4.6–7.3 MB). Now a `<picture>` with AVIF (WebP fallback), loaded eagerly at high priority.
- [x] OG/Twitter image: a resized JPEG (max 1200px wide) instead of the source PNG, also used in JSON-LD, RSS `media:content` and `latest-posts.json`. Not cropped to 1200×630: some preview images are panoramic (e.g. 807×344) and would need upscaling.
- [x] Inline Markdown images: `srcset` via `image.layout: 'constrained'`, with `sizes` matching the 800px article column. Post images in `public/` moved to `src/assets` so they're optimized.
- [x] Self-host fonts with Astro's Fonts API (same families and weights, upright only).
- [x] Measure page weight and LCP before and after (headless Chrome, throttled to 150 ms RTT / 1.6 Mbps): Junior Developer Collapse 8.0 MB → 0.4 MB, LCP 39 s → 1.7 s on mobile.
- [ ] Preview: hero, inline images and fonts look the same as production; share a post URL in a social preview tool to check the card image.

### PR 4: Security baseline

- [ ] Security headers in `netlify.toml`: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`.
- [ ] CSP allows only what's used: `data:` in `img-src` (the external-link icon is an inline SVG mask), Giscus, Plausible, and later YouTube (nocookie). Fonts are self-hosted since PR 3. Check whether Astro's built-in CSP support can produce hashes for the inline scripts.
- [ ] Dependabot (or Renovate) for npm and GitHub Actions; bump the outdated `actions/*@v3` in CI.
- [ ] CI uses `npm ci` instead of `npm install`.
- [ ] Preview: no CSP violations in the console on the home page, a post, tags, RSS, and comments with the theme toggled.
- [ ] **From now on, every PR that adds a third-party origin updates the CSP.**

### PR 5: Sections and landing pages

- [x] Decide on the URL scheme (D11).
- [ ] `sections` content collection: one Markdown file per section with `title`, `description`, `hero`, `links[]`, `itemLabel` (e.g. "Episode" or "Chapter"), `unordered: include | exclude` (default `include`), and the intro as the body.
- [ ] Posts: optional `section: reference('sections')` and optional `order` (positive integer).
- [ ] Landing page: intro, links, the section's posts in sequence order, then (for `unordered: exclude` sections) the remaining posts by date under **Updates**.
- [ ] Previous/next navigation within a section (see [Ordering](#ordering-and-previousnext)).
- [ ] Section label on post cards and post headers, linking to the landing page.
- [ ] Per-section RSS; the main RSS gains a `<category>` for the section.
- [ ] Nav lists only sections with at least one published post. Sections with no posts render a "coming soon" landing page.
- [ ] Build fails on: a section slug that clashes with a reserved route, a duplicate `order` within a section, or a section that doesn't exist (handled by `reference()`).
- [ ] Migration: Physics of Software post gets `section: physics-of-software`, the tag is removed and replaced with other tags, and a 301 redirect goes from `/tags/physics-of-software` to the landing page.
- [ ] Delivery Engineering section file (can ship as "coming soon"; intro from Moriel).
- [ ] Preview: both landing pages, prev/next links on the Physics of Software post, nav, RSS feeds, and the redirected tag URL.

### PR 6: Reading time

- [ ] Calculate the word count at build time and show "N min read" on post cards and post headers.

### PR 7: YouTube integration

- [ ] Post frontmatter `video: <youtubeId>`: a click-to-load player at the top of the post (`youtube-nocookie`, no YouTube JS until clicked), plus "Watch on YouTube" and "Subscribe" links.
- [ ] Remark plugin: a bare YouTube URL on its own line becomes the same click-to-load player.
- [ ] Replace the raw `<iframe>` in `genai-localization-experiment-intro.md`.
- [ ] `VideoObject` JSON-LD on posts with `video`.
- [ ] Channel link in the header and footer.
- [ ] Update the CSP.

### Later (not yet split into PRs)

- [ ] Post card images on list pages: add AVIF and tighten `sizes` (the home page still loads ~0.5 MB of card images on mobile).
- [ ] Pagefind static search.
- [ ] OG image generated per post at build time.
- [ ] "Listen" button using the browser's speech API (Web Speech API).
- [ ] Newsletter signup, starting on the Delivery Engineering "coming soon" page.
- [ ] MDX for interactive Physics of Software diagrams.
- [ ] Book home page (`layout: book` on the section).
- [ ] Audio generated ahead of time or recorded per post, possibly as a podcast feed.
- [ ] Re-evaluate comments (D2) if the audience outgrows Giscus.
- [ ] Section page lists episodes that don't have posts yet (D10).
- [ ] Apply the internal/external link rule beyond Markdown links: raw HTML `<a>` tags inside posts (the Markdown plugin doesn't see them) and template links (nav, footer, post cards).

---

## Design notes

### URL options

**Decided: option A (D11).** Kept for context.

Posts stay at `/posts/<slug>` whatever we choose here (D5). The only question is where landing pages live.

| Option | Landing page | Pros | Cons |
|---|---|---|---|
| **A. Top level** | `/physics-of-software/` | Shortest and easiest to share; reads like a destination | Shares a namespace with `/posts`, `/tags` and `/rss.xml`, so it needs the reserved-name build check |
| **B. `/series/`** | `/series/physics-of-software/` | No clashes; fits both a video series and a book | A future section that isn't a "series" would be mislabeled |
| **C. `/topics/` or `/sections/`** | `/sections/delivery-engineering/` | No clashes; neutral | "Topics" blurs with tags; "sections" sounds like site jargon |

Top-level URLs were chosen because the landing pages are what gets linked from YouTube descriptions and the book, so short URLs pay off. The build check makes a clash impossible rather than just unlikely.

**Dates in slugs (D12):** they solved a problem that isn't really there (slug uniqueness is enforced with a build check), and they make evergreen posts look dated. Dated *filenames* stay allowed for sorting in the editor, but the date is stripped from the URL. The two published dated posts get 301 redirects. This happens in PR 1, before any comments exist.

### Ordering and previous/next

`order` is post metadata (D8), never part of the URL. The landing page and the prev/next links compute the sequence from it at build time.

```yaml
# Physics of Software post, published today about an episode from months ago
section: physics-of-software
order: 4          # the episode number
```

**One rule for every section:** posts with `order` come first, sorted by `order`, and posts without `order` follow, sorted by date. This means:

- An episode post can be published at any time and in any sequence; `order: 4` puts it at episode 4 no matter when it was published.
- `order` only controls position within the section. The post's frontmatter `date` stays the date shown on the post and the date used everywhere else (`/posts`, tags, RSS). A post written today about an old episode shows today's date and appears as new in the feed, while sitting at its episode number on the landing page.
- `order` is the displayed number ("Episode 4", "Chapter 3"), so it should match the real episode or chapter number. Prev/next skips gaps: if only episodes 2 and 5 have posts, "Next" from 2 goes to 5. Inserting a chapter means renumbering the chapters after it, which is safe because URLs don't change.
- Posts without `order` get no number label. In Physics of Software they're a fallback: they still join the sequence, after the numbered episodes.
- **`unordered: exclude`** (set on the book section) keeps posts without `order` out of the sequence entirely. Announcements and behind-the-scenes posts show under **Updates** on the landing page and have no prev/next, so they never interrupt chapter-to-chapter reading.
- The build fails on a duplicate `order` within a section.
- **Posts without a section:** no prev/next.
- Drafts never appear in the sequence, so prev/next never links to an unpublished page.

### Section file example

```yaml
# src/content/sections/physics-of-software.md
---
title: The Physics of Software
description: Real physics, and what it says about your codebase.
hero: ../../assets/images/sections/physics-of-software.png
itemLabel: Episode
# unordered: exclude   # used by the book section; the default is include
links:
  - { label: Watch the series, href: https://www.youtube.com/playlist?list=… }
  - { label: Subscribe, href: https://www.youtube.com/@MorielTech }
---
Intro text, in Markdown…
```

---

## Conventions

### Code comments

Be concise. Comments explain *why* (the key reasoning); the code shows *how*. No comment is better than a pointless one, because pointless comments bury the information that matters.

### Commits and PRs

- One feature per PR; commits within it are logical steps, each with a message that explains the reason for the change.
- Every PR: CI build passes, the Netlify deploy preview is checked against the PR's checklist, no URL breaks without a redirect, and this roadmap's checkboxes are updated in the same PR.
