import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "REPL Modes & Key Bindings — RQS Docs",
  description: "Guide to RQS input and scroll modes, vim key navigation, response details inspector, and clipboard copy shortcuts.",
};

export default function ReplModes() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        repl modes
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        rqs runs in two main modes: input mode (to type requests) and scroll mode (to inspect outcomes).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <div
          className="p-5 rounded-xl border border-zinc-500 bg-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/20"
        >
          <span className="font-bold text-magenta text-sm uppercase tracking-wider">
            input mode (default)
          </span>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
            type paths, methods, and payloads directly. supports autocomplete.
          </p>
        </div>
        <div
          className="p-5 rounded-xl border border-zinc-500 bg-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/20"
        >
          <span className="font-bold text-magenta text-sm uppercase tracking-wider">
            scroll mode (escape)
          </span>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
            locks input to let you scroll history, inspect responses, and copy payloads.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          key bindings
        </span>
        <div
          className="border overflow-hidden rounded-xl border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-zinc-500 dark:border-zinc-800">
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider w-[150px]">Key</th>
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">Escape</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">switch from input mode to scroll mode</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">i / Escape</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">go back to input mode (from scroll mode)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">j / k (or arrow keys)</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">scroll console history (scroll mode only)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">v</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">open the response inspector (body / headers tabs)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">c</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">copy active inspector tab content to clipboard</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold font-mono">q</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">quit the terminal shell</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
