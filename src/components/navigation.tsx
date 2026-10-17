"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { GithubIcon as Github } from "./github-icon";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./navigation.module.css";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const githubUrl = "https://github.com/sarthaklive9967-ship-it";

function isSectionId(value: string): value is SectionId {
  return sections.some(({ id }) => id === value);
}

function Brand() {
  return (
    <>
      <svg
        className={styles.monogram}
        width="25"
        height="29"
        viewBox="0 0 25 29"
        fill="none"
        aria-hidden="true"
      >
        <path d="M22 3H9L3 9.5L16 14.5L22 20L16 26H3" />
        <path d="M22 3L16 9.5L3 14.5L9 20L3 26" />
      </svg>
      <span className={styles.wordmark}>
        sound<span>.</span>
      </span>
    </>
  );
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string | null>(null);
  const focusFrameRef = useRef<number | null>(null);

  const unlockBody = useCallback(() => {
    if (previousOverflowRef.current !== null) {
      document.body.style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = null;
    }
  }, []);

  const closeNavigation = useCallback(
    (destination?: SectionId) => {
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }

      dialogRef.current?.close();
      unlockBody();
      setIsOpen(false);

      if (destination) {
        setActiveSection(destination);
        focusFrameRef.current = requestAnimationFrame(() => {
          const section = document.getElementById(destination);
          if (!section) return;

          if (!section.hasAttribute("tabindex")) {
            section.setAttribute("tabindex", "-1");
            section.addEventListener(
              "blur",
              () => section.removeAttribute("tabindex"),
              { once: true },
            );
          }

          section.focus({ preventScroll: true });
          focusFrameRef.current = null;
        });
      } else {
        const previousFocus = previousFocusRef.current;
        if (
          previousFocus?.isConnected &&
          previousFocus.getClientRects().length
        ) {
          previousFocus.focus({ preventScroll: true });
        }
      }
    },
    [unlockBody],
  );

  const openNavigation = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    dialog.showModal();
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setIsOpen(true);
    dialog.querySelector<HTMLAnchorElement>('a[href="#home"]')?.focus();
  };

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    let scrollFrame: number | null = null;

    const updatePosition = () => {
      scrollFrame = null;
      setScrolled(window.scrollY > 20);
      if (!targets.length) return;

      let current: SectionId = "home";
      for (const section of targets) {
        if (
          section.getBoundingClientRect().top <= window.innerHeight * 0.38 &&
          isSectionId(section.id)
        ) {
          current = section.id;
        }
      }

      const pageBottom = document.documentElement.scrollHeight;
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= pageBottom - 4
      ) {
        current = "contact";
      }
      setActiveSection(current);
    };

    const scheduleUpdate = () => {
      if (scrollFrame === null) {
        scrollFrame = requestAnimationFrame(updatePosition);
      }
    };

    const updateHash = () => {
      const hash = window.location.hash.slice(1);
      if (isSectionId(hash)) setActiveSection(hash);
    };

    const observer = new IntersectionObserver(scheduleUpdate, {
      rootMargin: "-15% 0px -45% 0px",
      threshold: [0, 0.25, 0.5, 1],
    });
    targets.forEach((section) => observer.observe(section));
    updatePosition();
    updateHash();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", updateHash);

    return () => {
      observer.disconnect();
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => {
      if (desktop.matches && dialogRef.current?.open) {
        closeNavigation();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }
      unlockBody();
    };
  }, [closeNavigation, unlockBody]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#home" className={styles.brand} aria-label="Sound, home">
          <Brand />
          <span className={styles.role}>Developer</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={styles.navLink}
              aria-current={activeSection === id ? "location" : undefined}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          className={styles.github}
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sound on GitHub (opens in a new tab)"
        >
          <Github size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>GitHub</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-label="Open navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={openNavigation}
        >
          <Menu size={23} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className={styles.dialog}
        aria-label="Navigation"
        onCancel={(event) => {
          event.preventDefault();
          closeNavigation();
        }}
        onClose={() => {
          unlockBody();
          setIsOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeNavigation();
        }}
      >
        <div className={styles.dialogContent}>
          <div className={styles.dialogTop}>
            <a
              href="#home"
              className={styles.brand}
              aria-label="Sound, home"
              onClick={() => closeNavigation("home")}
            >
              <Brand />
            </a>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close navigation"
              onClick={() => closeNavigation()}
            >
              <X size={23} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <p className={styles.menuLabel}>Explore</p>
          <nav className={styles.mobileNav} aria-label="Main navigation">
            {sections.map(({ id, label }, index) => (
              <a
                key={id}
                href={`#${id}`}
                className={styles.mobileLink}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => closeNavigation(id)}
              >
                <span className={styles.linkNumber} aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{label}</span>
                <ArrowUpRight size={23} strokeWidth={1.3} aria-hidden="true" />
              </a>
            ))}
          </nav>

          <a
            className={styles.mobileGithub}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={17} strokeWidth={1.6} aria-hidden="true" />
            GitHub
            <span className={styles.srOnly}> (opens in a new tab)</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </header>
  );
}
