import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Syntax Guide — RQS Docs",
  description: "Syntax rules for HTTP methods, query parameter mappings (==), custom headers (:), body string properties (=), raw typed JSON (:=), and nested paths.",
};

export default function SyntaxGuide() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        syntax guide
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        write http requests using clean parameters separated by spaces.
      </p>

      <div className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">1. Method & Endpoint</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            start with the method (GET, POST, etc). if skipped, we default to GET. relative paths resolve against the base url.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /posts <br />
            /posts/1
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">2. Query Parameters (==)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            use double equals (==) to add query parameters to your path.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /posts limit==10 page==2
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">3. Custom Headers (:)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            use a colon (:) to pass request headers. wrap values in quotes if they contain spaces.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /users Authorization:"Bearer token123" Content-Type:application/json
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">4. JSON Body Strings (=)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            use a single equals (=) to send standard text string fields inside the request JSON body.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /posts title="New post" category=tech
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">5. Raw Type JSON Values (:=)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            use colon-equals (:=) to send typed data like numbers, booleans, arrays, or raw json objects.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /posts published:=true views:=150 tags:='["news", "web"]'
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">6. Nested JSON Objects (user[name])</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            build nested JSON layouts using bracket paths.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500  text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /users user[name]="John" user[address][city]="Seattle"
          </div>
        </div>
      </div>
    </section>
  );
}
