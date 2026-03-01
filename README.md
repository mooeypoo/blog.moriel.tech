# blog.moriel.tech

Static blog built with Nuxt 3, Vuetify, and Nuxt Content. JavaScript only (no TypeScript).

## Commands

- **`npm run dev`** — Start the development server (e.g. http://localhost:3000).
- **`npm run build`** — Build the application.
- **`npm run generate`** — Generate static site for deployment (output in `.output/public`).

For Netlify (or other static hosting), use **build command**: `npm run generate`, and **publish directory**: `.output/public`.

## Project note

This project is **JavaScript-only**: no `tsconfig`, no `*.ts` source files, no `lang="ts"` in Vue components.
