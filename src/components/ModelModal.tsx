import { useEffect } from "react";
import type { PlinthModel } from "@/data/models";

interface Props {
  model: PlinthModel;
  onClose: () => void;
}

export default function ModelModal({ model, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      <div
        className="relative w-full h-full overflow-y-auto modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center text-foreground hover:text-accent transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="18" y2="18" />
            <line x1="18" y1="2" x2="2" y2="18" />
          </svg>
        </button>

        {/* Hero */}
        <div className="relative h-[70vh] min-h-[400px]">
          <img src={model.image} alt={model.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
            <p className="small-label text-white/60 mb-3">MODEL {model.number}</p>
            <h2 className="display-heading text-4xl md:text-6xl text-white mb-3">{model.title}</h2>
            <p className="small-label text-white/60 mb-2">{model.specLine}</p>
            <p className="display-heading text-xl text-white">{model.price}</p>
          </div>
        </div>

        {/* Description */}
        <div className="section-light py-16 md:py-24">
          <div className="content-max max-w-[680px]">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {model.description}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="section-dark py-16 md:py-24">
          <div className="content-max max-w-[800px]">
            <p className="small-label mb-10" style={{ color: "hsl(var(--dark-muted))" }}>SPECIFICATIONS</p>
            <div className="space-y-0">
              {model.specs.map((spec) => (
                <div key={spec.label} className="flex flex-col md:flex-row md:justify-between py-4 border-b" style={{ borderColor: "hsl(var(--dark-border))" }}>
                  <span className="small-label" style={{ color: "hsl(var(--dark-muted))" }}>{spec.label}</span>
                  <span className="text-sm mt-1 md:mt-0" style={{ color: "hsl(var(--dark-fg))" }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="section-light py-16 md:py-24">
          <div className="content-max max-w-[800px]">
            <p className="small-label text-muted-foreground mb-10">PRICING</p>
            <div className="space-y-0">
              {model.pricing.map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-col md:flex-row md:justify-between py-4 border-b border-border ${item.emphasized ? "py-6" : ""}`}
                >
                  <span className="small-label text-muted-foreground">{item.label}</span>
                  <span className={`mt-1 md:mt-0 ${item.emphasized ? "display-heading text-xl text-foreground" : "text-sm text-foreground"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="section-light py-8 md:py-16">
          <div className="content-max">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {model.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt={`${model.title} gallery ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="section-light py-16 md:py-24">
          <div className="content-max">
            <h3 className="display-heading text-2xl md:text-4xl text-foreground mb-8">
              Start permitting for {model.title}
            </h3>
            <button
              onClick={scrollToContact}
              className="small-label bg-primary text-primary-foreground px-8 py-3 hover:bg-accent transition-colors"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
