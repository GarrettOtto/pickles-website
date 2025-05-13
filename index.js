// This is a minimal entry point for Cloudflare Pages
// Since this is a static site, we don't need any server-side logic
// All routing is handled by the _redirects file

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
