import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Contact", "/contact/");

export default function Page() {
  return <ContactPage locale="en" />;
}
