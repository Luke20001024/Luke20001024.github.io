"use client";

import { useEffect } from "react";

type Preview = {
  id: string;
  src: string | null;
  alt: string;
};

export default function PortfolioMotion({ previews }: { previews: Preview[] }) {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const previewMedia = window.matchMedia("(min-width: 981px) and (hover: hover) and (pointer: fine)");
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger, .reveal-lines"));
    const cleanups: Array<() => void> = [];

    root.classList.add("motion-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("in"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -10%" },
      );
      revealItems.forEach((item) => revealObserver.observe(item));
      cleanups.push(() => revealObserver.disconnect());
    }

    const header = document.querySelector<HTMLElement>(".site-header");
    const rail = document.querySelector<HTMLElement>(".section-rail");
    const cursor = document.querySelector<HTMLElement>(".site-cursor");
    const cursorDot = document.querySelector<HTMLElement>(".site-cursor-dot");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const railLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-rail-target]"));
    let activeSection = "about";

    const setActiveSection = (section: string) => {
      activeSection = section;
      railLinks.forEach((link) => {
        const active = link.dataset.railTarget === section;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    setActiveSection(activeSection);

    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection((entry.target as HTMLElement).dataset.section ?? activeSection);
            }
          });
        },
        { threshold: 0, rootMargin: "-40% 0px -55% 0px" },
      );
      sections.forEach((section) => sectionObserver.observe(section));
      cleanups.push(() => sectionObserver.disconnect());

      const hero = document.querySelector<HTMLElement>("#about");
      if (hero && rail) {
        const heroObserver = new IntersectionObserver(
          ([entry]) => rail.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top < 0),
          { threshold: 0, rootMargin: "-200px 0px 0px" },
        );
        heroObserver.observe(hero);
        cleanups.push(() => heroObserver.disconnect());
      }

      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (footer && rail) {
        const footerObserver = new IntersectionObserver(
          ([entry]) => rail.classList.toggle("is-footer", entry.isIntersecting),
          { threshold: 0, rootMargin: "-12% 0px -25%" },
        );
        footerObserver.observe(footer);
        cleanups.push(() => footerObserver.disconnect());
      }
    }

    const pointIsDark = (x: number, y: number) => {
      const safeX = Math.max(1, Math.min(window.innerWidth - 1, x));
      const safeY = Math.max(1, Math.min(window.innerHeight - 1, y));
      for (const element of document.elementsFromPoint(safeX, safeY)) {
        const themedSurface = element.closest<HTMLElement>("[data-theme]");
        if (themedSurface) return themedSurface.dataset.theme === "dark";
      }
      return false;
    };

    let lastScrollY = Math.max(0, window.scrollY);
    let headerFrame = 0;
    const updateChrome = () => {
      headerFrame = 0;
      const nextScrollY = Math.max(0, window.scrollY);
      const delta = nextScrollY - lastScrollY;

      if (header) {
        header.classList.toggle("is-scrolled", nextScrollY > 96);
        if (reducedMotion || nextScrollY <= 96) {
          header.classList.remove("is-hidden");
        } else if (delta > 2) {
          header.classList.add("is-hidden");
        } else if (delta < -2) {
          header.classList.remove("is-hidden");
        }
        const rect = header.getBoundingClientRect();
        header.classList.toggle("is-dark", pointIsDark(rect.left + rect.width / 2, Math.max(18, rect.top + rect.height / 2)));
      }

      if (rail) {
        const rect = rail.getBoundingClientRect();
        rail.classList.toggle("is-dark", pointIsDark(rect.left + Math.min(18, rect.width / 2), rect.top + rect.height / 2));
      }

      lastScrollY = nextScrollY;
    };
    const requestChromeUpdate = () => {
      if (!headerFrame) headerFrame = window.requestAnimationFrame(updateChrome);
    };
    window.addEventListener("scroll", requestChromeUpdate, { passive: true });
    window.addEventListener("resize", requestChromeUpdate, { passive: true });
    requestChromeUpdate();
    cleanups.push(() => {
      window.removeEventListener("scroll", requestChromeUpdate);
      window.removeEventListener("resize", requestChromeUpdate);
      if (headerFrame) window.cancelAnimationFrame(headerFrame);
    });

    if (finePointer && !reducedMotion && cursor && cursorDot) {
      root.classList.add("cursor-ready");
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let ringX = targetX;
      let ringY = targetY;
      let dotX = targetX;
      let dotY = targetY;
      let cursorFrame = 0;

      const animateCursor = () => {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        dotX += (targetX - dotX) * 0.5;
        dotY += (targetY - dotY) * 0.5;
        cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        cursorFrame = window.requestAnimationFrame(animateCursor);
      };

      const moveCursor = (event: PointerEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursor.classList.add("is-visible");
        cursorDot.classList.add("is-visible");
        const dark = pointIsDark(targetX, targetY);
        cursor.classList.toggle("is-dark", dark);
        cursorDot.classList.toggle("is-dark", dark);
      };
      const hideCursor = () => {
        cursor.classList.remove("is-visible", "is-hover");
        cursorDot.classList.remove("is-visible");
      };
      const handleVisibility = () => {
        if (document.hidden) hideCursor();
      };
      const showHover = () => cursor.classList.add("is-hover");
      const hideHover = () => cursor.classList.remove("is-hover");
      const interactive = Array.from(
        document.querySelectorAll<HTMLElement>("a, button, summary, [data-cursor='hover']"),
      ).filter((element) => element.dataset.cursor !== "plain");
      const plainCursorAreas = Array.from(
        document.querySelectorAll<HTMLElement>("[data-cursor='plain']"),
      );

      window.addEventListener("pointermove", moveCursor, { passive: true });
      document.addEventListener("mouseleave", hideCursor);
      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("blur", hideCursor);
      interactive.forEach((element) => {
        element.addEventListener("pointerenter", showHover);
        element.addEventListener("pointerleave", hideHover);
      });
      plainCursorAreas.forEach((element) => element.addEventListener("pointerenter", hideHover));
      cursorFrame = window.requestAnimationFrame(animateCursor);

      cleanups.push(() => {
        window.cancelAnimationFrame(cursorFrame);
        window.removeEventListener("pointermove", moveCursor);
        document.removeEventListener("mouseleave", hideCursor);
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("blur", hideCursor);
        interactive.forEach((element) => {
          element.removeEventListener("pointerenter", showHover);
          element.removeEventListener("pointerleave", hideHover);
        });
        plainCursorAreas.forEach((element) => element.removeEventListener("pointerenter", hideHover));
        root.classList.remove("cursor-ready");
      });

      const magneticItems = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
      magneticItems.forEach((element) => {
        const moveMagnet = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - (rect.left + rect.width / 2)) * 0.25;
          const y = (event.clientY - (rect.top + rect.height / 2)) * 0.25;
          element.style.translate = `${x}px ${y}px`;
        };
        const resetMagnet = () => {
          element.style.translate = "0px 0px";
        };
        element.addEventListener("pointermove", moveMagnet);
        element.addEventListener("pointerleave", resetMagnet);
        cleanups.push(() => {
          element.removeEventListener("pointermove", moveMagnet);
          element.removeEventListener("pointerleave", resetMagnet);
        });
      });

      const preview = document.querySelector<HTMLElement>(".project-preview");
      const previewTriggers = Array.from(document.querySelectorAll<HTMLElement>(".project-evidence-item[data-project-preview]"));
      if (preview) {
        let previewTargetX = -999;
        let previewTargetY = -999;
        let previewX = previewTargetX;
        let previewY = previewTargetY;
        let previewFrame = 0;

        const animatePreview = () => {
          previewX += (previewTargetX - previewX) * 0.16;
          previewY += (previewTargetY - previewY) * 0.16;
          preview.style.setProperty("--preview-x", `${previewX}px`);
          preview.style.setProperty("--preview-y", `${previewY}px`);
          previewFrame = window.requestAnimationFrame(animatePreview);
        };
        const positionPreview = (event: PointerEvent) => {
          if (!previewMedia.matches) {
            preview.classList.remove("is-on");
            return false;
          }
          const width = preview.offsetWidth;
          const height = preview.offsetHeight;
          const gap = 22;
          const safeTop = 88;
          const x = event.clientX < window.innerWidth / 2
            ? Math.min(event.clientX + gap, window.innerWidth - width - 18)
            : Math.max(18, event.clientX - width - gap);
          const y = Math.max(safeTop, Math.min(event.clientY - height / 2, window.innerHeight - height - 18));
          previewTargetX = x;
          previewTargetY = y;
          return true;
        };
        const enterPreview = (event: PointerEvent) => {
          const trigger = event.currentTarget as HTMLElement;
          const activeId = trigger.dataset.projectPreview;
          preview.dataset.active = activeId ?? "";
          preview.querySelectorAll<HTMLElement>(".project-preview-frame").forEach((frame) => {
            frame.classList.toggle("is-active", frame.dataset.frame === activeId);
          });
          if (!positionPreview(event)) return;
          previewX = previewTargetX;
          previewY = previewTargetY;
          preview.classList.add("is-on");
        };
        const movePreview = (event: PointerEvent) => {
          if (preview.classList.contains("is-on")) positionPreview(event);
        };
        const leavePreview = () => preview.classList.remove("is-on");
        const hidePreviewOnVisibility = () => {
          if (document.hidden) leavePreview();
        };

        previewTriggers.forEach((trigger) => {
          trigger.addEventListener("pointerenter", enterPreview);
          trigger.addEventListener("pointermove", movePreview);
          trigger.addEventListener("pointerleave", leavePreview);
        });
        window.addEventListener("blur", leavePreview);
        window.addEventListener("scroll", leavePreview, { passive: true });
        document.addEventListener("visibilitychange", hidePreviewOnVisibility);
        previewFrame = window.requestAnimationFrame(animatePreview);
        cleanups.push(() => {
          window.cancelAnimationFrame(previewFrame);
          previewTriggers.forEach((trigger) => {
            trigger.removeEventListener("pointerenter", enterPreview);
            trigger.removeEventListener("pointermove", movePreview);
            trigger.removeEventListener("pointerleave", leavePreview);
          });
          window.removeEventListener("blur", leavePreview);
          window.removeEventListener("scroll", leavePreview);
          document.removeEventListener("visibilitychange", hidePreviewOnVisibility);
        });
      }
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      root.classList.remove("motion-ready", "cursor-ready");
    };
  }, []);

  return (
    <>
      <div className="site-cursor" aria-hidden="true" />
      <div className="site-cursor-dot" aria-hidden="true" />
      <div className="project-preview" aria-hidden="true">
        {previews.map((preview) => (
          <figure className="project-preview-frame" data-frame={preview.id} key={preview.id}>
            {preview.id === "aigc" ? (
              <div className="project-preview-aigc-result">
                <div>
                  <small>之前</small>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/search-generic-ad.png" alt="通用狗零食广告" />
                </div>
                <i aria-hidden="true">→</i>
                <div>
                  <small>之后</small>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/search-personalized-ad.png" alt="宠物训练场景广告" />
                </div>
              </div>
            ) : preview.id === "evaluation" ? (
              <div className="project-preview-quality-workflow">
                <small>质量治理闭环</small>
                <div className="project-preview-quality-flow">
                  <article><span>01</span><b>标准定义</b></article>
                  <i aria-hidden="true">→</i>
                  <article><span>02</span><b>事前准入</b></article>
                  <i aria-hidden="true">→</i>
                  <article><span>03</span><b>线上巡检</b></article>
                  <i aria-hidden="true">→</i>
                  <article><span>04</span><b>归因反哺</b></article>
                </div>
                <div className="project-preview-quality-return"><span>问题样本</span><i aria-hidden="true">→</i><b>规则 / 模型 / 策略修改</b><i aria-hidden="true">→</i><strong><em>05</em>重新送评 ↺ 02</strong></div>
              </div>
            ) : preview.src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview.src} alt={preview.alt} />
            ) : null}
          </figure>
        ))}
      </div>
    </>
  );
}
