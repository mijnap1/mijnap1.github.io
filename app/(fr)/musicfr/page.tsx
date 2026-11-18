import type { Metadata } from "next";
import { BodyClass } from "@/components/BodyClass";
import { MusicStagePage } from "@/components/music/MusicStagePage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Musique", "/musicfr/", "fr");

export default function Page() {
  return (
    <>
      <BodyClass names="music-page-body" />
      <MusicStagePage locale="fr" />
    </>
  );
}
