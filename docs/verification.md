# Verification — 17 October 2026

Validated in the existing cloud checkout using Node.js 24.19.0, npm 11.9.0, and Chromium 154.0.8037.57. No deployment or repository push was performed.

## Executed checks

- Clean `npm ci --cache /tmp/sound-npm-cache`: passed using `package-lock.json`.
- `npm run lint`: passed with zero warnings or errors.
- `npm run typecheck`: passed. The script generates Next.js route types before TypeScript, so a prior build is unnecessary.
- `npm run build`: passed; homepage, icon, Open Graph image, robots and sitemap were prerendered.
- `npm run start`: production server started successfully. A real HTTP request returned 200 with the expected title and all four navigation sections. Security headers were present.
- `npm test -- --reporter=line` against the production server: **17 passed**.
- `npm audit --omit=dev`: zero known production-dependency vulnerabilities reported at the time of this run.
- Independent source review and viewport sweep from 320–1200px: no blocking findings; production-origin instructions and the documented title were corrected.
- Desktop (1440px) and mobile (390px) screenshots were visually inspected. No application page errors occurred.

## Browser coverage

The tests exercise real content and external destinations, absent projects, active section navigation, mobile menu focus/Escape/resize behavior, 320/390/768/1440px overflow, reduced motion, WebGL denied fallback, actual WebGL rendering, automated WCAG checks, content without JavaScript, keyboard expertise expansion, skip-link focus, metadata assets, and 404 recovery.

Sculpture tests compare actual rendered images for keyboard rotation and static reduced-motion output, check explicit/offscreen/document-hidden pause, deliberately lose the WebGL context, verify the mobile DPR cap, and dispatch actual touch input to confirm vertical scrolling. A separate review also verified horizontal touch rotation.

Accessibility auditing waits for finite reveal animations to finish before measuring final text contrast. The initial production run exposed that timing issue; it was investigated, corrected in the audit synchronization, and the entire suite was rerun successfully.

## Scope and deployment requirements

Browser validation used Chromium on Linux with desktop/mobile emulation and software WebGL. Physical iOS/Android devices and Safari were not tested in this environment.

Set `NEXT_PUBLIC_SITE_URL` to the actual production HTTPS origin and rebuild before deploying. With no domain supplied, the local build emits Next.js's expected metadataBase warning, uses localhost for social-image URLs, and leaves the sitemap empty. The live site's domain, TLS and hosting configuration remain deployment-time checks.

Reusable cloud `install_script` and `start_skill` are saved as a configuration draft. This does not publish the environment or deploy the website.
