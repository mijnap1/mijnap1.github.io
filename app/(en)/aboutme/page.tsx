import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("About Me", "/aboutme/");

export default function Page() {
  return <AboutPage locale="en" />;
}
