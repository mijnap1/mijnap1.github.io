import type { Metadata } from "next";
import { BodyClass } from "@/components/BodyClass";
import { HomePage } from "@/components/home/HomePage";
import { INTRO_BOOT_SCRIPT } from "@/components/home/intro-boot";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Jamie Ryu's Portfolio", "/");

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
      <BodyClass names="noscroll" />
      <HomePage locale="en" />
    </>
  );
}
