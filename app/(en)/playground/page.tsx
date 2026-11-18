import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Playground", "/playground/");

export default function Page() {
  return <PlaygroundPage />;
}
