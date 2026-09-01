/* eslint-disable @next/next/no-img-element -- These optimized local assets must remain portable in the static HTML package. */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const posters = [
  {
    src: "/assets/arcbti/arcbti-01-master.jpg",
    alt: "ArcBTI 主视觉，算算你上辈子是哪位建筑大师",
    label: "建筑人格主视觉",
  },
  {
    src: "/assets/arcbti/arcbti-02-draw.jpg",
    alt: "ArcBTI 随机抽取建筑人格的玩法说明",
    label: "用直觉抽一张",
  },
  {
    src: "/assets/arcbti/arcbti-03-personalities.jpg",
    alt: "ArcBTI 十六种建筑人格全员展示",
    label: "16 种建筑人格",
  },
  {
    src: "/assets/arcbti/arcbti-04-modes.jpg",
    alt: "ArcBTI 完整测试与随机抽取两种体验方式",
    label: "两种体验方式",
  },
  {
    src: "/assets/arcbti/arcbti-05-education.jpg",
    alt: "ArcBTI 建筑师、作品与流派科普内容",
    label: "从测试进入建筑科普",
  },
  {
    src: "/assets/arcbti/arcbti-06-share.jpg",
    alt: "ArcBTI 测试结果保存与分享功能",
    label: "保存并分享结果",
  },
] as const;

type DragState = {
  active: boolean;
  pointerId: number;
  startX: number;
  startScrollLeft: number;
};

export default function ArcBtiSideProject() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>(".arcbti-slide"));
    const nearestIndex = slides.reduce((nearest, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - track.scrollLeft);
      const nearestDistance = Math.abs(slides[nearest].offsetLeft - track.scrollLeft);
      return currentDistance < nearestDistance ? index : nearest;
    }, 0);

    setActiveIndex(nearestIndex);
    setCanPrevious(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updatePosition();
    track.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      track.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition]);

  const scrollOneCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstSlide = track.querySelector<HTMLElement>(".arcbti-slide");
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = (firstSlide?.offsetWidth ?? track.clientWidth * 0.72) + gap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    track.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  const endMouseDrag = useCallback((track: HTMLDivElement, pointerId: number) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== pointerId) return;

    dragRef.current.active = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
  }, []);

  return (
    <section
      className="arcbti-side-project"
      id="side-project-arcbti"
      aria-labelledby="arcbti-title"
      data-theme="light"
    >
      <div className="page-shell">
        <div className="arcbti-frame">
          <header className="arcbti-intro">
            <div className="arcbti-heading">
              <p className="arcbti-eyebrow">SIDE PROJECT · ARCHITECTURE</p>
              <img
                className="arcbti-logo"
                src="/assets/arcbti/arcbti-logo.png"
                alt="ArcBTI"
                loading="lazy"
                decoding="async"
              />
              <h2 id="arcbti-title">如果建筑也有 MBTI</h2>
              <p className="arcbti-description">
                一个把人格测试做成建筑科普入口的独立实验。16 种人格特质连接真实建筑师、代表流派与经典作品，让几分钟的选择成为认识建筑美学的起点。
              </p>
            </div>

            <div className="arcbti-guide" aria-label="ArcBTI 体验说明">
              <dl>
                <div>
                  <dt>怎么体验</dt>
                  <dd>完成 18 道题获得建筑人格结果，也可以随手抽一张，从直觉开始。</dd>
                </div>
                <div>
                  <dt>推荐给</dt>
                  <dd>对建筑、城市、设计或人格测试感兴趣的人。</dd>
                </div>
              </dl>
              <a
                className="arcbti-cta"
                href="https://luke20001024.github.io/AIBTI/"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                <span>去测我的建筑人格</span>
                <i aria-hidden="true">↗</i>
              </a>
              <p className="arcbti-signature">建筑爱好者 · 产品经理 · Vibecoder</p>
            </div>
          </header>

          <div className="arcbti-gallery-head">
            <div>
              <span>BUILDING PERSONALITY / 01—06</span>
              <strong>建筑是凝固的音乐。这个小测试，想让轻松的选择成为理解建筑的一扇入口。</strong>
            </div>
            <div className="arcbti-gallery-tools" aria-label="海报浏览控制">
              <output aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} / {String(posters.length).padStart(2, "0")}
              </output>
              <button
                type="button"
                onClick={() => scrollOneCard(-1)}
                disabled={!canPrevious}
                aria-label="查看上一张 ArcBTI 海报"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollOneCard(1)}
                disabled={!canNext}
                aria-label="查看下一张 ArcBTI 海报"
              >
                →
              </button>
            </div>
          </div>

          <div
            className="arcbti-track"
            ref={trackRef}
            tabIndex={0}
            role="listbox"
            aria-orientation="horizontal"
            aria-activedescendant={`arcbti-poster-${activeIndex + 1}`}
            aria-label="ArcBTI 六张产品介绍海报，可横向滑动"
            data-cursor="plain"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollOneCard(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollOneCard(1);
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || event.button !== 0) return;
              const track = event.currentTarget;
              dragRef.current = {
                active: true,
                pointerId: event.pointerId,
                startX: event.clientX,
                startScrollLeft: track.scrollLeft,
              };
              track.setPointerCapture(event.pointerId);
              track.classList.add("is-dragging");
            }}
            onPointerMove={(event) => {
              if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
              event.currentTarget.scrollLeft =
                dragRef.current.startScrollLeft - (event.clientX - dragRef.current.startX);
            }}
            onPointerUp={(event) => endMouseDrag(event.currentTarget, event.pointerId)}
            onPointerCancel={(event) => endMouseDrag(event.currentTarget, event.pointerId)}
          >
            {posters.map((poster, index) => (
              <div
                className="arcbti-slide"
                id={`arcbti-poster-${index + 1}`}
                key={poster.src}
                role="option"
                aria-selected={index === activeIndex}
                aria-posinset={index + 1}
                aria-setsize={posters.length}
              >
                <figure>
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{poster.label}</strong>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
