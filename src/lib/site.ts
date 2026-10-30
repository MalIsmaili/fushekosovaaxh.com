/** Public address of the live site, used for metadata, the sitemap and robots.txt. */
export const SITE_URL = (process.env.SITE_URL || "https://www.fushekosovaaxh.com").replace(/\/$/, "");

/** Base URL for links sent in emails: the live site in production, the local server in dev. */
export function appUrl() {
  if (process.env.NODE_ENV === "production") return SITE_URL;
  return (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}
