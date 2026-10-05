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
| D13 | The CSP allows inline `style` attributes (`style-src-attr 'unsafe-inline'`); `<style>` elements and all scripts stay hash-locked. | Shiki colors code blocks with style attributes. Style attributes can't run script, and only Moriel writes content, so this is negligible risk versus losing syntax highlighting or maintaining a Prism theme. |
| D14 | Read-aloud is free and phased: browser speech first, then Kokoro-generated audio for flagship posts, optionally Moriel's own recordings. No paid text-to-speech service. | Browser speech costs nothing and ships quickly; pre-generated audio gives every reader the same good voice once there's a storage plan. See [Listen (read aloud)](#listen-read-aloud). |
| D15 | Videos: frontmatter `video:` adds header buttons and a default top embed; a bare YouTube URL on its own line embeds in place (and replaces the top embed for the same video); `videoEmbed: false` skips the embed. Thumbnails are downloaded at build time. | Placement stays in plain Markdown, which still reads as a link anywhere else. No request reaches YouTube until a reader clicks play. |
| D16 | Header nav links open in the same tab, including About and Contact on moriel.tech; the new-tab rule applies to links in content and the footer. | The nav moves between Moriel's own sites; opening a new tab there would feel like leaving rather than navigating. |

## Open questions

- [ ] Physics of Software playlist URL for the section's "Watch on YouTube" link (`src/content/sections/physics-of-software.md`).
- [ ] Newsletter: provider and placement (decide before PR 11).

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
- [x] Delete any empty discussions already auto-created in `mooeypoo/blog.moriel.tech-discussion` (as of 2026-10-05: #2, `posts/genai-localization-experiment-intro/`, empty).
- [x] Preview: old URLs redirect, each post loads its own (empty) thread, and posting a test comment creates a discussion titled with the slug (then delete it).

### PR 2: Upgrade to Astro 7

Before the image and sections work, so neither is built against APIs that are about to change.

- [x] Upgrade `astro` 6 → 7 and `@astrojs/vue` 6 → 7 together (`@astrojs/vue` 7 requires Astro 7); bump `@astrojs/sitemap`.
- [x] Work through the official Astro 7 upgrade guide for breaking changes that affect this site. What applied: Markdown now runs through Sätteri (the rehype link plugin was ported to a Sätteri hast plugin), and `compressHTML` defaults to JSX-style whitespace stripping (set back to `true`). Sätteri renders `--` as an en dash rather than an em dash, so prefer a literal `—` or `---` in posts.
- [x] `z` already comes from `astro/zod` (done in PR 1), since `astro:content`'s `z` is removed in 7.
- [x] Bump `engines.node`, `.nvmrc`, `netlify.toml` and CI if Astro 7 needs a newer Node. (Not needed: Astro 7 requires Node ≥ 22.12.0, which is what we pin.)
- [x] Markdown links: only external links open in a new tab, marked with an icon plus screen-reader text; links within the blog stay in the same tab.
- [x] Approve esbuild's install script (npm `allowScripts`).
- [x] Preview: compare every page type against production (home, `/posts`, pagination, tags, a post with images, RSS, `latest-posts.json`, sitemap, theme toggle, comments).

### PR 3: Image performance

- [x] Post hero: stop using the raw source PNG as a CSS background (currently 4.6–7.3 MB). Now a `<picture>` with AVIF (WebP fallback), loaded eagerly at high priority.
- [x] OG/Twitter image: a resized JPEG (max 1200px wide) instead of the source PNG, also used in JSON-LD, RSS `media:content` and `latest-posts.json`. Not cropped to 1200×630: some preview images are panoramic (e.g. 807×344) and would need upscaling.
- [x] Inline Markdown images: `srcset` via `image.layout: 'constrained'`, with `sizes` matching the 800px article column. Post images in `public/` moved to `src/assets` so they're optimized.
- [x] Self-host fonts with Astro's Fonts API (same families and weights, upright only).
- [x] Measure page weight and LCP before and after (headless Chrome, throttled to 150 ms RTT / 1.6 Mbps): Junior Developer Collapse 8.0 MB → 0.4 MB, LCP 39 s → 1.7 s on mobile.
- [x] Preview: hero, inline images and fonts look the same as production; share a post URL in a social preview tool to check the card image.

### PR 4: Security baseline

- [x] Security headers in `netlify.toml`: `frame-ancestors` (header-only CSP directive), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. HSTS is already sent by Netlify.
- [x] CSP via Astro's built-in `security.csp`: a per-page `<meta>` with hashes for Astro's inline scripts and styles. Third-party allowances: Plausible (script, connect), Giscus (script, style, frame), YouTube (frame; switches to nocookie in PR 7), `data:` images (external-link icon). See D13 for style attributes.
- [x] Dependabot for npm and GitHub Actions, weekly, with a 7-day cooldown on new releases (security updates aren't delayed). Actions bumped to v7 and pinned to commit SHAs.
- [x] CI uses `npm ci`, reads the Node version from `.nvmrc`, and runs with read-only repository permissions.
- [x] `npm audit fix` (all findings were build/dev tooling; nothing ships to readers). Build output unchanged.
- [x] No CSP violations in headless Chrome on home, `/posts`, pagination, tags, posts with comments and the YouTube embed, a code block, and RSS, with the theme toggled. Injected inline and unlisted-origin scripts are blocked.
- [x] Preview: same check on the Netlify deploy preview (Netlify's own preview toolbar may log violations there; production doesn't load it), and confirm the headers with `curl -I`.
- [x] **From now on, every PR that adds a third-party origin updates the CSP** (`security.csp` in `astro.config.mjs`).

### PR 5: Sections and landing pages

- [x] Decide on the URL scheme (D11).
- [x] `sections` content collection: one Markdown file per section with `title`, `description`, `links[]`, `itemLabel` (e.g. "Episode" or "Chapter"), `unordered: include | exclude` (default `include`), and the intro as the body. (`hero` deferred; see Later.)
- [x] Posts: optional `section: reference('sections')` and optional `order` (positive integer).
- [x] Landing page: intro, links, the section's posts in sequence order, then (for `unordered: exclude` sections) the remaining posts by date under **Updates**.
- [x] Previous/next navigation within a section (see [Ordering](#ordering-and-previousnext)).
- [x] Section label on post cards and post headers, linking to the landing page. (List cards extracted into `PostListCard.astro` first.)
- [x] Per-section RSS at `/<section>/rss.xml`; the main RSS gains a `<category>` for the section.
- [x] Nav lists only sections with at least one published post. Sections with no posts render a "coming soon" landing page.
- [x] Build fails on: a section slug that clashes with a reserved route, a duplicate `order` within a section, or a section that doesn't exist (handled by `reference()`).
- [x] Migration: Physics of Software post gets `section: physics-of-software`, the tag is removed, and a 301 redirect goes from `/tags/Physics%20of%20Software` to the landing page.
- [x] Moriel: add more tags to the Conservation of Complexity post if wanted (only `Architecture` is left), and set its `order` to its episode number.
- [x] Delivery Engineering section file (ships as "coming soon", out of the nav until it has a post).
- [x] Moriel: review both section intros (drafted by Claude).
- [ ] Moriel: replace the Physics of Software YouTube link with the playlist URL (tracked in Open questions).
- [x] Preview: both landing pages, prev/next links on the Physics of Software post, nav, RSS feeds, and the redirected tag URL.

### PR 6: Reading time

- [x] Calculate the word count at build time and show "N min read" on post cards and post headers (230 words per minute, just below Brysbaert's 2019 meta-analysis average of 238 for non-fiction; plus Medium's image allowance of 12s for the first image down to 3s; link targets and HTML tags aren't counted).

### PR 7: YouTube integration

See [Video embeds](#video-embeds) for how placement works (D15).

- [x] Post frontmatter `video:` (a YouTube URL or ID) adds "Watch on YouTube" and "Subscribe" buttons to the post header and embeds the video at the top of the post body.
- [x] `videoEmbed: false` keeps the buttons but skips the embed (default `true`).
- [x] A bare YouTube URL on its own line in the Markdown becomes a player in place. If it's the frontmatter video, the top embed is dropped.
- [x] Click-to-load player: a thumbnail and play button until clicked, then the `youtube-nocookie.com` player. Works as a plain link without JavaScript.
- [x] Thumbnails downloaded at build time and served from this site (no YouTube request before clicking).
- [x] Replace the raw `<iframe>` in `genai-localization-experiment-intro.md`.
- [x] `VideoObject` JSON-LD on posts with `video`.
- [x] YouTube channel link in the footer.
- [x] Update the CSP: `youtube-nocookie.com` replaces `youtube.com` in `frame-src`.
- [x] Preview: play both videos (Conservation at the top, localization in the body); check mobile tap-to-play.

### PR 8: Performance polish

- [ ] Long-lived caching for `/_astro/*` (hashed filenames): `Cache-Control: public, max-age=31536000, immutable`. Netlify otherwise revalidates every asset on every visit.
- [ ] Post card images: AVIF with WebP fallback, and `sizes` matching the measured rendered widths (the home page loaded ~0.5 MB of card images on mobile).
- [ ] Measure before/after bytes on the home page and `/posts` (same method as PR 3).

### PR 9: Listen, phase 1 (browser speech)

See [Listen (read aloud)](#listen-read-aloud) (D14).

- [ ] **Listen** button in the post header; hidden where `speechSynthesis` isn't available.
- [ ] Reads the title, then the article body one element at a time (paragraphs, headings, list items, quotes), splitting long paragraphs by sentence. Skips code blocks, video players, and screen-reader-only text.
- [ ] Pause cancels and remembers the current element; resume restarts it (native pause is unreliable on Android). Stop resets. Speech stops when leaving the page.
- [ ] Highlights the element being read and scrolls only when it leaves the screen.
- [ ] No CSP change (nothing new is loaded).

### PR 10: Consistent links

- [ ] Footer: RSS opens in the same tab (it's this blog); social links keep a new tab and get the external-link icon and screen-reader text.
- [ ] Header nav stays same-tab, including About and Contact on moriel.tech (D16).
- [ ] Raw HTML `<a>` tags in posts: enable Sätteri's `rawHtml` parsing so the link plugin sees them, if the build output stays otherwise identical; if not, document "use Markdown links in posts" under Conventions instead.

### PR 11: Newsletter (pending decision)

- [ ] Decide provider and placement (see Open questions).

### Later (not yet split into PRs)

- [ ] Real titles for in-body video players: the Markdown plugin is synchronous, so players placed in the body are labeled "Play video" instead of the video title (the top embed and JSON-LD use the real title).
- [ ] Section hero images (`hero` on section files, rendered like the post hero).
- [ ] Pagefind static search.
- [ ] OG image generated per post at build time.
- [ ] MDX for interactive Physics of Software diagrams.
- [ ] Book home page (`layout: book` on the section).
- [ ] Listen, phase 2: audio generated ahead of time with an open-source voice model (Kokoro) for flagship posts. Needs a storage plan first.
- [ ] Listen, phase 3 (optional): Moriel's own recordings for selected posts, in the same player; possibly a podcast feed.
- [ ] Re-evaluate comments (D2) if the audience outgrows Giscus.
- [ ] Section page lists episodes that don't have posts yet (D10).

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
itemLabel: Episode
# unordered: exclude   # used by the book section; the default is include
links:
  - { label: Watch the series, href: https://www.youtube.com/playlist?list=… }
  - { label: Subscribe, href: https://www.youtube.com/@MorielTech }
---
Intro text, in Markdown…
```

---

### Video embeds

```yaml
video: jA82t0UIvhM     # YouTube URL or ID: header buttons + embed
videoEmbed: true       # false: buttons only, no embed
```

- **Default:** the video embeds at the top of the post body.
- **Placed:** paste the YouTube URL on its own line where the video should go. It becomes a player there; if it's the frontmatter video, the top embed is dropped. Works for any video, with or without frontmatter, and a post can embed several.
- **Inline links** (`[text](youtube-url)`) stay links. URLs inside code blocks are ignored.
- **Player:** a thumbnail (downloaded at build time, served from this site) with a play button. Clicking loads `youtube-nocookie.com`, which sets no YouTube cookies until playback. Without JavaScript the thumbnail is a link to YouTube.
- **JSON-LD:** posts with `video` get a `VideoObject` (title from YouTube's oEmbed at build time). It has no `uploadDate`, which Google needs for video rich results; add a `videoDate` field later if that matters.

### Listen (read aloud)

Three free options, used in phases (D14). None needs a paid service.

| Phase | Approach | Pros | Cons |
|---|---|---|---|
| 1 | **Browser speech** (Web Speech API): a "Listen" button hands the article text to the reader's browser | Free, no server or files, no CSP change, small PR | Voice quality depends on the device: good on Safari (Mac/iOS), very good on Edge, decent on Chrome, robotic on Linux and some Android. Edge and Chrome's best voices are cloud voices, so Microsoft or Google receive the text. |
| 2 | **Pre-generated audio** with an open-source model: Kokoro (Apache 2.0) for quality, Piper (MIT) as a lighter fallback | Same good voice for every reader; seeking and speed controls; can feed a podcast | A manual step at publish time (run locally, not in the Netlify build: too slow and heavy); ~5 MB per 10-minute post, so MP3s need storage outside git |
| 3 | **Moriel's own recordings** | Best experience; ties the blog to the YouTube channel | Recording time per post |

**Phase 1 notes:**
- Chrome stops long utterances after about 15 seconds, so feed the text one paragraph at a time; this also makes highlighting the current paragraph straightforward.
- Pause/resume is unreliable on some Android browsers; test there.
- Read only the article body (skip code blocks and image captions, or announce them), and hide the button where speech synthesis isn't available.

**Phase 2 notes:**
- Check Kokoro's state before building; this space changes quickly.
- Decide storage before the first file: e.g. a separate bucket or release assets, not the repo. Any new origin must be added to the CSP (`media-src`).
- Avoid `edge-tts`: it uses Microsoft Edge's voices without an official license.

---

## Conventions

### Code comments

Be concise. Comments explain *why* (the key reasoning); the code shows *how*. No comment is better than a pointless one, because pointless comments bury the information that matters.

### Commits and PRs

- One feature per PR; commits within it are logical steps, each with a message that explains the reason for the change.
- Every PR: CI build passes, the Netlify deploy preview is checked against the PR's checklist, no URL breaks without a redirect, and this roadmap's checkboxes are updated in the same PR.
