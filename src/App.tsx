import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Nav from "@/components/Nav";
import WeaveDivider from "@/components/WeaveDivider";
import Home from "@/pages/Home";
import Concept from "@/pages/Concept";
import Artist from "@/pages/Artist";
import Projects from "@/pages/Projects";
import Journal from "@/pages/Journal";
import JournalPost from "@/pages/JournalPost";
import Contact from "@/pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/concept" element={<Concept />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalPost />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="weave-texture bg-indigo text-indigo-foreground">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <WeaveDivider onIndigo />
            <div className="mt-10 flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-2xl">Kachama</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-indigo-foreground/70">
                  Handwoven wall hangings and textile art from Chiang Mai,
                  Thailand. Showroom visits by appointment.
                </p>
              </div>
              <nav
                aria-label="Footer"
                className="flex flex-col gap-2 text-sm tracking-widest"
              >
                <Link
                  to="/projects"
                  className="transition-colors hover:text-indigo-foreground/70"
                >
                  PROJECTS
                </Link>
                <Link
                  to="/artist"
                  className="transition-colors hover:text-indigo-foreground/70"
                >
                  ARTIST
                </Link>
                <Link
                  to="/journal"
                  className="transition-colors hover:text-indigo-foreground/70"
                >
                  JOURNAL
                </Link>
              </nav>
              <div className="text-sm">
                <p className="tracking-widest text-indigo-foreground/70">
                  INQUIRIES
                </p>
                <p className="mt-2 text-indigo-foreground/70">
                  Galleries, curators & collectors —{" "}
                  <Link
                    to="/contact"
                    className="underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-indigo-foreground"
                  >
                    start here
                  </Link>
                </p>
              </div>
            </div>
            <p className="mt-12 text-center text-xs text-indigo-foreground/50">
              © {new Date().getFullYear()} Kachama Perez · Weaving of Art ·
              Chiang Mai, Thailand
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
