import type { Metadata } from "next";
import { ArchiveMusicPage } from "@/components/music/ArchiveMusicPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Musique", "/archive/musicfr/", "fr");

export default function Page() {
  return <ArchiveMusicPage locale="fr" />;
}
