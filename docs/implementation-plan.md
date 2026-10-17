# Sound portfolio implementation plan

**Goal:** Deliver the complete working portfolio described in `docs/design.md` and the user's brief.

**Architecture:** Server-rendered editorial content with independent client navigation, reveal and 3D components. Existing cloud checkout; feature branch; no publication.

## Tasks

- [x] Scaffold compatible Next.js/React/TypeScript/Tailwind tooling, install dependencies, and add meaningful browser acceptance tests.
- [x] Build `src/components/navigation.tsx` and its CSS module: active anchors, mobile dialog, focus and Escape handling.
- [x] Build `src/components/sculpture.tsx`, scene and CSS module: local procedural metal sculpture, lazy loading, touch/pointer controls, paused rendering, reduced motion and CSS fallback.
- [x] Build page sections, responsive design, animations, typed content and dormant project renderer. Only confirmed facts and destinations.
- [x] Add SEO, Open Graph image, favicon, error/not-found states and complete README documentation.
- [x] Run lint/type checks/build and browser acceptance tests; inspect screenshots and fix findings.
- [x] Get an independent whole-project review, resolve material findings, and save reusable environment setup/start instructions.

## Component interfaces

- `Navigation(): React.JSX.Element`, default export from `src/components/navigation.tsx`; anchors `home`, `about`, `expertise`, `contact`.
- `Sculpture(): React.JSX.Element`, default export from `src/components/sculpture.tsx`; parent supplies responsive width and height, component fills it.
- `Reveal({children, className?, delay?})`: progressive enhancement with content visible before hydration and reduced motion respected.
- `projects: readonly Project[]` in `src/data/projects.ts`: empty initially; name, description, category, technologies, screenshot with alt text, optional GitHub/live URLs.

## Review focus

1. Touch drag must preserve vertical page scrolling.
2. Mobile menu must work with keyboard, Escape and focus restoration.
3. WebGL denied or context lost must leave a composed fallback and usable content.
4. Reduced motion must stop idle motion without hiding content.
5. Long copy, narrow screens and zoom must not introduce horizontal overflow.

## Execution notes

User explicitly requested a complete implementation, so proceed without additional spec/plan approval gates. Cloud isolation is already provided; no worktree is needed. Separate agents can implement the navigation and sculpture while the main agent owns page composition, shared styles and integration. Do not commit, push or deploy automatically.

## Completion evidence

See `docs/verification.md` for executed commands, browser coverage, and deployment-time requirements. All 17 browser tests pass against the production server. No deployment or push was performed.
