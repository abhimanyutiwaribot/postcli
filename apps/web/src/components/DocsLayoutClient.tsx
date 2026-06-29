"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

interface DocsLayoutClientProps {
  children: React.ReactNode;
}

export default function DocsLayoutClient({ children }: DocsLayoutClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/docs/getting-started", title: "getting started" },
    { href: "/docs/repl-modes", title: "repl modes" },
    { href: "/docs/syntax-guide", title: "syntax guide" },
    { href: "/docs/system-commands", title: "system commands" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 px-4 pb-12 md:px-8 md:pb-24 mt-8 md:mt-16 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        
        {/* Navigation Column (Sticky on scroll for both desktop and mobile) */}
        <nav 
          className="md:col-span-3 md:sticky md:top-6 flex flex-col gap-3 sticky top-0 z-30 w-[calc(100%+2rem)] md:w-auto -mx-4 md:mx-0 px-4 md:px-0 border-b border-dashed md:border-b-0 border-zinc-500/20 py-3 md:py-0 transition-colors bg-[#d6d6d6] dark:bg-black"
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
              Menu
            </span>
            <div className="flex flex-col gap-3.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs md:text-sm font-semibold hover:text-magenta transition-colors ${
                      isActive
                        ? "text-magenta font-bold underline underline-offset-4"
                        : "text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile / Tablet Collapsible Menu Dropdown */}
          <div className="md:hidden flex flex-col w-full relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-lg font-bold tracking-wider select-none py-1.5 px-1 focus:outline-none w-fit cursor-pointer text-black dark:text-white"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-magenta">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-magenta">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
              menu
            </button>
            
            {isMenuOpen && (
              <div
                className="flex flex-col gap-3.5 p-4 border mt-2 rounded-xl transition-all z-20 shadow-md border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-xs font-bold transition-all hover:text-magenta ${
                        isActive 
                          ? "text-magenta" 
                          : "text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Page Content Column - Increased Font Size */}
        <main className="md:col-span-9 flex flex-col gap-8 text-base leading-relaxed max-w-none">
          {children}
        </main>
      </div>

      {/* Divider */}
      <div className="h-px w-full transition-colors bg-zinc-400 dark:bg-zinc-800" />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
