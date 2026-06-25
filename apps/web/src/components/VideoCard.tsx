import React from "react";

interface VideoCardProps {
  isDarkMode: boolean;
}

export default function VideoCard({ isDarkMode }: VideoCardProps) {
  return (
    <div
      className={`w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-3xl border flex flex-col items-center justify-center transition-all ${
        isDarkMode ? "border-zinc-800 bg-black" : "border-zinc-500 bg-zinc-200/30"
      }`}
    >
      {/* Play symbol and label */}
      <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center transition-all ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-950 text-zinc-300"
              : "border-zinc-450 bg-[#bebebe]/50 text-zinc-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 md:w-6 md:h-6"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </div>
        <span className="text-xs md:text-sm font-semibold tracking-wide">Demo Video</span>
      </div>
    </div>
  );
}
