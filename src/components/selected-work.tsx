import Image from "next/image";
import { projects } from "@/data/projects";

export function SelectedWork() {
  if (projects.length === 0) return null;

  return (
    <section
      className="selected-work section-shell"
      id="selected-work"
      aria-labelledby="selected-work-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">Selected work</p>
        <h2 id="selected-work-heading">Ideas made real.</h2>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-image">
              <Image
                src={project.screenshot.src}
                alt={project.screenshot.alt}
                width={project.screenshot.width}
                height={project.screenshot.height}
                sizes="(max-width: 720px) 100vw, 50vw"
              />
            </div>
            <div className="project-details">
              <p className="eyebrow">{project.category}</p>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul
                className="project-technologies"
                aria-label={`${project.name} technologies`}
              >
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
              {(project.githubUrl || project.liveUrl) && (
                <div className="project-links">
                  {project.githubUrl && (
                    <a
                      className="text-link"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name} on GitHub (opens in a new tab)`}
                    >
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      className="text-link"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.name} (opens in a new tab)`}
                    >
                      Live site <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
