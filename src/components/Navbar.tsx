import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="content-max flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="display-heading text-sm tracking-widest uppercase text-foreground">
            *PLINTH-LABS
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/#intelligence"
              className="mono-label text-muted-foreground hover:text-foreground transition-colors"
            >
              *Plinth-Intelligence
            </Link>
            <Link
              to="/models"
              className="mono-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Models
            </Link>
            <Link
              to="/#faq"
              className="mono-label text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/#contact"
              className="mono-label border border-foreground text-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-5 h-px bg-foreground transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-foreground transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-foreground transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start gap-8 pt-24 px-6">
          <Link to="/#intelligence" className="display-heading text-3xl text-foreground">
            *Plinth-Intelligence
          </Link>
          <Link to="/models" className="display-heading text-3xl text-foreground">
            Models
          </Link>
          <Link to="/#faq" className="display-heading text-3xl text-foreground">
            FAQ
          </Link>
          <Link
            to="/#contact"
            className="mono-label border border-foreground text-foreground px-6 py-3 mt-4"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
