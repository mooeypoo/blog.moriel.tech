# Frontmatter reference

Every field a post or section file can use. The schema lives in [`src/content.config.ts`](../src/content.config.ts); the build fails on an unknown section, a duplicate `order`, or an invalid video. Keep this file in sync when a field is added.

## Posts (`src/content/posts/*.md`)

```yaml
---
title: "Conservation of Software Complexity"   # required
date: 2026-06-19                               # required; shown on the post and used for /posts, tags, RSS
description: One or two sentences.             # required; cards, social previews, RSS
tags:
  - Architecture
image: ../../assets/images/posts/hero.png      # hero image
section: physics-of-software                   # one section per post
order: 1                                       # "Episode 1" within the section
video: jA82t0UIvhM                             # YouTube URL or ID
videoEmbed: true
listen: true
---
```

### Required

| Field | What it does |
|---|---|
| `title` | Post title. |
| `date` | Publication date. Shown on the post and used to sort `/posts`, tag pages, and RSS. A post about an old video still uses the date you write it. |
| `description` | Summary for cards, social previews, search results, and RSS. |

### Optional

| Field | Default | What it does |
|---|---|---|
| `tags` | `[]` | Topics across the whole blog; each gets a `/tags/<tag>` page. |
| `draft` | `false` | `true` hides the post everywhere (pages, lists, RSS, audio). |
| `image` | none | Hero image behind the post header. Use a path into `src/assets` so it's optimized. |
| `display` | `image` | A different image for cards and social previews. |
| `section` | none | The post's section, e.g. `physics-of-software` (a file in `src/content/sections`). Adds the section label, prev/next links, and the post to the section page and feed. |
| `order` | none | Number within the section: shown as "Episode 1" / "Chapter 3" and sets the reading order. Never in the URL; must be unique within the section. Without it, the post follows the numbered ones by date. |
| `video` | none | YouTube URL or ID. Adds **Watch on YouTube** and **Subscribe** buttons and embeds the video at the top, unless the post places it itself (a bare YouTube URL on its own line). |
| `videoEmbed` | `true` | `false` keeps the video buttons but skips the embed. |
| `listen` | `true` | `false` removes the Listen player and skips audio generation for the post. |
| `slug` | from filename | Overrides the URL slug. Filenames may start with a date (`2026-06-foo.md`); it's dropped from the URL. |
| `commentsId` | slug | Keeps a post on its existing comment thread if its slug ever changes. |

### In the body

- **Embed a video in place:** paste the YouTube URL on its own line. Inline `[text](url)` links stay links.
- **Links:** links within the blog open in the same tab; external links open a new tab with an icon. Raw HTML `<a>` tags follow the same rule.

## Sections (`src/content/sections/*.md`)

The filename is the section's ID and URL: `physics-of-software.md` → `/physics-of-software`. The body is the intro shown on the landing page.

```yaml
---
title: The Physics of Software
description: Real physics, and what it says about your codebase.
itemLabel: Episode
unordered: include
links:
  - { label: Watch on YouTube, href: https://www.youtube.com/@MorielTech }
---
Intro text, in Markdown…
```

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Section name, used in the nav, labels, and feed. |
| `description` | yes | Shown under the title on the landing page. |
| `itemLabel` | yes | Word for numbered posts: `Episode`, `Chapter`. |
| `unordered` | no (`include`) | `exclude` keeps posts without `order` out of the reading sequence; they're listed under **Updates** instead. |
| `links` | no | Buttons on the landing page. |

A section appears in the nav once it has a published post; until then its page shows "coming soon".
