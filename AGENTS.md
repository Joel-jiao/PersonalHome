# AGENTS.md

## Project Overview
Vue 3 + Vite + Pinia + Vue Router personal portfolio website. Features a reactive profile store backed by localStorage, dark/light theme toggle, and reusable form components.

## Tech Stack
- **Vue 3** (`^3.5.40`) with `<script setup>` SFC syntax
- **Pinia** (`^4.0.3`) for state management
- **Vue Router** (`^5.3.1`) with `createWebHistory`
- **Vite** (`^8.1.5`) as build tool
- **ES Modules** (`"type": "module"`)
- **Node.js** `^22.18.0 || >=24.12.0`

## Key Commands
- `npm run dev` — Start dev server with HMR
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm install` — Install dependencies

## Project Structure
```
src/
├── assets/global.css      # CSS custom properties for light/dark themes
├── componets/             # Reusable Vue components (folder name is misspelled - keep as-is)
│   ├── GlobalHeader.vue
│   ├── SiteFooter.vue
│   └── FormField.vue
├── router/routes.js       # Vue Router config (two routes: / and /home)
├── store/home.js          # Pinia store for all profile data
├── views/
│   ├── Home.vue           # Simple placeholder page
│   └── PersonalHome.vue   # Full portfolio page
├── App.vue                # Root component (header + router-view + footer)
└── main.js                # Entry point
```

## Architecture Conventions

### State Management
- All profile data lives in `src/store/home.js` as a single Pinia store (`useHomeStore`)
- The store's `info` ref is auto-persisted to `localStorage` via a `watch` with `{ deep: true }`
- Actions for mutations: `addSkill`, `removeSkill`, `addProject`, `removeProject`
- Components access state via `storeToRefs(useHomeStore())` for reactivity

### Routing
- Two routes defined in `src/router/routes.js`: `/` → `Home.vue`, `/home` → `PersonalHome.vue`
- `App.vue` wraps all pages with `GlobalHeader` and `SiteFooter`

### Components
- Use `<script setup>` syntax in all SFCs
- `FormField.vue` uses `defineModel()` for two-way binding
- Path alias `@` maps to `/src` (configured in both `vite.config.js` and `jsconfig.json`)
- **Note**: The components folder is named `componets` (typo) — keep this spelling to avoid breaking imports

### Theming
- CSS variables defined in `src/assets/global.css` using `[data-theme="dark"]` selector
- Theme toggle in `PersonalHome.vue` persists preference to `localStorage` and detects system preference

### Data Model (`info` object in store)
```js
{ name, grade, bio, email, github, skills: [], projects: [] }
```
Each project: `{ title, desc }`

## Coding Guidelines
- Use `@/` alias for imports from `src/`
- Use `storeToRefs` when destructuring store state to preserve reactivity
- Always trim input strings before validation in actions
- Keep all data mutations in the Pinia store — never mutate state directly in components
- Add new skills/projects through store actions (`addSkill`, `addProject`)

## IDE Setup
- VS Code: Install **Vue.volar** extension (disable Vetur)
- Enable file nesting in VS Code Explorer (configured in `.vscode/settings.json`)
- JetBrains: `.idea/` config is pre-setup

## Important Notes
- The `componets` folder name has a typo — do NOT rename it without updating all imports
- localStorage key is `homeInfo`
- Theme attribute is set on `<html>` as `data-theme`
