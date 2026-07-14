import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "@/components/Nav";
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
        <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Kachama Perez · Weaving of Art · Chiang
          Mai, Thailand
        </footer>
      </div>
    </BrowserRouter>
  );
}
