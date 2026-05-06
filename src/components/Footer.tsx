import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="section-dark border-t border-border">
      <div className="content-max py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <p className="display-heading text-xl mb-4 text-foreground">Plinth</p>
            <p className="text-muted-foreground text-sm">hello@plinth.com</p>
            <p className="text-muted-foreground text-sm">(631) 555-0100</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/models" className="mono-label text-muted-foreground hover:text-foreground transition-colors">
              Models
            </Link>
            <Link to="/about" className="mono-label text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          <div>
            <p className="mono-label text-muted-foreground mb-3">SERVING</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Northeast US — Long Island, the Hamptons, Connecticut shoreline, Hudson Valley, and select Vermont and New Hampshire markets
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <p className="mono-label text-muted-foreground">© 2026 PLINTH · BUILT IN NEW YORK</p>
        </div>
      </div>
    </footer>
  );
}
