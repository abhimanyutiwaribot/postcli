"use client";

import React, { useEffect, useState } from "react";

const ASCII_LOGO = `
██████╗   ██████╗  ███████╗
██╔══██╗ ██╔═══██╗ ██╔════╝
██████╔╝ ██║   ██║ ███████╗
██╔══██╗ ██║▄▄ ██║ ╚════██║
██║  ██║ ╚██████╔╝ ███████║
╚═╝  ╚═╝  ╚══▀▀═╝  ╚══════╝
`;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Lock scrolling during the brand intro logo load
    document.body.style.overflow = "hidden";

    // Start fade out animation after 800ms
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 800);

    // Unmount completely from DOM after 1200ms
    const exitTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono transition-opacity duration-400 ease-out select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="p-6">
        {/* Glowing ASCII Art Brand Header */}
        <pre className="text-magenta text-xs md:text-sm leading-tight text-center font-bold drop-shadow-[0_0_15px_rgba(255,0,128,0.5)] overflow-x-auto whitespace-pre">
          {ASCII_LOGO.trim()}
        </pre>
      </div>
    </div>
  );
}
