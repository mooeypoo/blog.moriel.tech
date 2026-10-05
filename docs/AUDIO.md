# Listen audio

Posts are read aloud by the Listen player. When a post has generated audio (Kokoro, a natural-sounding open-source voice), the player plays it; otherwise it falls back to the reader's browser voice.

## How it works

- **What gets read:** the post title and its article text, cleaned up for speech (quotes and dashes normalized, abbreviations expanded). Code blocks, video players, and screen-reader-only text are skipped. The player, the generator, and CI all use the same extraction (`src/lib/listen-text.ts`).
- **Fingerprint:** the spoken text of each post is hashed (SHA-256). Audio is tied to that hash, so it only plays while the post's spoken text matches what was recorded. Edits that change the text make the player fall back to the browser voice until new audio is published; edits that don't (tags, images, other frontmatter) change nothing.
- **Where audio lives:** this repo's GitHub Pages site, `https://mooeypoo.github.io/blog.moriel.tech/`, deployed by GitHub Actions. It holds one MP3 per post (the hash is in the filename) plus `manifest.json` (hash, voice, duration, and where each paragraph starts, for highlighting and skipping). **Nothing is committed to git:** each run downloads the published audio, adds what's new or changed, and redeploys the whole site. If the site were ever wiped, a full run regenerates everything from the posts.
- **When audio is made:** by the **Listen audio** workflow after every push to `main`, for new posts and posts whose spoken text (or the voice) changed. Audio for removed posts, drafts, and `listen: false` posts is dropped. It can also be run by hand from the Actions tab (**Run workflow**), optionally naming posts to regenerate or `all`.
- **Voice:** Kokoro `af_heart`, an open-source model run on GitHub's machines (no paid service). About 3 minutes per post.
- **Opting out:** `listen: false` in a post's frontmatter removes the player and skips generation.

## Generate locally (preview only)

Publishing always goes through the workflow. To listen to a post's generated audio before merging:

```bash
npm run build
npm run audio:install          # once; installs the generator's own dependencies
npm run audio -- <post-slug>   # writes tools/listen-audio/out/<slug>-<hash>.mp3
```

The first run downloads the voice model (~330 MB) into `tools/listen-audio/.cache`.

## One-time setup

- [x] `blog.moriel.tech` → **Settings → Pages → Source: GitHub Actions**

Optional, later: a custom domain (e.g. `audio.moriel.tech`) needs one DNS `CNAME` record to `mooeypoo.github.io`, the domain set in **Settings → Pages**, and the URL updated in `src/lib/listen-text.ts` and the CSP.
