import type { Metadata } from "next";
import { BodyClass } from "@/components/BodyClass";
import { PlaylistPage } from "@/components/music/PlaylistPage";
import type { Genre } from "@/components/music/playlists";
import { genreParams, genreTitle } from "@/lib/genres";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ genre: Genre }> };

export const dynamicParams = false;
export const generateStaticParams = genreParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  return pageMetadata(`Playlist ${genreTitle(genre)}`, `/musicfr/${genre}/`, "fr");
}

export default async function Page({ params }: Props) {
  const { genre } = await params;
  return (
    <>
      <BodyClass names={`playlist-${genre}`} />
      <PlaylistPage locale="fr" genre={genre} />
    </>
  );
}
