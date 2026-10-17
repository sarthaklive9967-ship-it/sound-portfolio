import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { GithubIcon as Github } from "@/components/github-icon";
import Navigation from "@/components/navigation";
import Sculpture from "@/components/sculpture";
import { Expertise } from "@/components/expertise";
import { Reveal } from "@/components/reveal";
import { SelectedWork } from "@/components/selected-work";
import { confirmedAreas, site } from "@/data/site";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <section
          id="home"
          className="hero section-shell"
          aria-labelledby="hero-heading"
        >
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span className="label-dash" />
                INDEPENDENT DEVELOPER &amp; DIGITAL CREATOR
              </p>
              <h1 id="hero-heading" className="hero-wordmark">
                Sound<span>.</span>
              </h1>
              <div className="hero-introduction">
                <h2>
                  Building digital experiences
                  <br className="desktop-break" />{" "}
                  <span>that feel different.</span>
                </h2>
                <p>{site.description}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#expertise">
                    Explore My Expertise
                    <ArrowDown size={17} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                  <a
                    className="text-link hero-github"
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} strokeWidth={1.5} aria-hidden="true" />
                    Connect on GitHub
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div
                className="sculpture-corner sculpture-corner--tl"
                aria-hidden="true"
              />
              <div
                className="sculpture-corner sculpture-corner--br"
                aria-hidden="true"
              />
              <div className="sculpture-stage">
                <Sculpture />
              </div>
              <div className="sculpture-caption" aria-hidden="true">
                <span>FIG. 01</span>
                <span>
                  THE INTERSECTION OF
                  <br />
                  FORM &amp; FUNCTION
                </span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              DEVELOPMENT <span className="hero-times">×</span> DESIGN
            </span>
            <a href="#about" className="scroll-cue">
              <span className="scroll-line" aria-hidden="true" />
              SCROLL TO EXPLORE
              <ArrowDown size={13} strokeWidth={1.4} aria-hidden="true" />
            </a>
            <span className="hero-bottom-index">
              A PERSONAL PORTFOLIO / 2026
            </span>
          </div>
        </section>

        <section
          id="about"
          className="about section-shell"
          aria-labelledby="about-heading"
        >
          <div className="section-topline">
            <span className="eyebrow">01 / ABOUT</span>
            <span className="section-note">THE PERSON BEHIND THE PIXELS</span>
          </div>
          <div className="about-grid">
            <Reveal>
              <h2 id="about-heading">
                A curious mind.
                <br />A builder at <span className="serif-accent">heart.</span>
              </h2>
              <div className="about-signature" aria-hidden="true">
                <span className="signature-line" />
                <span>Sound.</span>
              </div>
            </Reveal>
            <Reveal className="about-copy" delay={0.1}>
              <p>{site.introduction}</p>
              <div className="about-identity">
                <span className="identity-mark" aria-hidden="true">
                  s<span>.</span>
                </span>
                <div>
                  <h3>Sound | Developer</h3>
                  <span>Developer &amp; Digital Creator</span>
                </div>
                <ArrowUpRight size={22} strokeWidth={1} aria-hidden="true" />
              </div>
            </Reveal>
          </div>
        </section>

        <Expertise />
        <SelectedWork />

        <section
          className="focus-section section-shell"
          aria-labelledby="focus-heading"
        >
          <Reveal className="focus-grid">
            <div>
              <span className="eyebrow">MY CREATIVE TOOLKIT</span>
              <h2 id="focus-heading">
                The things
                <br />I work on<span className="accent">.</span>
              </h2>
            </div>
            <div className="focus-content">
              <p>Different spaces. Plenty of possibilities.</p>
              <ul className="focus-list">
                {confirmedAreas.map((area) => (
                  <li key={area}>
                    <span aria-hidden="true">↗</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section
          id="contact"
          className="contact section-shell"
          aria-labelledby="contact-heading"
        >
          <div className="section-topline">
            <span className="eyebrow">03 / LET’S CONNECT</span>
            <Asterisk
              className="contact-star"
              size={43}
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>
          <Reveal>
            <h2 id="contact-heading">
              Have something
              <br />
              <span className="serif-accent">interesting</span> in mind?
            </h2>
            <div className="contact-bottom">
              <p>Let&apos;s turn ideas into experiences worth building.</p>
              <a
                href={site.github}
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Connect on GitHub</span>
                <span className="contact-link-icon">
                  <ArrowUpRight
                    size={28}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="footer section-shell">
        <p>© 2026 Sound | Developer</p>
        <span className="footer-note">
          THOUGHTFULLY DESIGNED. CAREFULLY BUILT.
        </span>
        <a href="#home">
          Back to top
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}
