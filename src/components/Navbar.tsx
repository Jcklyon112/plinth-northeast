import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setScrolled(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="content-max flex items-center justify-end h-16 md:h-20">
        <div className="flex items-center gap-8">
          <Link
            to="/models"
            className="small-label text-foreground transition-colors"
          >
            Models
          </Link>
          <Link
            to="/about"
            className="small-label text-foreground transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
