import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { BASE_METADATA } from "@/lib/metadata";

export const metadata: Metadata = BASE_METADATA;

export default function FrenchLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
