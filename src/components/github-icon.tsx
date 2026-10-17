import type { SVGProps } from "react";

/** Brand mark kept locally; Lucide intentionally excludes brand logos. */
export function GithubIcon({
  size = 18,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.12-1.25-5.12-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.55.23 2.69.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.27-5.14 5.55.41.35.77 1.04.77 2.1v3.07c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}
