import { renderHtml } from "./renderHtml";

export default {
  async fetch(request, env) {
    const stmt = env.DB.prepare("SELECT * FROM comments LIMIT 3");
    const { results } = await stmt.all();

    const html = renderHtml(JSON.stringify(results, null, 2));
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        // Basic hardening headers
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "referrer-policy": "no-referrer",
        // CSP allows our known external assets used in renderHtml
        "content-security-policy": [
          "default-src 'self'",
          "script-src 'none'",
          "style-src 'self' https://static.integrations.cloudflare.com 'unsafe-inline'",
          "img-src 'self' https://imagedelivery.net data:",
          "base-uri 'none'",
          "object-src 'none'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    });
  },
} satisfies ExportedHandler<Env>;
