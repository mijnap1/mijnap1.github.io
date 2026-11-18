import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Contact", "/contactfr/", "fr");

export default function Page() {
  return <ContactPage locale="fr" />;
}
