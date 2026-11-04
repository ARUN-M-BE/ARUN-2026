export const STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  UNPUBLISHED: "unpublished",
} as const;

export const MESSAGE_STATUS = {
  UNREAD: "unread",
  READ: "read",
  REPLIED: "replied",
  ARCHIVED: "archived",
  SPAM: "spam",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const DPDP_CONFIG = {
  DEFAULT_RETENTION_DAYS: 365,
  CONSENT_VALIDITY_DAYS: 365,
  JURISDICTION: "India (DPDP Act 2023 & IT Act 2000)",
} as const;

export type ActionResult<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};
