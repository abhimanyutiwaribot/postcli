import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started - RQS Docs",
  description: "Learn how to install RQS via npm, bun, yarn, or pnpm, and boot the interactive HTTP terminal REPL prompt.",
};

export default function GettingStarted() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        getting started
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        install rqs globally to start using the interactive REPL in your terminal.
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          installation
        </span>
        <div
          className="p-5 rounded-xl border relative font-mono text-sm overflow-x-auto  border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          <div className="flex flex-col gap-4">
            <div><span className="text-zinc-500"># npm</span> <br />npm install -g rqs</div>
            <div><span className="text-zinc-500"># bun</span> <br />bun add -g rqs</div>
            <div><span className="text-zinc-500"># yarn</span> <br />yarn global add rqs</div>
            <div><span className="text-zinc-500"># pnpm</span> <br />pnpm add -g rqs</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          running rqs
        </span>
        <p className="text-base text-zinc-850 dark:text-zinc-300">
          once installed, run this command to boot into the prompt:
        </p>
        <div
          className="p-5 rounded-xl border font-mono text-sm overflow-x-auto select-all border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          rqs
        </div>
      </div>
    </section>
  );
}
