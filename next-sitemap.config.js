/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: false, // We have dynamic app/robots.ts
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    additionalSitemaps: [],
  },
};
