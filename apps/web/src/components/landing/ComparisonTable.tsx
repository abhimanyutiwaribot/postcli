import React from "react";

export default function ComparisonTable() {
  const comparisonData = [
    {
      feature: "Interface Type",
      curl: "Static CLI",
      postman: "Desktop GUI",
      rqs: "CLI REPL (Interactive)",
      highlight: true
    },
    {
      feature: "Writing JSON Payloads",
      curl: "Escape hell ('{\"a\":1}')",
      postman: "Form fields or editor",
      rqs: "Intuitive syntax (key=val)",
      highlight: true
    },
    {
      feature: "Keyboard Focus",
      curl: "Command-history only",
      postman: "Mouse-heavy clicks",
      rqs: "Vim keys (j/k/v/Esc)",
      highlight: true
    },
    {
      feature: "Startup Time",
      curl: "Instant",
      postman: "Slow (splash screen)",
      rqs: "Instant (<50ms)",
      highlight: true
    },
    {
      feature: "Memory Footprint",
      curl: "<5 MB",
      postman: "300 MB+",
      rqs: "<20 MB",
      highlight: true
    }
  ];

  return (
    <section className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          How rqs compares?
        </h2>
        <p className="text-sm md:text-md text-zinc-700 dark:text-zinc-400">
          How does rqs cooks👨🏻‍🍳 against these frauds --&gt; curl and bloated web clients?
        </p>
      </div>

      <div
        className="w-full border overflow-hidden transition-colors border-zinc-500 bg-zinc-200/10 dark:border-zinc-800 dark:bg-black/40"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse font-mono text-xs md:text-sm">
            <thead>
              <tr className="border-b transition-colors border-zinc-500 dark:border-zinc-800">
                <th className="p-4 font-bold text-zinc-900 dark:text-zinc-500 uppercase tracking-wider min-w-[150px]">
                  Feature
                </th>
                <th className="p-4 font-bold text-magenta uppercase tracking-wider min-w-[160px] bg-magenta/5">
                  rqs
                </th>
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider min-w-[120px]">
                  curl
                </th>
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider min-w-[120px]">
                  Postman
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-b-0 transition-colors border-zinc-400/50 hover:bg-zinc-200/40 dark:border-zinc-850 dark:hover:bg-zinc-900/20"
                >
                  <td className="p-4 font-semibold text-black dark:text-zinc-200">
                    {row.feature}
                  </td>
                  <td className="p-4 font-bold text-magenta bg-magenta/5 border-l border-r border-magenta/10">
                    {row.rqs}
                  </td>
                  <td className="p-4 text-zinc-650 dark:text-zinc-400">
                    {row.curl}
                  </td>
                  <td className="p-4 text-zinc-650 dark:text-zinc-400">
                    {row.postman}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
