import type { Metadata } from "next";
import { ArchiveMusicPage } from "@/components/music/ArchiveMusicPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Music", "/archive/music/");

export default function Page() {
  return <ArchiveMusicPage locale="en" />;
}
