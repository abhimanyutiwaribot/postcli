import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Slash Commands — RQS Docs",
  description: "Complete list of console commands to configure base API URLs (/set base), clear output logs (/clear), print help cheat sheets (/help), or exit the prompt.",
};

export default function SystemCommands() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        system commands
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        manage the active prompt shell using slash commands.
      </p>

      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/set base &lt;url&gt;</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            set the default base URL for relative endpoint paths. prepends http/https if missing.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/clear</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            clear all request logs and output logs from the active terminal context.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/copy</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            copy the last request's JSON response body directly to your clipboard.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/help</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            print out the quick commands cheat sheet directly in the console.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/exit /quit</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            quit the interactive prompt session.
          </p>
        </div>
      </div>
    </section>
  );
}
