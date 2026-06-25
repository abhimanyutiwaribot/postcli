import React from "react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-6 py-4 md:px-8 rounded-2xl border transition-all ${
        isDarkMode ? "border-zinc-800 bg-black" : "border-zinc-500 bg-[#bebebe]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-base md:text-lg">postcli &gt;</span>
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <a
          href="#"
          className={`text-xs md:text-sm hover:underline transition-colors ${
            isDarkMode ? "text-zinc-300 hover:text-white" : "text-zinc-700 hover:text-black"
          }`}
        >
          Docs
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs md:text-sm hover:underline transition-colors ${
            isDarkMode ? "text-zinc-300 hover:text-white" : "text-zinc-700 hover:text-black"
          }`}
        >
          Github
        </a>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className={`p-1.5 rounded-lg transition-all ${
            isDarkMode ? "hover:bg-zinc-900 text-white" : "hover:bg-zinc-300 text-black"
          }`}
        >
          {isDarkMode ? (
            // Sun Icon for Light Mode Toggle
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            // Moon Icon for Dark Mode Toggle
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
