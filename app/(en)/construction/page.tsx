import type { Metadata } from "next";
import { ConstructionPage } from "@/components/construction/ConstructionPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata("Under construction", "/construction/"),
  robots: { index: false },
};

export default function Page() {
  return <ConstructionPage />;
}
