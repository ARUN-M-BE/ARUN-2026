import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────
export const statusEnum = pgEnum("status", [
  "draft",
  "published",
  "unpublished",
]);
export const messageStatusEnum = pgEnum("message_status", [
  "unread",
  "read",
  "replied",
  "archived",
  "spam",
]);

// ─── Admin Users ──────────────────────────────────────────
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Profile ──────────────────────────────────────────────
export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  bio: text("bio"),
  shortBio: text("short_bio"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  website: text("website"),
  avatar: text("avatar"),
  heroImage: text("hero_image"),
  resumeUrl: text("resume_url"),
  yearsOfExperience: integer("years_of_experience"),
  projectsCompleted: integer("projects_completed"),
  happyClients: integer("happy_clients"),
  availability: text("availability"),
  status: statusEnum("status").notNull().default("published"),
  metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Projects ─────────────────────────────────────────────
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description"),
    description: text("description"),
    thumbnail: text("thumbnail"),
    images: jsonb("images").$type<string[]>().default([]),
    liveUrl: text("live_url"),
    githubUrl: text("github_url"),
    techStack: jsonb("tech_stack").$type<string[]>().default([]),
    category: text("category"),
    client: text("client"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("projects_slug_idx").on(table.slug),
    index("projects_status_idx").on(table.status),
    index("projects_featured_idx").on(table.isFeatured),
  ]
);

// ─── Skills ───────────────────────────────────────────────
export const skillCategories = pgTable("skill_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  color: text("color"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: statusEnum("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon"),
    level: integer("level").notNull().default(50),
    categoryId: uuid("category_id").references(() => skillCategories.id, {
      onDelete: "set null",
    }),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("skills_category_idx").on(table.categoryId),
    index("skills_status_idx").on(table.status),
  ]
);

// ─── Experience ───────────────────────────────────────────
export const experience = pgTable(
  "experience",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    company: text("company").notNull(),
    position: text("position").notNull(),
    location: text("location"),
    type: text("type"),
    description: text("description"),
    achievements: jsonb("achievements").$type<string[]>().default([]),
    techStack: jsonb("tech_stack").$type<string[]>().default([]),
    companyLogo: text("company_logo"),
    companyUrl: text("company_url"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    isCurrent: boolean("is_current").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("experience_status_idx").on(table.status)]
);

// ─── Education ────────────────────────────────────────────
export const education = pgTable(
  "education",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    institution: text("institution").notNull(),
    degree: text("degree").notNull(),
    field: text("field"),
    location: text("location"),
    description: text("description"),
    grade: text("grade"),
    logo: text("logo"),
    url: text("url"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    isCurrent: boolean("is_current").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("education_status_idx").on(table.status)]
);

// ─── Certifications ───────────────────────────────────────
export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    issuer: text("issuer").notNull(),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    image: text("image"),
    issueDate: timestamp("issue_date", { withTimezone: true }),
    expiryDate: timestamp("expiry_date", { withTimezone: true }),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("certifications_status_idx").on(table.status)]
);

// ─── Services ─────────────────────────────────────────────
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  icon: text("icon"),
  image: text("image"),
  price: text("price"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Testimonials ─────────────────────────────────────────
export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    title: text("title"),
    company: text("company"),
    content: text("content").notNull(),
    avatar: text("avatar"),
    rating: integer("rating"),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    isFeatured: boolean("is_featured").notNull().default(false),
    isVerified: boolean("is_verified").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("testimonials_status_idx").on(table.status)]
);

// ─── Social Links ─────────────────────────────────────────
export const socialLinks = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  label: text("label"),
  color: text("color"),
  size: text("size").default("md"),
  style: text("style").default("default"),
  placements: jsonb("placements").$type<string[]>().default(["footer", "contact"]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  status: statusEnum("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Contact Messages ────────────────────────────────────
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    phone: text("phone"),
    company: text("company"),
    messageStatus: messageStatusEnum("message_status").notNull().default("unread"),
    consentGiven: boolean("consent_given").notNull().default(false),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("messages_status_idx").on(table.messageStatus)]
);

// ─── Site Settings ────────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  group: text("group").notNull().default("general"),
  label: text("label"),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Navigation ───────────────────────────────────────────
export const navigation = pgTable("navigation", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon"),
  color: text("color"),
  badge: text("badge"),
  style: text("style").default("default"),
  isExternal: boolean("is_external").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  status: statusEnum("status").notNull().default("published"),
  group: text("group").notNull().default("main"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Website Sections ─────────────────────────────────────
export const websiteSections = pgTable(
  "website_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionKey: text("section_key").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    badge: text("badge"),
    description: text("description"),
    content: text("content"),
    componentType: text("component_type").notNull().default("builtin"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("published"),
    styles: jsonb("styles").$type<Record<string, unknown> | null>(),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sections_status_idx").on(table.status),
    index("sections_sort_order_idx").on(table.sortOrder),
  ]
);

// ─── SEO Metadata ─────────────────────────────────────────
export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    page: text("page").notNull().unique(),
    title: text("title"),
    description: text("description"),
    keywords: jsonb("keywords").$type<string[]>().default([]),
    ogImage: text("og_image"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    structuredData: jsonb("structured_data"),
    canonicalUrl: text("canonical_url"),
    noIndex: boolean("no_index").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("seo_page_idx").on(table.page)]
);

// ─── Legal Documents ──────────────────────────────────────
export const legalDocuments = pgTable(
  "legal_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    version: text("version").notNull().default("1.0"),
    effectiveDate: timestamp("effective_date", { withTimezone: true }),
    isReviewRequired: boolean("is_review_required").notNull().default(true),
    status: statusEnum("status").notNull().default("draft"),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("legal_slug_idx").on(table.slug)]
);

// ─── Legal Version History ────────────────────────────────
export const legalVersionHistory = pgTable("legal_version_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => legalDocuments.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  content: text("content").notNull(),
  changedBy: uuid("changed_by").references(() => adminUsers.id),
  changeNote: text("change_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Consent Records ─────────────────────────────────────
export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    consentGiven: boolean("consent_given").notNull(),
    preferences: jsonb("preferences"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [index("consent_type_idx").on(table.type)]
);

// ─── Media Assets ─────────────────────────────────────────
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    caption: text("caption"),
    width: integer("width"),
    height: integer("height"),
    folder: text("folder").default("general"),
    copyright: text("copyright"),
    license: text("license"),
    attribution: text("attribution"),
    uploadedBy: uuid("uploaded_by").references(() => adminUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("media_folder_idx").on(table.folder)]
);

// ─── Audit Log ────────────────────────────────────────────
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => adminUsers.id),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    details: jsonb("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_user_idx").on(table.userId),
    index("audit_entity_idx").on(table.entity),
    index("audit_created_idx").on(table.createdAt),
  ]
);

// ─── Relations ────────────────────────────────────────────
export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  project: one(projects, {
    fields: [testimonials.projectId],
    references: [projects.id],
  }),
}));

export const legalVersionHistoryRelations = relations(
  legalVersionHistory,
  ({ one }) => ({
    document: one(legalDocuments, {
      fields: [legalVersionHistory.documentId],
      references: [legalDocuments.id],
    }),
    changedByUser: one(adminUsers, {
      fields: [legalVersionHistory.changedBy],
      references: [adminUsers.id],
    }),
  })
);

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  uploadedByUser: one(adminUsers, {
    fields: [mediaAssets.uploadedBy],
    references: [adminUsers.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(adminUsers, {
    fields: [auditLog.userId],
    references: [adminUsers.id],
  }),
}));

