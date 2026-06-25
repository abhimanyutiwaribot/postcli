"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import InstallCard, { INSTALL_COMMANDS } from "../components/InstallCard";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePkg, setActivePkg] = useState<"npm" | "bun" | "yarn" | "pnpm">("npm");
  const [copied, setCopied] = useState(false);

  // Initialize theme based on preference or system
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS[activePkg]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`min-h-screen font-mono flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-[#d6d6d6] text-black"
      }`}
    >
      {/* Wrapper to align header to top and content nicely */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-12 px-4 py-6 md:px-8 md:py-12">
        {/* Header Bar */}
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

        {/* Content Section: Split Columns, aligned at start top level */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Heading and Install Snippet */}
          <div className="md:col-span-5 flex flex-col items-start gap-6 md:gap-8">
            <h1 className="text-xl md:text-2xl font-semibold leading-relaxed tracking-wide text-left whitespace-pre-line">
              {"An interactive,\nTerminal-based\nHTTP-Client\nbuilt\nfor you!!"}
            </h1>

            {/* Install command card */}
            <InstallCard
              isDarkMode={isDarkMode}
              activePkg={activePkg}
              onSelectPkg={setActivePkg}
              copied={copied}
              onCopy={handleCopy}
            />
          </div>

          {/* Right Column: Demo Video Placeholder */}
          <div className="md:col-span-7 w-full flex items-center justify-center">
            <VideoCard isDarkMode={isDarkMode} />
          </div>
        </main>
      </div>
    </div>
  );
}
