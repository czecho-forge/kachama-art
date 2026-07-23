import { useEffect } from "react";

const SITE_URL = "https://studiokachama.com";
const DEFAULT_IMAGE = "/images/home/home-6.jpg";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Updates the same tags declared statically in index.html (rather than
// rendering new ones via JSX) so a single set of tags always exists in the
// DOM, since index.html's <head> lives outside the React root and isn't
// deduplicated against by React's own tag hoisting.
export default function Seo({ title, description, path, image = DEFAULT_IMAGE }: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const absImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    document.title = title;
    setMeta("name", "description", description);
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", absImage);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absImage);
  }, [title, description, path, image]);

  return null;
}
