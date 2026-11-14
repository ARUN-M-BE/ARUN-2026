import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProjectBySlug, getPublicProjects } from "@/lib/actions";
import { ProjectCaseStudy } from "@/components/portfolio/project-case-study";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return { title: "Case study not found" };
  }

  const description =
    project.shortDescription ||
    project.description?.slice(0, 180) ||
    `Case study for ${project.title}.`;
  const image = project.thumbnail || project.thumbnailUrl;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — Case Study`,
      description,
      url: `/projects/${project.slug}`,
      images: image ? [{ url: image, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = (await getPublicProjects()) as Project[];
  const navigable = allProjects.filter((item) => item.slug !== project.slug);
  const currentIndex = allProjects.findIndex((item) => item.slug === project.slug);

  const previous =
    allProjects.length > 1
      ? currentIndex > 0
        ? allProjects[currentIndex - 1]
        : navigable[navigable.length - 1] ?? null
      : null;
  const next =
    allProjects.length > 1
      ? currentIndex >= 0 && currentIndex < allProjects.length - 1
        ? allProjects[currentIndex + 1]
        : navigable[0] ?? null
      : null;

  return (
    <ProjectCaseStudy
      project={project}
      previous={previous ? { slug: previous.slug, title: previous.title } : null}
      next={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
