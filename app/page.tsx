"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function HoverVideo({ src, title, onShopClick }: { src: string; title: string; onShopClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(true);

  const handleMouseEnter = () => {
    videoRef.current?.play();
    setPaused(false);
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    setPaused(true);
  };

  return (
    <div
      className="relative h-1/2 md:h-full w-full md:w-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video ref={videoRef} src={src} loop muted playsInline className="h-full w-full object-cover" />
      {paused && <div className="absolute inset-0 bg-black/40 transition-opacity duration-300"></div>}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <button
          onClick={onShopClick}
          className="text-lg font-medium relative group"
        >
          Shop Now
          <span className="block h-[2px] bg-white mt-1 origin-left scale-x-100 transition-transform duration-500 ease-in-out group-hover:scale-x-0"></span>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const sections = useRef<HTMLDivElement[]>([]);
  const animating = useRef(false);
  const active = useRef(0);
  const MAX_SECTION = 4;

  // Empty function: Shop Now does nothing
  const handleShopClick = () => {};

  useEffect(() => {
    const secs = sections.current;
    secs.forEach((sec, i) => {
      gsap.set(sec, { yPercent: i === 0 ? 0 : 100, zIndex: i === 0 ? 1 : 0, scale: 1 });
    });

    const showNext = () => {
      if (animating.current || active.current >= MAX_SECTION) return;
      const current = active.current;
      const next = current + 1;
      animating.current = true;

      gsap.set(secs[next], { zIndex: 2 });
      gsap.timeline({
        defaults: { duration: 0.85, ease: "power2.out" },
        onComplete() {
          animating.current = false;
          active.current = next;
        },
      })
      .to(secs[current], { scale: 0.985 }, 0)
      .to(secs[next], { yPercent: 0 }, 0);
    };

    const showPrev = () => {
      if (animating.current || active.current === 0) return;
      const current = active.current;
      const prev = current - 1;
      animating.current = true;

      gsap.set(secs[prev], { zIndex: 2 });
      gsap.timeline({
        defaults: { duration: 0.85, ease: "power2.out" },
        onComplete() {
          animating.current = false;
          active.current = prev;
          gsap.set(secs[current], { zIndex: 0 });
        },
      })
      .to(secs[current], { yPercent: 100 }, 0)
      .to(secs[prev], { scale: 1 }, 0);
    };

    const atBottom = (el: HTMLElement) => el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    const atTop = (el: HTMLElement) => el.scrollTop <= 0;

    const onWheel = (e: WheelEvent) => {
      const sec = secs[active.current];
      if (!sec) return;

      if (e.deltaY > 0 && atBottom(sec)) {
        e.preventDefault();
        showNext();
      } else if (e.deltaY < 0 && atTop(sec)) {
        e.preventDefault();
        showPrev();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const sec = secs[active.current];
      if (!sec) return;

      if (e.key === "ArrowDown" && atBottom(sec)) {
        e.preventDefault();
        showNext();
      } else if (e.key === "ArrowUp" && atTop(sec)) {
        e.preventDefault();
        showPrev();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      gsap.killTweensOf(secs);
    };
  }, []);

  return (
    <main className="w-full h-screen relative overflow-hidden">
      {/* Sections */}
      <section ref={(el) => (sections.current[0] = el!)} className="absolute inset-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col md:flex-row h-screen">
          <HoverVideo src="/video1.mp4" title="Fashion & Accessories" onShopClick={handleShopClick} />
          <HoverVideo src="/video2.mp4" title="Fragrance & Beauty" onShopClick={handleShopClick} />
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <span className="text-6xl font-bold text-white drop-shadow-lg">Crazy</span>
          </div>
        </div>
      </section>

      <section ref={(el) => (sections.current[1] = el!)} className="absolute inset-0 overflow-y-auto scrollbar-hide flex items-center justify-center bg-green-500 text-white text-4xl">
        Section 2
      </section>

      <section ref={(el) => (sections.current[2] = el!)} className="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-start bg-blue-500 text-white text-4xl p-8 space-y-8">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-full max-w-3xl p-8 bg-blue-700 rounded-lg shadow-lg text-white text-2xl text-center">
            Content block {i + 1} - Lorem ipsum dolor sit amet.
          </div>
        ))}
      </section>

      <section ref={(el) => (sections.current[3] = el!)} className="absolute inset-0 overflow-y-auto scrollbar-hide flex items-center justify-center bg-purple-500 text-white text-4xl">
        Section 4
      </section>

      <section ref={(el) => (sections.current[4] = el!)} className="absolute inset-0 overflow-y-auto scrollbar-hide flex items-center justify-center bg-red-500 text-white text-4xl">
        Section 5
      </section>
    </main>
  );
}
