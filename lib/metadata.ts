import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { SITE_URL } from "./site";

const DESCRIPTIONS: Record<Locale, string> = {
  en: "A curated portfolio of Jamie Ryu’s work, growth, and ideas as a full-stack developer.",
  fr: "Un portfolio organisé du travail, de la croissance et des idées de Jamie Ryu en tant que développeur full-stack.",
};
const DEFAULT_DESCRIPTION = DESCRIPTIONS.en;

export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: "/ico/logo/jamie3128.png",
  },
  openGraph: {
    type: "website",
    siteName: "jamieryu.com",
    title: "Jamie Ryu's Portfolio website",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
};

export function pageMetadata(title: string, path: string, locale: Locale = "en"): Metadata {
  const description = DESCRIPTIONS[locale];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...BASE_METADATA.openGraph, description, url: path },
  };
}
