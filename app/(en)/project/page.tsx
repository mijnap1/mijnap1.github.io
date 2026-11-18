import type { Metadata } from "next";
import { ProjectPage } from "@/components/project/ProjectPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("My Projects", "/project/");

export default function Page() {
  return <ProjectPage locale="en" />;
}
