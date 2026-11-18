import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";
import { BodyClass } from "@/components/BodyClass";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("À propos de moi", "/aboutmefr/", "fr");

export default function Page() {
  return (
    <>
      <BodyClass names="about-fr" />
      <AboutPage locale="fr" />
    </>
  );
}
