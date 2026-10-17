import { ArrowUpRight } from "lucide-react";
import { expertise } from "@/data/site";
import { Reveal } from "@/components/reveal";

function ExpertiseMark({ kind }: { kind: string }) {
  return (
    <span
      className={`expertise-mark expertise-mark--${kind}`}
      aria-hidden="true"
    >
      {kind === "web" && (
        <>
          <span className="web-frame">
            <i />
            <i />
            <i />
            <b />
            <em />
          </span>
          <span className="web-cursor" />
        </>
      )}
      {kind === "design" && (
        <>
          <span className="design-square" />
          <span className="design-circle" />
          <span className="design-cross" />
        </>
      )}
      {kind === "minecraft" && (
        <>
          <span className="voxel voxel--one" />
          <span className="voxel voxel--two" />
          <span className="voxel voxel--three" />
        </>
      )}
      {kind === "discord" && (
        <>
          <span className="chat chat--back" />
          <span className="chat chat--front">
            <i />
            <i />
            <i />
          </span>
        </>
      )}
    </span>
  );
}

export function Expertise() {
  return (
    <section
      id="expertise"
      className="expertise section-shell"
      aria-labelledby="expertise-heading"
    >
      <div className="section-topline">
        <span className="eyebrow">02 / EXPERTISE</span>
        <span className="section-note">A FEW WAYS I CREATE</span>
      </div>
      <Reveal className="section-heading expertise-heading">
        <h2 id="expertise-heading">
          Different disciplines.
          <br />
          <span className="muted">The same attention to detail.</span>
        </h2>
        <p>
          From the first idea to the final interaction,
          <br className="desktop-break" /> I care about how it works. And how it
          feels.
        </p>
      </Reveal>
      <div className="expertise-list">
        {expertise.map((area, index) => (
          <Reveal key={area.number} delay={index * 0.045}>
            <details className={`expertise-row expertise-row--${area.visual}`}>
              <summary>
                <span className="expertise-number">{area.number}</span>
                <ExpertiseMark kind={area.visual} />
                <span className="expertise-title">
                  <h3>{area.title}</h3>
                  <span className="expertise-mobile-description">
                    {area.description}
                  </span>
                </span>
                <span className="expertise-description">
                  {area.description}
                </span>
                <span className="expertise-arrow">
                  <ArrowUpRight
                    size={23}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Explore {area.title}</span>
                </span>
              </summary>
              <div className="expertise-expanded">
                <span className="eyebrow">AREAS OF FOCUS</span>
                <ul>
                  {area.areas.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
      <p className="expertise-footnote">
        <span className="tiny-cross" aria-hidden="true">
          +
        </span>{" "}
        A creative approach. A considered result.
      </p>
    </section>
  );
}
