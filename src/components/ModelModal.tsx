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
        {/* Close button */}
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

        {/* Section A: Hero */}
        <div className="relative h-[70vh] min-h-[400px]">
          <img
            src={model.image}
            alt={model.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
            <p className="mono-label text-muted-foreground mb-3">MODEL {model.number}</p>
            <h2 className="display-heading text-4xl md:text-6xl text-foreground mb-3">{model.title}</h2>
            <p className="mono-label text-muted-foreground mb-2">{model.specLine}</p>
            <p className="display-heading text-xl text-foreground">{model.price}</p>
          </div>
        </div>

        {/* Section B: Description */}
        <div className="section-dark section-padding">
          <div className="content-max">
            <p className="reading-column mx-auto text-center text-lg text-muted-foreground leading-relaxed">
              {model.description}
            </p>
          </div>
        </div>

        {/* Section C: Specifications */}
        <div className="section-light section-padding">
          <div className="content-max max-w-[800px] mx-auto">
            <p className="mono-label text-light-muted mb-10">SPECIFICATIONS</p>
            <div className="space-y-0">
              {model.specs.map((spec) => (
                <div key={spec.label} className="flex flex-col md:flex-row md:justify-between py-4 border-b" style={{ borderColor: "hsl(var(--light-border))" }}>
                  <span className="mono-label" style={{ color: "hsl(var(--light-muted))" }}>{spec.label}</span>
                  <span className="text-sm mt-1 md:mt-0" style={{ color: "hsl(var(--light-fg))" }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section D: Pricing */}
        <div className="section-dark section-padding">
          <div className="content-max max-w-[800px] mx-auto">
            <p className="mono-label text-muted-foreground mb-10">PRICING</p>
            <div className="space-y-0">
              {model.pricing.map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-col md:flex-row md:justify-between py-4 border-b border-border ${
                    item.emphasized ? "py-6" : ""
                  }`}
                >
                  <span className="mono-label text-muted-foreground">{item.label}</span>
                  <span
                    className={`mt-1 md:mt-0 ${
                      item.emphasized ? "display-heading text-xl text-foreground" : "text-sm text-foreground"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section E: Gallery */}
        <div className="section-dark py-8 md:py-16">
          <div className="content-max">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {model.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img}
                    alt={`${model.title} gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section F: CTA */}
        <div className="section-dark section-padding text-center">
          <div className="content-max">
            <h3 className="display-heading text-2xl md:text-4xl text-foreground mb-8">
              Reserve a consultation for {model.title}
            </h3>
            <button
              onClick={scrollToContact}
              className="mono-label bg-primary text-primary-foreground px-8 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
