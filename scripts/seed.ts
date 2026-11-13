import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { fallbackNavigation, fallbackWebsiteSections } from "../server/repositories/fallback-data";

dotenv.config({ path: ".env.local" });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });
  const db = drizzle(pool, { schema });

  console.log("🌱 Enriching database with editable placeholder records...");

  // 1. Admin user
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  const [existingAdmin] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1);

  if (!existingAdmin) {
    await db.insert(schema.adminUsers).values({
      email,
      passwordHash,
      name: "Senior Architect",
      role: "admin",
    });
    console.log(`✅ Admin user: ${email}`);
  }

  // 2. Profile
  const [existingProfile] = await db.select().from(schema.profile).limit(1);
  if (!existingProfile) {
    await db.insert(schema.profile).values({
      fullName: "Arun M [Editable Profile]",
      title: "Senior Full-Stack Architect & 3D Creative Engineer",
      subtitle: "Designing resilient distributed cloud engines, type-safe architectures, and futuristic 3D web experiences.",
      bio: "Accomplished full-stack architect with a deep focus on distributed database systems, high-performance web applications, and immersive WebGL environments. Known for architecting resilient production systems that scale gracefully under peak concurrent loads.",
      shortBio: "Senior Architect & Creative Technologist crafting next-generation digital platforms.",
      email: "contact@example.com",
      location: "Bangalore, India",
      availability: "AVAILABLE FOR ARCHITECTURE CONTRACTS",
      yearsOfExperience: 8,
      projectsCompleted: 35,
      happyClients: 22,
      status: "published",
    });
    console.log("✅ Profile created");
  }

  // 3. Projects (Placeholders)
  const projectCount = await db.select().from(schema.projects);
  if (projectCount.length === 0) {
    await db.insert(schema.projects).values([
      {
        title: "Nexus Neural Cloud Engine [Placeholder Project]",
        slug: "nexus-neural-cloud",
        shortDescription: "Distributed microservices platform handling 100k+ events/sec with sub-50ms latency.",
        description: "Architected a zero-trust event streaming engine utilizing PostgreSQL, Redis cache layers, and Dockerized microservices. Features real-time telemetry dashboards and resilient failover orchestrations.",
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Redis"],
        category: "Cloud Infrastructure",
        client: "FinTech Enterprise [Placeholder]",
        isFeatured: true,
        sortOrder: 1,
        status: "published",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
      },
      {
        title: "Aura 3D Spatial Universe [Placeholder Project]",
        slug: "aura-3d-universe",
        shortDescription: "Hardware-accelerated WebGL digital twin with dynamic physics and volumetric lighting.",
        description: "Built an interactive 3D spatial interface using React Three Fiber, GLTF pipelines, and custom GLSL vertex shaders. Achieves stable 60 FPS across mobile and desktop devices.",
        techStack: ["Three.js", "React Three Fiber", "GLSL Shaders", "Tailwind CSS"],
        category: "3D & Creative Web",
        client: "Spatial Studios [Placeholder]",
        isFeatured: true,
        sortOrder: 2,
        status: "published",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
      },
      {
        title: "HyperScale E-Commerce Nexus [Placeholder Project]",
        slug: "hyperscale-ecommerce",
        shortDescription: "High-concurrency digital commerce engine featuring multi-region data replication.",
        description: "Designed a type-safe transactional platform with Drizzle ORM, Zod validation pipelines, and stripe billing integration complying with global compliance standards.",
        techStack: ["Next.js 16", "Drizzle ORM", "PostgreSQL", "Zod", "Tailwind CSS"],
        category: "Full-Stack Enterprise",
        client: "Global Retail [Placeholder]",
        isFeatured: true,
        sortOrder: 3,
        status: "published",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
      },
    ]);
    console.log("✅ Projects seeded");
  }

  // 4. Skill Categories & Skills
  const catCount = await db.select().from(schema.skillCategories);
  if (catCount.length === 0) {
    const [c1] = await db.insert(schema.skillCategories).values({
      name: "Frontend & 3D WebGL",
      slug: "frontend-3d",
      sortOrder: 1,
      status: "published",
    }).returning();

    const [c2] = await db.insert(schema.skillCategories).values({
      name: "Backend & Systems",
      slug: "backend-systems",
      sortOrder: 2,
      status: "published",
    }).returning();

    const [c3] = await db.insert(schema.skillCategories).values({
      name: "Cloud & Security Architecture",
      slug: "cloud-security",
      sortOrder: 3,
      status: "published",
    }).returning();

    await db.insert(schema.skills).values([
      { name: "React / Next.js 16", slug: "nextjs", level: 95, categoryId: c1.id, isFeatured: true, status: "published" },
      { name: "Three.js & React Three Fiber", slug: "threejs", level: 90, categoryId: c1.id, isFeatured: true, status: "published" },
      { name: "TypeScript & Strict Type Systems", slug: "typescript", level: 95, categoryId: c1.id, isFeatured: true, status: "published" },
      { name: "Node.js & Go Runtime", slug: "nodejs", level: 88, categoryId: c2.id, isFeatured: true, status: "published" },
      { name: "PostgreSQL & Drizzle ORM", slug: "postgresql", level: 92, categoryId: c2.id, isFeatured: true, status: "published" },
      { name: "Distributed Microservices & REST/gRPC", slug: "microservices", level: 85, categoryId: c2.id, isFeatured: true, status: "published" },
      { name: "Docker & Kubernetes Orchestration", slug: "kubernetes", level: 85, categoryId: c3.id, isFeatured: true, status: "published" },
      { name: "DPDP Act 2023 & Security Auditing", slug: "security", level: 90, categoryId: c3.id, isFeatured: true, status: "published" },
      { name: "CI/CD & High-Availability Cloud", slug: "cicd", level: 88, categoryId: c3.id, isFeatured: true, status: "published" },
    ]);
    console.log("✅ Skills constellation seeded");
  }

  // 5. Work Experience (Placeholders)
  const expCount = await db.select().from(schema.experience);
  if (expCount.length === 0) {
    await db.insert(schema.experience).values([
      {
        company: "Apex Cloud Architecture [Placeholder]",
        position: "Principal Software Architect",
        location: "Bangalore, India / Remote",
        startDate: new Date("2023-01-01"),
        isCurrent: true,
        description: "Leading the core technical design of high-concurrency cloud distributed services. Oversaw database normalization, sub-second latency optimizations, and zero-downtime deployment pipelines.",
        techStack: ["Next.js", "PostgreSQL", "Docker", "TypeScript"],
        status: "published",
      },
      {
        company: "Starlight Digital Systems [Placeholder]",
        position: "Senior Full-Stack Engineer",
        location: "Remote",
        startDate: new Date("2020-06-01"),
        endDate: new Date("2022-12-31"),
        isCurrent: false,
        description: "Engineered scalable web applications, modernized legacy monoliths into modular micro-frontends, and integrated hardware-accelerated 3D data visualizers.",
        techStack: ["React", "Node.js", "Three.js", "PostgreSQL"],
        status: "published",
      },
    ]);
    console.log("✅ Experience timeline seeded");
  }

  // 6. Education (Placeholders)
  const eduCount = await db.select().from(schema.education);
  if (eduCount.length === 0) {
    await db.insert(schema.education).values([
      {
        institution: "National Institute of Technology [Placeholder]",
        degree: "Bachelor of Technology in Computer Science & Engineering",
        field: "Computer Science & Distributed Systems",
        location: "India",
        startDate: new Date("2016-08-01"),
        endDate: new Date("2020-05-30"),
        isCurrent: false,
        description: "Specialized in distributed operating systems, relational database theory, algorithms, and cryptographic computing.",
        status: "published",
      },
    ]);
    console.log("✅ Education seeded");
  }

  // 7. Certifications (Placeholders)
  const certCount = await db.select().from(schema.certifications);
  if (certCount.length === 0) {
    await db.insert(schema.certifications).values([
      {
        name: "AWS Certified Solutions Architect - Professional [Placeholder]",
        issuer: "Amazon Web Services",
        credentialId: "AWS-PSA-98421",
        credentialUrl: "https://aws.amazon.com",
        isFeatured: true,
        status: "published",
      },
      {
        name: "Certified Kubernetes Administrator (CKA) [Placeholder]",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        credentialId: "CKA-77412",
        credentialUrl: "https://www.cncf.io",
        isFeatured: true,
        status: "published",
      },
    ]);
    console.log("✅ Certifications seeded");
  }

  // 8. Services (Placeholders)
  const svcCount = await db.select().from(schema.services);
  if (svcCount.length === 0) {
    await db.insert(schema.services).values([
      {
        title: "Full-Stack System Architecture & Review",
        slug: "full-stack-architecture",
        shortDescription: "End-to-end design of resilient web applications, database schemas, and microservice topologies.",
        price: "Consulting Retainer",
        isFeatured: true,
        status: "published",
      },
      {
        title: "Interactive 3D WebGL Development",
        slug: "interactive-3d-development",
        shortDescription: "Custom Three.js, React Three Fiber visualizers, digital twins, and immersive user experiences.",
        price: "Project Milestone",
        isFeatured: true,
        status: "published",
      },
    ]);
    console.log("✅ Services seeded");
  }

  // 9. Testimonials (Placeholders)
  const testCount = await db.select().from(schema.testimonials);
  if (testCount.length === 0) {
    await db.insert(schema.testimonials).values([
      {
        name: "David Vance [Placeholder Peer]",
        title: "VP of Engineering",
        company: "FinTech Scaleup [Placeholder]",
        content: "An exceptional software architect with a rare talent for harmonizing deep backend resilience with award-winning creative interfaces. Reduced our database query latencies by 60%.",
        rating: 5,
        isVerified: true,
        isFeatured: true,
        status: "published",
      },
      {
        name: "Elena Morales [Placeholder Client]",
        title: "Product Founder",
        company: "Spatial Analytics [Placeholder]",
        content: "Delivered our 3D interactive web product on time with flawless WebGL performance and strict adherence to data protection standards. A world-class engineer.",
        rating: 5,
        isVerified: true,
        isFeatured: true,
        status: "published",
      },
    ]);
    console.log("✅ Testimonials seeded");
  }

  // 10. Social Links
  const linkCount = await db.select().from(schema.socialLinks);
  if (linkCount.length === 0) {
    await db.insert(schema.socialLinks).values([
      { platform: "GitHub", url: "https://github.com", label: "GitHub Profile", isActive: true },
      { platform: "LinkedIn", url: "https://linkedin.com", label: "LinkedIn Network", isActive: true },
      { platform: "Twitter", url: "https://x.com", label: "X / Twitter", isActive: true },
    ]);
    console.log("✅ Social links seeded");
  }

  // 11. Navigation (required so admin edits map to real rows)
  const navCount = await db.select().from(schema.navigation);
  if (navCount.length === 0) {
    await db.insert(schema.navigation).values(
      fallbackNavigation.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        color: item.color,
        badge: item.badge,
        style: item.style,
        isExternal: item.isExternal,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        status: item.status,
        group: item.group,
      }))
    );
    console.log("✅ Navigation seeded");
  }

  // 12. Website Sections (required so admin edits map to real rows)
  const sectionCount = await db.select().from(schema.websiteSections);
  if (sectionCount.length === 0) {
    await db.insert(schema.websiteSections).values(
      fallbackWebsiteSections.map((section) => ({
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle,
        badge: section.badge,
        description: section.description,
        content: section.content,
        componentType: section.componentType,
        sortOrder: section.sortOrder,
        status: section.status,
        styles: section.styles,
        metadata: section.metadata,
      }))
    );
    console.log("✅ Website sections seeded");
  }

  console.log("\n🎉 Database fully prepared with rich editable records!");
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
