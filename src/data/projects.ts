/** Public project destinations must be real, secure URLs. */
export type ProjectUrl = `https://${string}`;

export type Project = Readonly<{
  name: string;
  description: string;
  category: string;
  technologies: readonly string[];
  screenshot: Readonly<{
    /** Local file in public/, referenced from the site root. */
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  githubUrl?: ProjectUrl;
  liveUrl?: ProjectUrl;
}>;

// Add only completed, real work. The section stays hidden until data exists.
export const projects: readonly Project[] = [];
