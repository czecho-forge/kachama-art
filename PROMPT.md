# Fable 5 Prompt — Kachama Art Website Enhancement

I'm enhancing the live website for Kachama Perez, a Chiang Mai-based textile
artist, at kachama.art (React + Vite + TypeScript + Tailwind + Sanity CMS,
deployed on Netlify — code is in this repo, don't change the stack). The goal
is for the site to earn worldwide attention from three audiences at once:
galleries and curators who might exhibit or represent her, collectors and
interior designers sourcing statement textile art, and the general
art-loving public who discovers and shares her story. Success looks like
inbound inquiries from galleries/collectors, not e-commerce — there is no
cart or checkout to build.

Who she is, for context (verified, don't invent beyond this): Kachama was
born in Bangkok, trained at Tokyo Mode College in the early 1990s and worked
three years in Japan, then settled in Chiang Mai where she encountered
hill-tribe textile traditions and took up weaving. She weaves with silk warp
plus metals, feathers, bamboo, and even dried food depending on the piece,
and sometimes juxtaposes antique hill-tribe fabrics from different
provinces in a single work. Her pieces are held by the Textile Museum in
Lyon (France, acquired after a 2008 exhibition), the Hong Kong Museum
Textiles Society, and the National Handicrafts and Hill Tribes Center in
Taiwan. She's been commissioned by Sindhorn Midtown Hotel Bangkok, Tamarind
Village and Oasis Baan Sean Doi in Chiang Mai, Rayavadee Resort in Krabi,
the residence of the German Ambassador in Bangkok, WOHA architectural
practice and Crowne Plaza Changi Airport in Singapore. She's been featured
at Tootyung Art Center, in a "Lanna Spirit" duo exhibition, and on the
ArtsWork podcast. The existing Artist.tsx bio and Projects.tsx exhibition
list in the repo are accurate — treat them as ground truth, and extend
them with the museum/press facts above rather than replacing what's there.

The story should stay centered on Kachama as one continuous narrative — her
journey from Bangkok to Tokyo to Chiang Mai, her philosophy of being "an
inheritor of a tradition that carries the wisdom of the ancestors" (already
quoted on the Artist page) — but each major installation or museum
acquisition deserves its own well-told moment rather than being listed as a
bare fact, since most of her work lives in genuinely notable places.

What I want from you:
- Make the site feel worthy of a gallery representing her internationally —
  the visual craft should match the caliber of the museums and venues her
  work is already in.
- Give galleries/curators and collectors an obvious, low-friction way to
  reach out (a real inquiry path, not just a generic contact form) — this
  is a lead-gen site, not a shop.
- Weave the museum holdings and notable commissions into the narrative
  (Artist page, and/or a press/recognition section) with enough specificity
  to read as credible, not name-dropped.
- Keep the SEO and structured-data work already in place (Seo component,
  JSON-LD) intact and extend it to cover any new content.
- Preserve accessibility and mobile-first performance — most international
  discovery will happen on a phone.

Before writing code, propose 3-4 distinct visual directions for how the
site could look and feel (each as: a one-line mood description, palette,
and typography choice, tied to her actual materials and story — e.g. one
inspired by raw silk and natural fiber tones, one inspired by the
hill-tribe textile patterns themselves). Let me pick a direction, then
implement it fully rather than half-applying it.

Don't add e-commerce, don't change the deploy setup, and don't invent
biographical details, exhibitions, or press beyond what's listed above and
in the repo's existing content.
