import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import WeaveDivider from "@/components/WeaveDivider";
import { cn } from "@/lib/utils";

const EMAIL = "kachama.art@gmail.com";

const intents = [
  {
    id: "gallery",
    label: "Galleries & Curators",
    subject: "Gallery / exhibition inquiry",
    blurb:
      "Exhibitions, representation, museum loans, and institutional projects.",
  },
  {
    id: "collector",
    label: "Collectors & Designers",
    subject: "Collector / commission inquiry",
    blurb:
      "Acquiring available work, or commissioning a piece for a home, hotel, or public space.",
  },
  {
    id: "general",
    label: "Press & General",
    subject: "Inquiry",
    blurb: "Interviews, features, studio visits, and everything else.",
  },
] as const;

type IntentId = (typeof intents)[number]["id"];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("intent");
  const [intent, setIntent] = useState<IntentId>(
    intents.some((i) => i.id === initial) ? (initial as IntentId) : "gallery"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");

  const active = intents.find((i) => i.id === intent)!;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `${active.subject} — ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization && `Organization: ${organization}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <Seo
        title="Contact — Gallery, Collector & Commission Inquiries | Kachama Art"
        description="Contact Kachama Art for gallery representation, exhibitions, collecting a handwoven wall hanging, custom commissions, or a showroom visit in Chiang Mai — by appointment."
        path="/contact"
      />
      <h1 className="text-center font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Contact
      </h1>
      <WeaveDivider className="mt-6" />
      <p className="mt-4 text-center text-sm uppercase tracking-widest text-muted-foreground">
        Showroom · Chiang Mai · By Appointment
      </p>

      {/* Intent selector */}
      <fieldset className="mt-12">
        <legend className="sr-only">What is your inquiry about?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {intents.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setIntent(i.id)}
              aria-pressed={intent === i.id}
              className={cn(
                "rounded-md border px-4 py-3 text-sm font-medium transition-colors",
                intent === i.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {i.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {active.blurb}
        </p>
      </fieldset>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label htmlFor="organization" className="block text-sm font-medium">
            Gallery / Organization{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
        >
          Send Inquiry
        </button>
        <p className="text-xs text-muted-foreground">
          Sending opens your email app with the message prepared — nothing is
          stored on this site.
        </p>
      </form>

      <div className="mt-14 rounded-md bg-secondary px-6 py-8 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">What to expect</p>
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          <li>Every serious inquiry receives a reply.</li>
          <li>
            Studio and showroom visits in Chiang Mai are welcomed by
            appointment.
          </li>
          <li>
            Galleries and curators: images and exhibition history are available
            on request.
          </li>
        </ul>
        <p className="mt-5">
          Or email directly at{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary underline underline-offset-4"
          >
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
