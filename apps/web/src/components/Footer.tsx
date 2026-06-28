"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full max-w-5xl mx-auto px-4 pt-16 pb-12 mt-12 md:mt-24 flex flex-col items-center gap-6">
      {/* Use Now Call to Action Indicator */}
      <div className="flex flex-col items-center gap-1 select-none pointer-events-none">
        <span className="text-[10px] md:text-xs font-semibold tracking-widest text-zinc-650 dark:text-zinc-500">
          use now
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="21"
          viewBox="0 0 24 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-655 dark:text-zinc-500"
        >
          <path d="M12 4v28" />
          <path d="m18 26-6 6-6-6" />
        </svg>
      </div>

      {/* Massive glowing neon brand mark */}
      <div
        onClick={scrollToTop}
        className="cursor-pointer select-none relative flex items-center justify-center py-6 w-full overflow-hidden hover:scale-[1.01] transition-all duration-200"
        title="Scroll to top"
      >
        <span className="text-[12vw] sm:text-8xl md:text-9xl font-black tracking-tighter text-magenta blur-[8px] opacity-75 select-none font-mono whitespace-nowrap">
          rqs ❯
        </span>
        {/* Crisp foreground layer */}
        <span className="absolute text-[12vw] sm:text-8xl md:text-9xl font-black tracking-tighter text-magenta/90 select-none font-mono whitespace-nowrap">
          rqs ❯
        </span>
      </div>

      {/* Dotted divider and simple copyright/links */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-dashed border-zinc-500/20 pt-6 font-mono text-xs gap-4">
        <div className="text-zinc-650 dark:text-zinc-500">
          <span>MIT License</span>
        </div>
        <div className="flex gap-6">
          <a
            href="https://github.com/abhimanyutiwaribot/rqs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all text-zinc-650 dark:text-zinc-500 hover:text-black dark:hover:text-white"
          >
            Github
          </a>
          <Link
            href="/docs/getting-started"
            className="hover:underline transition-all text-zinc-650 dark:text-zinc-500 hover:text-black dark:hover:text-white"
          >
            Docs
          </Link>
        </div>
        <div className="text-zinc-650 dark:text-zinc-500">
          <span>made by <a
            href="https://x.com/abhimanyutwts"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all text-zinc-650 dark:text-zinc-500 hover:text-black dark:hover:text-white">@abhimanyutwts</a></span>
        </div>
      </div>
    </footer>
  );
}
