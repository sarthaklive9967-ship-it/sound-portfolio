# Sound | Developer

A responsive developer portfolio with an interactive, procedural 3D sculpture, locally bundled fonts, accessible navigation, and a dark editorial design. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Three Fiber 9, Drei 10, Three.js, Motion, and Lucide.

## Local development

Use Node.js **20.9 or newer** and npm. No API keys, backend, database, or external image service are required.

```sh
npm ci
npm run dev
```

The development server listens on port 3000. Run commands from the repository root. Fonts come from the installed `geist` package and do not require a font service at build or runtime.

```sh
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build     # Production build
npm run start     # Serve the production build on port 3000
npm run test      # Playwright browser acceptance tests
```

For browser tests, install Playwright's Chromium once with `npx playwright install chromium`. Alternatively, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chromium executable. The Playwright configuration manages the test server; see `playwright.config.ts` for its settings.

## Source and customization

- `src/app/page.tsx` contains the portfolio sections; `src/data/site.ts` holds the shared introduction, GitHub destination, expertise, and confirmed areas.
- `src/app/globals.css` defines the color palette, spacing, type scale, and responsive layout. Start here to change the visual theme.
- `src/app/layout.tsx` configures locally bundled fonts and site metadata.
- `src/components/navigation.tsx` manages active sections and the mobile menu.
- `src/components/sculpture.tsx` loads the interactive hero. Its scene and CSS module control geometry, materials, lighting, motion, and the fallback sculpture.
- `src/components/selected-work.tsx` renders real projects when project data is available.
- `src/app/icon.svg` and `src/app/opengraph-image.tsx` provide the favicon and social sharing image.
- `docs/design.md` records the design brief; `docs/implementation-plan.md` records implementation and verification work.

Keep the confirmed skills and contact destination accurate when editing copy. The sculpture uses local geometry and lighting, with a CSS fallback when loading or when WebGL is unavailable. Motion respects the visitor's reduced-motion preference, and the core page content is server rendered.

## Adding real projects

The typed `projects` array in `src/data/projects.ts` is intentionally empty. The selected-work section renders nothing until real projects are added; there are no fictional case studies or placeholder cards.

Add a project's name, description, category, technology list, and screenshot details using the exported `Project` type. Store the real screenshot in `public/images/projects/`; its `src` starts at the site root. For example, `/images/projects/real-name.webp` illustrates the path format only: that file is not included. Supply meaningful screenshot alt text and the image's actual width and height.

Only add `githubUrl` or `liveUrl` when a real public HTTPS destination exists. Omit an unavailable link entirely. The renderer includes only supplied links and uses Next.js image optimization for screenshots. If remote screenshots are required later, configure their specific hosts in Next.js first.

## Metadata and deployment

For phone-friendly deployment instructions, see [Deploy from a phone with Vercel](docs/deploy-vercel.md).

The page title is `Sound | Developer & Digital Creator`. **Before a production deployment, set `NEXT_PUBLIC_SITE_URL` to the site's actual public HTTPS origin and rebuild.** This enables correct canonical, social-image, robots and sitemap URLs. The value is optional for local development; without it, Next.js resolves social images against localhost and the sitemap is empty. No deployed address is assumed. Public environment variables must not contain secrets.

For **Vercel**, import this repository, use its detected Next.js settings, add the production site origin, and deploy through your account. For a **Node.js host**, set the production origin, install dependencies with `npm ci`, run `npm run build`, then run `npm run start` behind the host's HTTPS reverse proxy. Choose a supported Node.js version and configure the host's `PORT` as needed. This project uses Next.js's production server and is not configured as a static export.

Deployment is a separate step. No public deployment is included with this repository.
