# AGENTS.md

Guidance for AI coding agents working in this repo (Claude Code reads it through `CLAUDE.md`).

blog.moriel.tech is Moriel Schottlender's blog: a static Astro 7 site on Netlify, written in Markdown. Security, performance, and a simple design are the priorities.

## Read first

- [docs/ROADMAP.md](docs/ROADMAP.md): decisions (D1–D18), the PR plan, and conventions. Check the decisions before proposing alternatives; tick its checkboxes in the same PR as the work.
- [docs/FRONTMATTER.md](docs/FRONTMATTER.md): every post and section field. **Update it whenever a field is added or changed.**
- [docs/AUDIO.md](docs/AUDIO.md): how the Listen audio is generated and published.

## Commands

```bash
npm ci && npm run build      # the site; must pass before any PR
npm run dev                  # local dev server (the CSP isn't applied in dev; use build + preview)
npm run audio:install        # the audio generator's own dependencies (~400 MB, not needed for the site)
npm run audio -- <slug>      # generate a post's audio locally (preview only; CI publishes)
npm run audio -- --plan --from https://mooeypoo.github.io/blog.moriel.tech/
```

## Layout

- `src/content/posts/*.md`: posts. `src/content/sections/*.md`: sections (landing page at `/<filename>`).
- `src/content.config.ts`: the schemas. `src/lib/`: shared logic (content, sections, RSS, SEO, speech, YouTube).
- `src/pages/posts/[slug].astro`: the post page (hero, video, Listen player, prev/next, comments).
- `tools/listen-audio/`: the audio generator, a separate package so Netlify builds never install it.
- `.github/workflows/`: `astro-build.yml` (build check + audio heads-up on PRs), `listen-audio.yml` (generates and publishes audio after merges).

## Things that are easy to break

- **The spoken text is shared and hashed.** `src/lib/listen-text.ts` (what's read) and `normalizeForSpeech` in `src/lib/speech.ts` (how it's cleaned) feed the hash every post's audio is tied to. Changing them, or the generator's voice, model revision, bitrate, or pauses, invalidates audio for **every** post: hours of regeneration on CI, with the browser voice in the meantime. Only do it deliberately, and say so in the PR.
- **CSP.** `security.csp` in `astro.config.mjs` lists every allowed origin. Any new third-party script, style, frame, image, media, or fetch origin must be added there, or it's silently blocked in production. Test with `npm run build && npm run preview` (dev mode doesn't apply it). Astro doesn't hash `is:inline` scripts; list their hashes the way `src/lib/theme-init.mjs` does.
- **Post URLs** are `/posts/<slug>`, with the date stripped from the filename. Never change a published slug without a redirect in `public/_redirects`; comment threads are keyed to the slug (`commentsId` pins one).
- **Links.** Markdown and raw HTML links get target/icon handling from a Sätteri plugin; template links follow the same rule by hand (internal: same tab; external: new tab, `external-link` class, screen-reader text). Header nav is the exception (D16).
- **Images** go in `src/assets` (optimized), not `public/`.

## Writing a post

Frontmatter: see [docs/FRONTMATTER.md](docs/FRONTMATTER.md). Audio is generated automatically after merge; `listen: false` opts out. A bare YouTube URL on its own line embeds the video there.

## Conventions

- **Code comments:** concise, explaining *why*; the code shows how. No comment is better than a pointless one.
- **Commits:** logical steps, messages explaining the reason. Every commit should build on its own.
- **PRs:** one feature per PR, production-ready when merged (checked on the Netlify deploy preview). Moriel pushes and opens PRs; agents prepare the branch, commits, and a PR title and description, and don't push or merge.
- **Dependencies and CI:** actions pinned to commit SHAs, exact or locked versions, `npm audit` clean, least-privilege workflow permissions, no long-lived secrets.
