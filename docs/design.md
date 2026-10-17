# Sound | Developer — design brief

The user has supplied a complete brief and explicitly requested implementation through a working build. Work in the existing cloud checkout; do not deploy or publish.

## Visual direction

A dark, editorial portfolio with an oversized `Sound.` wordmark, generous margins, fine rules, compact monospace labels, and blue accents. A three-part, interlocking brushed-metal sculpture occupies the right side of the hero and becomes a separate composition on mobile. Use geometry and lighting, not image assets or remote HDRIs. Below the hero, an asymmetric introduction leads into four numbered expertise rows with distinctive geometric marks, then a quiet list of confirmed areas and a large contact invitation.

## Content and behavior

Use the user's exact introduction and hero/contact copy. Only the eight confirmed development categories are presented as skills. No age, location, employers, education, statistics, testimonials, projects, or contact methods are invented. The only external destination is the confirmed GitHub profile. Projects remain absent while the typed project data array is empty.

Navigation uses real section anchors, visible current-section state, keyboard focus and a mobile menu with Escape dismissal and focus management. Animations respect reduced motion. The 3D hero supports damped pointer and touch rotation, pauses when offscreen or the document is hidden, caps DPR, and supplies a CSS sculpture while loading or when WebGL fails. Content remains readable without JavaScript.

## Architecture

Next.js App Router, TypeScript, Tailwind CSS, Motion, Lucide, React Three Fiber, Drei and Three.js. Static server-rendered sections form the document; client components own navigation, reveal effects and the lazy 3D scene. Fonts are bundled locally. No backend, database, secret, or external image service is required. Metadata is origin-aware through an optional public site URL; do not invent a deployment domain.

## Verification

Run ESLint, TypeScript and a production build. Use browser tests for desktop and mobile navigation, overflow, anchors, reduced-motion behavior, WebGL fallback, genuine rendered canvas and console errors. Inspect desktop and mobile screenshots. Verify metadata, error handling, and absence of fictional work. Leave deployment to the user.
