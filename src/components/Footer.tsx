export default function Footer() {
  return (
    <footer className="section-dark">
      <div className="content-max py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-16">
          <div>
            <h3 className="display-heading text-lg text-foreground mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
          <div>
            <h3 className="display-heading text-lg text-foreground mb-4">Headquarters</h3>
            <p className="text-sm text-muted-foreground">200 Division Street</p>
            <p className="text-sm text-muted-foreground">Sag Harbor, New York</p>
          </div>
          <div>
            <h3 className="display-heading text-lg text-foreground mb-4">Contact</h3>
            <a href="mailto:business@plinth-labs.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              business@plinth-labs.com
            </a>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 *Plinth-Labs LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
