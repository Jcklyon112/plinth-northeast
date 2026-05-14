import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="section-light">
      <div className="content-max py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <p className="display-heading text-lg text-foreground mb-4">PLINTH</p>
            <a href="mailto:hello@plinth.co" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] block mb-1">
              hello@plinth.co
            </a>
            <a href="tel:+16315551234" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] block">
              (631) 555-1234
            </a>
          </div>
          <div>
            <Link to="/models" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] block mb-2">
              Models
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] block">
              About
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Serving the Northeast US — Long Island, the Hamptons, Connecticut shoreline, Hudson Valley, and select Vermont and New Hampshire markets.
            </p>
          </div>
        </div>
        <hr className="my-12 border-border" />
        <p className="text-sm text-muted-foreground">© 2026 Plinth · Built in New York</p>
      </div>
    </footer>
  );
}
