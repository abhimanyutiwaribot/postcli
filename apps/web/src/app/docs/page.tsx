"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/docs/getting-started");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      {/* <span className="text-xs text-zinc-500 animate-pulse"></span> */}
    </div>
  );
}
