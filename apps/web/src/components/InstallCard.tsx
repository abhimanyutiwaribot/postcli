import React from "react";

const INSTALL_COMMANDS = {
  npm: "npm install -g postcli",
  bun: "bun add -g postcli",
  yarn: "yarn global add postcli",
  pnpm: "pnpm add -g postcli",
};

interface InstallCardProps {
  isDarkMode: boolean;
  activePkg: "npm" | "bun" | "yarn" | "pnpm";
  onSelectPkg: (pkg: "npm" | "bun" | "yarn" | "pnpm") => void;
  copied: boolean;
  onCopy: () => void;
}

export default function InstallCard({
  isDarkMode,
  activePkg,
  onSelectPkg,
  copied,
  onCopy,
}: InstallCardProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onClick={onCopy}
        className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border cursor-pointer select-none transition-all group ${
          isDarkMode
            ? "border-zinc-800 bg-black hover:border-zinc-650"
            : "border-zinc-500 bg-[#bebebe] hover:border-zinc-700"
        }`}
      >
        <code className="text-xs md:text-sm font-semibold select-all">
          {INSTALL_COMMANDS[activePkg]}
        </code>
        <button
          aria-label="Copy Command"
          className={`p-1 rounded transition-colors ${
            isDarkMode ? "hover:bg-zinc-900 text-zinc-400 group-hover:text-white" : "hover:bg-zinc-300 text-zinc-600 group-hover:text-black"
          }`}
        >
          {copied ? (
            // Checkmark Icon on Success
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            // Clipboard / Copy Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </button>
      </div>

      {/* Package manager switcher options */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <span className={`text-[10px] uppercase tracking-widest ${isDarkMode ? "text-zinc-500" : "text-zinc-600"}`}>
          or
        </span>
        <div className="flex gap-6 items-center justify-center">
          {(["npm", "bun", "yarn", "pnpm"] as const).map((pkg) => (
            <button
              key={pkg}
              onClick={() => onSelectPkg(pkg)}
              className={`text-xs md:text-sm transition-all hover:underline ${
                activePkg === pkg
                  ? "font-bold underline"
                  : isDarkMode
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              {pkg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export { INSTALL_COMMANDS };
