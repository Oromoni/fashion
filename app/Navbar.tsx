"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const topBar = useRef<HTMLDivElement>(null);
  const middleBar = useRef<HTMLDivElement>(null);
  const bottomBar = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Animate bars into an X
      gsap.to(topBar.current, { rotate: 45, y: 8, backgroundColor: "white", duration: 0.3 });
      gsap.to(middleBar.current, { opacity: 0, duration: 0.2 });
      gsap.to(bottomBar.current, { rotate: -45, y: -8, backgroundColor: "white", duration: 0.3 });
      // Slide full-screen menu in
      gsap.to(menuRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
    } else {
      // Reset bars
      gsap.to(topBar.current, { rotate: 0, y: 0, backgroundColor: "white", duration: 0.3 });
      gsap.to(middleBar.current, { opacity: 1, duration: 0.2 });
      gsap.to(bottomBar.current, { rotate: 0, y: 0, backgroundColor: "white", duration: 0.3 });
      // Slide menu out
      gsap.to(menuRef.current, { x: "-100%", duration: 0.4, ease: "power2.in" });
    }
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent text-white">
      {/* Mobile Hamburger (left side) */}
      <div
        className="md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer mr-4"
        onClick={() => setOpen(!open)}
      >
        <div ref={topBar} className="h-1 w-full bg-white rounded"></div>
        <div ref={middleBar} className="h-1 w-full bg-white rounded"></div>
        <div ref={bottomBar} className="h-1 w-full bg-white rounded"></div>
      </div>

      {/* Logo */}
      <h1 className="text-2xl font-bold">MyApp</h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-lg">
        <li className="cursor-pointer hover:underline">Home</li>
        <li className="cursor-pointer hover:underline">About</li>
        <li className="cursor-pointer hover:underline">Contact</li>
      </ul>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 h-screen w-full bg-black text-white flex flex-col items-center justify-center space-y-8 text-2xl md:hidden"
        style={{ transform: "translateX(-100%)" }}
      >
        {/* Close Button (X) */}
        <button
          className="absolute top-6 left-6 text-white text-3xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        {/* Menu Links */}
        <a href="#" onClick={() => setOpen(false)}>
          Home
        </a>
        <a href="#" onClick={() => setOpen(false)}>
          About
        </a>
        <a href="#" onClick={() => setOpen(false)}>
          Contact
        </a>
      </div>
    </nav>
  );
}
