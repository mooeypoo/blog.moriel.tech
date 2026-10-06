import { createHash } from 'node:crypto'

// Inlined at the top of <head> so the saved theme is set before the first paint; waiting for the
// header to hydrate showed dark first. Its CSP hash is derived here so the two can't drift apart.
// Kept tiny since it blocks parsing; try/catch because storage access can throw (privacy settings).
export const themeInitScript =
  "try{var t=localStorage.getItem('theme-dark');if(t===null?!matchMedia('(prefers-color-scheme: dark)').matches:t==='false')document.documentElement.classList.add('light-theme')}catch(e){}"

export const themeInitHash = /** @type {`sha256-${string}`} */ (
  `sha256-${createHash('sha256').update(themeInitScript).digest('base64')}`
)
