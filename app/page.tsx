"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { data } from "./data";
import Image from "next/image";
import Link from "next/link";
import { CiSliderHorizontal } from "react-icons/ci";
import { IoIosArrowRoundDown } from "react-icons/io";
import {
  FaTiktok,
  FaInstagram,
  FaFacebook,
  FaSnapchatGhost,
  FaTwitter,
} from "react-icons/fa";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";




function HoverVideo({
  src,
  title,
  onShopClick,
}: {
  src: string;
  title: string;
  onShopClick: () => void;
}) {
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
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      {paused && (
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" />
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <button onClick={onShopClick} className="text-sm font-medium relative group">
          Shop Now
          <span className="block h-[2px] bg-white origin-left scale-x-100 rounded-full transition-transform duration-500 ease-in-out group-hover:scale-x-0" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const sections = useRef<(HTMLDivElement | null)[]>([]);
  const animating = useRef(false);
  const active = useRef(0);
  const MAX_SECTION = 5;

  // curtain refs
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // dropdown & showMore states
  //const [newDropdown, setNewDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [contrast, setContrast] = useState(false);

  const handleShopClick = () => {};

  // --- Section scrolling ---
  useEffect(() => {
    const secs = sections.current;

    secs.forEach((sec, i) => {
      if (!sec) return;
      gsap.set(sec, {
        yPercent: i === 0 ? 0 : 100,
        zIndex: i === 0 ? 1 : 0,
        scale: 1,
      });
    });

    const showNext = () => {
      if (animating.current || active.current >= MAX_SECTION - 1) return;
      const current = active.current;
      const next = current + 1;
      if (!secs[next]) return;

      animating.current = true;
      gsap.set(secs[next], { zIndex: 2 });

      gsap
        .timeline({
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
      if (!secs[prev]) return;

      animating.current = true;
      gsap.set(secs[prev], { zIndex: 2 });

      gsap
        .timeline({
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

  // --- Curtain animation for image ---
  useEffect(() => {
    const container = curtainRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    container.style.width = "12px";
    container.style.borderRadius = "1rem";
    container.style.overflow = "hidden";

    gsap.set(img, { filter: "blur(20px)" });

    const tl = gsap.timeline({ paused: true });
    tl.to(container, { duration: 0.8 })
      .to(container, { width: "90%", duration: 3, ease: "power2.out" })
      .to(img, { filter: "blur(0px)", duration: 1.5, ease: "power2.out" }, "-=2.2");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tl.play();
          else tl.reverse();
        });
      },
      { threshold: 0.45 }
    );

    io.observe(container);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  // --- Curtain animation for video ---
  useEffect(() => {
    const video = document.getElementById("bgvid") as HTMLVideoElement | null;
    const container = video?.parentElement;
    if (!video || !container) return;

    container.style.width = "12px";
    container.style.borderRadius = "1.5rem";
    container.style.overflow = "hidden";

    gsap.set(video, { filter: "blur(20px)" });

    const tl = gsap.timeline({ paused: true });
    tl.to(container, { duration: 0.8 }) // optional start delay
      .to(container, { width: "100%", duration: 3, ease: "power2.out" })
      .to(video, { filter: "blur(0px)", duration: 1.5, ease: "power2.out" }, "-=2.2");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tl.play();
          else tl.reverse();
        });
      },
      { threshold: 0.45 }
    );

    if (container) io.observe(container);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  // --- Navbar color switcher ---
  useEffect(() => {
    const secs = sections.current;

    const io = new IntersectionObserver(
      (entries) => {
        let activeFound = false;

        entries.forEach((entry) => {
          const index = secs.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && !activeFound) {
            activeFound = true;
            const textColor = index === 0 ? "#ffffff" : "#000000";
            window.dispatchEvent(
              new CustomEvent("activeSectionChange", { detail: { id: `section-${index}`, textColor } })
            );
          }
        });

        if (!activeFound) {
          window.dispatchEvent(
            new CustomEvent("activeSectionChange", { detail: { id: `section-0`, textColor: "#ffffff" } })
          );
        }
      },
      { threshold: 0.45 }
    );

    secs.forEach((sec) => sec && io.observe(sec));

    return () => io.disconnect();
  }, []);

  return (
    <main className="w-full h-screen relative overflow-hidden">
      {/* Section 1 */}
      <section
        id="section-0"
         ref={(el) => {sections.current[0] = el as HTMLDivElement;
  }}
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
      >
        <div className="flex flex-col md:flex-row h-screen">
          <HoverVideo src="/video1.mp4" title="Fashion & Accessories" onShopClick={handleShopClick} />
          <HoverVideo src="/video2.mp4" title="Fragrance & Beauty" onShopClick={handleShopClick} />
        </div>
      </section>

      {/* Section 2 - Curtain */}
      <section
        id="section-1"
         ref={(el) => {
    sections.current[1] = el as HTMLDivElement;
  }}
        className="absolute inset-0 overflow-y-auto scrollbar-hide flex items-center justify-center bg-white"
      >
        <div
          ref={curtainRef}
          className="relative w-[90%] mt-8.5 max-w-[1000px] h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] mx-auto rounded-2xl overflow-hidden"
          style={{ willChange: "width" }}
        >
          <img
            ref={imgRef}
            src="/fnd.avif"
            alt="fnd"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* Section 3 - Product Listing */}
      <section
        id="section-2"
        ref={(el) => {
    sections.current[2] = el as HTMLDivElement;;
  }}
        className="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-start bg-white p-0 space-y-8"
      >
        {/* Top Buttons */}
        <div className="w-full flex sm:flex-row justify-between items-center mb-6 gap-4 px-4 sm:px-8 mt-14">
          <div className="relative">
            <button
              onClick={() => setFilterDropdown(!filterDropdown)}
              className="flex items-center text-xs gap-2 px-4 py-2 bg-white ease-in-out duration-75 translate-0.5 hover:bg-black hover:text-white border-1 border-black/20 text-black rounded-md"
            >
               New In <IoIosArrowRoundDown size={15}/>
            </button>
            {filterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white text-xs text-black/80 rounded-md shadow-lg z-10">
                <ul className="flex flex-col p-2">
                  <li className="p-2 hover:bg-black hover:text-white hover:rounded-sm cursor-pointer">Autumn Collection</li>
                  <li className="p-2 hover:bg-black  hover:text-white hover:rounded-sm cursor-pointer">Fall Collection</li>
                  
                </ul>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-xs bg-white hover:bg-black hover:text-white border-1  border-black/20 text-black rounded-md">
             Filter <CiSliderHorizontal size={15}/>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full gap-2">
          {data.slice(0, showAll ? data.length : 12).map((product, i) => (
            <Link
              href={`/product/${product.id}`}
              key={i}
              className="w-full bg-white/5 overflow-hidden flex flex-col items-center justify-start text-center rounded-lg"
            >
              <div className="w-full h-60 relative overflow-hidden group">
                <Image
                  src={product?.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain object-center transition-transform bg-black-300 duration-500 group-hover:scale-105"
                />
              </div>

              <div className="w-full text-left p-2">
                <div className="ml-6">
                  <p className="text-xs text-black">New</p>
                  <h3 className="text-xs text-black mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600">$ {product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 px-6 py-3 rounded-3xl border bg-white text-black"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>

        {/* Video with Curtain Reveal */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-5xl h-96 sm:h-[30rem] md:h-[30rem] lg:h-[30rem] mx-auto rounded-3xl overflow-hidden">
            <video
              src="/bg2.mp4"
              loop
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-3xl"
              id="bgvid"
            />
          </div>
        </div>

        <div className="h-20"></div>
      </section>

      {/* Section 4 */}
    

   
    
<section
  id="section-3"
   ref={(el) => {
    sections.current[3] = el as HTMLDivElement;;
  }}
  className="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-start bg-white text-gray-900 p-8"
>
  {/* Heading */}
  <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Features</h2>

  {/* Card Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
    {/* Card 1 */}
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-10/12 md:w-full mx-auto">
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/run1.jpg"
          alt="Card 1"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-black/60 to-transparent p-5">
        <p className="text-white text-lg font-semibold">Card One</p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-10/12 md:w-full mx-auto">
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/run2.jpg"
          alt="Card 2"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-black/60 to-transparent p-5">
        <p className="text-white text-lg font-semibold">Card Two</p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-10/12 md:w-full mx-auto">
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/run3.jpg"
          alt="Card 3"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-black/60 to-transparent p-5">
        <p className="text-white text-lg font-semibold">Card Three</p>
      </div>
    </div>
  </div>
</section>

      {/* Section 5 */}
      <section
        id="section-4"
         ref={(el) => {
    sections.current[4] = el as HTMLDivElement;
  }}
        className="absolute inset-0 overflow-y-auto scrollbar-hide flex items-center justify-center bg-white text-white text-4xl"
      >
            <div
      className={`min-h-[90%] bg-black text-white rounded-3xl mt-6 flex items-stretch font-sans ${
        contrast ? "filter contrast-125" : ""
      }`}
    >
     <section className="px-6 py-12">
      <div
        className={`w-full bg-black text-white rounded-2xl shadow-lg overflow-hidden ${
          contrast ? "filter contrast-125" : ""
        }`}
      >
        {/* Top - Accessibility toggle */}
        <header className="px-6 pt-6">
          <div className="flex items-center">
            <span className="mr-4 text-sm opacity-80">
              Accessibility: Better contrast
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={contrast}
                onChange={() => setContrast(!contrast)}
                className="sr-only"
                aria-label="Better contrast"
              />
              <div
                className={`w-12 h-7 rounded-full transition-colors ${
                  contrast ? "bg-white" : "bg-gray-600"
                }`}
              />
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  contrast ? "translate-x-5" : ""
                }`}
              />
            </label>
          </div>
        </header>

        {/* Main columns */}
        <main className="px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-12">
            {/* Column 1 */}
            <div>
              <h3 className="font-serif font-light text-lg mb-4">
                Find a boutique
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Parfums Christian Dior Boutiques
                    <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#">Christian Dior Couture Boutiques</a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-serif font-light text-lg mb-4">
                Client Services
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Contact us <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Delivery &amp; Returns <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    FAQ <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#">Receive My Invoice</a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-serif font-light text-lg mb-4">
                Maison Dior
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Dior Sustainability <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#">Ethics &amp; Compliance</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="font-serif font-light text-lg mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Legal Terms <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    Privacy Policy <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-2">
                    General Sales Conditions <FiChevronDown className="opacity-70" />
                  </a>
                </li>
                <li>
                  <a href="#">Cookie Management</a>
                </li>
                <li>
                  <a href="#">Sitemap <FiChevronDown className="opacity-70" /></a>
                </li>
              </ul>
            </div>
          </div>
        </main>

        {/* Bottom bar */}
        <footer className="border-t border-gray-700 px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-5">
              <a href="#"><FaTiktok size={20} /></a>
              <a href="#"><FaInstagram size={20} /></a>
              <a href="#"><FaTwitter size={20} /></a>
              <a href="#"><FaFacebook size={20} /></a>
              <a href="#"><FaSnapchatGhost size={20} /></a>
            </div>

            {/* Logo */}
            <div className="text-2xl font-serif tracking-widest">DIOR</div>

            {/* Country/Language */}
            <div className="text-sm text-gray-300 text-center md:text-right">
              <div className="opacity-80">
                Choose your Country or Region &amp; Language
              </div>
              <div className="font-medium inline-flex items-center gap-2 mt-1">
                United Kingdom (English) <FiChevronRight />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
    </div>
      </section>
    </main>
  );
}
