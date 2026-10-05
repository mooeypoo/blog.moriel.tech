# Listen audio

Posts are read aloud by the Listen player. When a post has generated audio (Kokoro, a natural-sounding open-source voice), the player plays it; otherwise it falls back to the reader's browser voice.

## How it works

- **What gets read:** the post title and its article text, cleaned up for speech (quotes and dashes normalized, abbreviations expanded). Code blocks, video players, and screen-reader-only text are skipped. The player, the generator, and CI all use the same extraction (`src/lib/listen-text.ts`).
- **Fingerprint:** the spoken text of each post is hashed (SHA-256). Audio is tied to that hash, so it only plays while the post's spoken text matches what was recorded. Edits that change the text make the player fall back to the browser voice until new audio is published; edits that don't (tags, images, other frontmatter) change nothing.
- **Per paragraph:** each paragraph's audio is stored separately (`segments/`), named by a hash of everything that affects its sound (text, voice, model, bitrate, pause). A post's MP3 is its paragraphs joined, so **an edit only regenerates the paragraphs it changed**: a typo fix takes seconds, not a whole post. Changing the voice or model regenerates everything.
- **Where audio lives:** this repo's GitHub Pages site, `https://mooeypoo.github.io/blog.moriel.tech/`, deployed by GitHub Actions. It holds one MP3 per post (the hash is in the filename), the paragraph segments, and `manifest.json` (hash, voice, duration, where each paragraph starts, and its segments). **Nothing is committed to git:** each run downloads the published segments, generates only missing ones, rebuilds every post's MP3, and redeploys the whole site. If the site were ever wiped, a full run regenerates everything from the posts.
- **When audio is made:** by the **Listen audio** workflow after every push to `main`, for new paragraphs and paragraphs whose text changed: about 35 seconds per paragraph on GitHub's runners (a typical new post, 40–100 paragraphs, takes 25–60 minutes; a typo fix, seconds). Runs queue rather than overlap. Generated paragraphs are cached even when a run fails or times out, so the next run resumes instead of starting over.
- **Heads-up on PRs:** the build check's summary lists which posts' audio will be generated after merge, with a time estimate. Audio for removed posts, drafts, and `listen: false` posts is dropped. It can also be run by hand from the Actions tab (**Run workflow**), optionally naming posts to regenerate or `all`.
- **Voice:** Kokoro `af_heart`, an open-source model run on GitHub's machines (no paid service).
- **Opting out:** `listen: false` in a post's frontmatter removes the player and skips generation.

## Generate locally (preview only)

Publishing always goes through the workflow. To listen to a post's generated audio before merging:

```bash
npm run build
npm run audio:install          # once; installs the generator's own dependencies
npm run audio -- <post-slug>   # writes tools/listen-audio/out/<slug>-<hash>.mp3; reruns reuse unchanged paragraphs
npm run audio -- --plan --from https://mooeypoo.github.io/blog.moriel.tech/
                               # lists what the workflow would generate or remove
```

The first run downloads the voice model (~330 MB) into `tools/listen-audio/.cache`.

## One-time setup

- [x] `blog.moriel.tech` → **Settings → Pages → Source: GitHub Actions**

Optional, later: a custom domain (e.g. `audio.moriel.tech`) needs one DNS `CNAME` record to `mooeypoo.github.io`, the domain set in **Settings → Pages**, and the URL updated in `src/lib/listen-text.ts` and the CSP.
