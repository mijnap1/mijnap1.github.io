import type { Metadata } from "next";
import { BodyClass } from "@/components/BodyClass";
import { SearchPage } from "@/components/search/SearchPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Search", "/search/");

export default function Page() {
  return (
    <>
      <BodyClass names="search-page-body" />
      <SearchPage locale="en" />
    </>
  );
}
