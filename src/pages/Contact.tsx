export default function Contact() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
        CONTACT
      </h1>
      <p className="mt-4 text-sm uppercase tracking-widest text-muted-foreground">
        Showroom · By Appointment Only
      </p>
      <p className="mt-8 text-lg text-muted-foreground">
        If you would like to visit Kachama's showroom, or have questions about
        available work, collaborations, or any other inquiry, please send a
        message through this form.
      </p>

      <form
        className="mt-12 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = "mailto:kachama.art@gmail.com";
        }}
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
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
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
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
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Send
        </button>
      </form>

      <p className="mt-12 text-sm text-muted-foreground">
        Or email directly at{" "}
        <a
          href="mailto:kachama.art@gmail.com"
          className="text-foreground underline underline-offset-4"
        >
          kachama.art@gmail.com
        </a>
      </p>
    </section>
  );
}
