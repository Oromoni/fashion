"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { CiSearch, CiShoppingCart, CiHeart, CiUser } from "react-icons/ci";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const topBar = useRef<HTMLDivElement | null>(null);
  const middleBar = useRef<HTMLDivElement | null>(null);
  const bottomBar = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const linksRef = useRef<HTMLUListElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Animate hamburger
  useEffect(() => {
    if (open) {
      gsap.to(topBar.current, { rotate: 45, y: 8, duration: 0.3 });
      gsap.to(middleBar.current, { opacity: 0, duration: 0.2 });
      gsap.to(bottomBar.current, { rotate: -45, y: -8, duration: 0.3 });
      gsap.to(menuRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(topBar.current, { rotate: 0, y: 0, duration: 0.3 });
      gsap.to(middleBar.current, { opacity: 1, duration: 0.2 });
      gsap.to(bottomBar.current, { rotate: 0, y: 0, duration: 0.3 });
      gsap.to(menuRef.current, { x: "-100%", duration: 0.4, ease: "power2.in" });
    }
  }, [open]);

  // Section-based coloring
  useEffect(() => {
    // ✅ If NOT on homepage sections (like /product/[id]) → force black
    if (!pathname.startsWith("/#") && !pathname === "/") {
      const color = "#000000";
      if (logoRef.current) gsap.set(logoRef.current, { color });
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll("li svg");
        gsap.set(items, { color });
      }
      [topBar.current, middleBar.current, bottomBar.current].forEach((bar) => {
        if (bar) gsap.set(bar, { backgroundColor: color });
      });
      return; // stop observer for product pages
    }

    // Otherwise observe sections
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = entries.reduce(
          (max, entry) => (entry.intersectionRatio > max.intersectionRatio ? entry : max),
          entries[0]
        );
        if (mostVisible) {
          const id = mostVisible.target.id;
          const isHome = id === "section-0";
          const color = isHome ? "#ffffff" : "#000000";

          if (logoRef.current) {
            gsap.to(logoRef.current, { color, duration: 0.4 });
          }
          if (linksRef.current) {
            const items = linksRef.current.querySelectorAll("li svg");
            gsap.to(items, { color, duration: 0.4 });
          }
          [topBar.current, middleBar.current, bottomBar.current].forEach((bar) => {
            if (bar) gsap.to(bar, { backgroundColor: color, duration: 0.4 });
          });
        }
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-transparent"
    >
      {/* Mobile Hamburger */}
      <div
        className="md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer mr-4"
        onClick={() => setOpen(!open)}
      >
        <div ref={topBar} className="h-1 w-full rounded bg-white" />
        <div ref={middleBar} className="h-1 w-full rounded bg-white" />
        <div ref={bottomBar} className="h-1 w-full rounded bg-white" />
      </div>

      {/* Logo */}
      <h1 ref={logoRef} className="text-2xl font-bold ">
        IV
      </h1>

      {/* Desktop Icons */}
      <ul ref={linksRef} className="hidden md:flex space-x-8 text-lg text-white">
        <li className="cursor-pointer"><CiSearch size={25} /></li>
        <li className="cursor-pointer"><CiHeart size={25} /></li>
        <li className="cursor-pointer"><CiUser size={25} /></li>
        <li className="cursor-pointer">
         <Link href={"/cart"}>
          <CiShoppingCart size={25} />
         </Link>
          </li>
      </ul>

      {/* Mobile Fullscreen Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 h-screen w-full bg-black text-white flex flex-col items-center justify-center space-y-8 text-2xl md:hidden"
        style={{ transform: "translateX(-100%)" }}
      >
        <button
          className="absolute top-6 left-6 text-white text-3xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        <a href="#section-0" onClick={() => setOpen(false)}>Home</a>
        <a href="#section-1" onClick={() => setOpen(false)}>About</a>
        <a href="#section-2" onClick={() => setOpen(false)}>Contact</a>
      </div>
    </nav>
  );
}
