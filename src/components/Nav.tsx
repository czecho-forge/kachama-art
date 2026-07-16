import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/concept", label: "CONCEPT" },
  { to: "/artist", label: "ARTIST" },
  { to: "/projects", label: "PROJECTS" },
  { to: "/journal", label: "JOURNAL" },
  { to: "/contact", label: "CONTACT" },
];

export default function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Kachama" className="h-12 w-auto" />
        </NavLink>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm tracking-widest">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "pb-1 text-muted-foreground transition-colors hover:text-primary",
                  isActive &&
                    "border-b border-primary text-foreground hover:text-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
