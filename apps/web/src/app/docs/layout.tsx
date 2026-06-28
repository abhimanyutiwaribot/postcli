import type { Metadata } from "next";
import DocsLayoutClient from "../../components/DocsLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://rqscli.vercel.app"),
  title: "Documentation — RQS",
  description: "Learn how to use RQS: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
  openGraph: {
    title: "Documentation — RQS",
    description: "Learn how to use RQS: interactive REPL commands, keyboard bindings, syntax mappings, and system slash commands.",
    images: [
      {
        url: "/opengraph-image-docs.png",
        width: 1200,
        height: 630,
        alt: "RQS Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image-docs.png"],
  },
};

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
