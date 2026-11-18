import type { Genre } from "@/components/music/playlists";

export const GENRES: Genre[] = ["kpop", "jpop", "kballad"];

export function genreTitle(genre: Genre): string {
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

export function genreParams() {
  return GENRES.map((genre) => ({ genre }));
}
