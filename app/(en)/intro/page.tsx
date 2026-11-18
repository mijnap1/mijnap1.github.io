import type { Metadata } from "next";
import { BodyClass } from "@/components/BodyClass";
import { IntroPreview } from "@/components/home/IntroPreview";

export const metadata: Metadata = { title: "Intro Preview", robots: { index: false } };

export default function Page() {
  return (
    <>
      <BodyClass names="intro-preview-page" />
      <IntroPreview />
    </>
  );
}
