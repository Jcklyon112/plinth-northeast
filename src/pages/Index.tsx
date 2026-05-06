import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ModelModal from "@/components/ModelModal";
import { models } from "@/data/models";
import heroHeader from "@/assets/hero-header.png";

export default function Index() {
  const [modalModel, setModalModel] = useState<typeof models[0] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar />
      {/* ——— HERO IMAGE ——— */}
      <section className="relative w-full" style={{ height: "100vh" }}>
        <img
          src={heroHeader}
          alt="Plinth ADU units in a forest setting"
          className="absolute -top-[16%] left-0 w-full h-[116%] object-cover"
        />
        {/* Brand mark — upper left, black text, no banner */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[60]">
          <span
            className="display-heading text-foreground"
            style={{ fontSize: "clamp(14px, 1.6vw, 20px)", letterSpacing: "0.04em" }}
          >
            *PLINTH-HOME
          </span>
        </div>
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 z-10 max-w-[720px]">
          <h1
            className="display-heading text-white"
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              lineHeight: 1,
              marginBottom: "20px",
            }}
          >
            Plinth-Home
          </h1>
          <p
            className="text-white/80 max-w-[560px]"
            style={{
              fontSize: "clamp(14px, 1.6vw, 18px)",
              lineHeight: 1.45,
              marginBottom: "24px",
            }}
          >
            Your land is worth more than you think. We make adding a dwelling to it as simple as entering your address — permits, build, and delivery, all handled.
          </p>
          <a
            href="#contact"
            className="small-label inline-block text-white border border-white/60 px-6 py-3 hover:bg-white hover:text-foreground transition-colors"
          >
            Feasibility study
          </a>
        </div>
      </section>


      {/* ——— SECTION 2: THE OPPORTUNITY ——— */}
      <section className="section-dark">
        <div className="content-max py-24 md:py-40">
          <AnimatedSection>
            <p className="small-label mb-4" style={{ color: "hsl(var(--dark-muted))" }}>*PLINTH-LABS</p>
            <h2
              className="display-heading mb-12"
              style={{
                color: "hsl(var(--dark-fg))",
                fontSize: "clamp(36px, 5vw, 72px)",
              }}
            >
              The Opportunity.
            </h2>
            <p
              className="max-w-[960px] leading-relaxed"
              style={{
                color: "hsl(var(--dark-fg))",
                fontSize: "clamp(20px, 2.8vw, 32px)",
                lineHeight: 1.45,
              }}
            >
              Most homeowners never realize what their property is actually capable of. Our intelligence layer scans your parcel against zoning, setbacks, utilities, and environmental constraints — then tells you exactly what you can build, where it fits, and what it's worth. From there, we manage the entire process: permits, manufacturing, and delivery.{" "}
              <span style={{ color: "hsl(var(--dark-muted))" }}>
                One platform, from address to dwelling.
              </span>
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20 md:mt-32">
              {[
                { stat: "$60K+", desc: "in average annual rental income from a permitted ADU in the Northeast." },
                { stat: "30%", desc: "average property value lift from adding a permitted accessory dwelling." },
                { stat: "8M+", desc: "single-family parcels with backyard space large enough for an ADU." },
                { stat: "<48 hrs", desc: "to know whether your property qualifies — at no cost." },
              ].map((item) => (
                <div key={item.stat}>
                  <p
                    className="display-heading mb-3"
                    style={{
                      color: "hsl(var(--dark-fg) / 0.5)",
                      fontSize: "clamp(28px, 4vw, 56px)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.stat}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: "hsl(var(--dark-muted))" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ——— SECTION 3: HOW IT WORKS ——— */}
      <section className="section-light">
        <div className="content-max py-24 md:py-40">
          <AnimatedSection>
            <p className="small-label text-muted-foreground mb-6">HOW IT WORKS</p>
            <h2 className="display-heading text-foreground mb-20 md:mb-28" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              Four steps. The hard one is ours.
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {/* Step 01 */}
            <AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 py-8 border-t border-border">
                <p className="display-heading text-3xl text-foreground/20">01</p>
                <div>
                  <p className="small-label text-muted-foreground mb-3">PICK A MODEL</p>
                  <p className="text-foreground max-w-[520px]">Three signature designs. One conversation to lock pricing and finishes.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 02 — THE HERO STEP */}
            <AnimatedSection>
              <div className="py-12 md:py-16 border-t border-border" style={{ background: "hsl(var(--dark-bg))", margin: "0 -24px", padding: "48px 24px" }}>
                <div className="md:ml-[120px] md:pl-8">
                  <p className="display-heading text-5xl md:text-7xl text-primary-foreground/20 mb-2">02</p>
                  <p className="small-label mb-4" style={{ color: "hsl(var(--accent))" }}>WE HANDLE PERMITS</p>
                  <h3 className="display-heading text-2xl md:text-3xl mb-6" style={{ color: "hsl(var(--dark-fg))" }}>
                    This is the step that kills most projects. It's the one we built our company around.
                  </h3>
                  <p className="max-w-[520px] leading-relaxed" style={{ color: "hsl(var(--dark-muted))" }}>
                    Plinth manages the full permit application across municipal, state, and utility review. You don't talk to your town. You don't fill out forms. You don't wait on hold. We do.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 03 */}
            <AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 py-8 border-t border-border">
                <p className="display-heading text-3xl text-foreground/20">03</p>
                <div>
                  <p className="small-label text-muted-foreground mb-3">BUILT IN-FACTORY</p>
                  <p className="text-foreground max-w-[520px]">Your unit is manufactured at our partner facility in upstate New York while permits process in parallel.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 04 */}
            <AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 py-8 border-t border-border border-b">
                <p className="display-heading text-3xl text-foreground/20">04</p>
                <div>
                  <p className="small-label text-muted-foreground mb-3">DELIVERED ON-SITE</p>
                  <p className="text-foreground max-w-[520px]">Fully built, delivered, connected. Certificate of occupancy in hand.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <p className="text-muted-foreground mt-12 text-sm">
                Total typical timeline — 22 to 28 weeks. About a third of the time of a custom build.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ——— SECTION 4: MODELS HORIZONTAL SCROLL ——— */}
      <section className="section-dark">
        <div className="py-24 md:py-40">
          <div className="content-max mb-12">
            <AnimatedSection>
              <p className="small-label mb-6" style={{ color: "hsl(var(--dark-muted))" }}>THE LINEUP</p>
              <h2 className="display-heading mb-4" style={{ color: "hsl(var(--dark-fg))", fontSize: "clamp(36px, 5vw, 64px)" }}>
                Three models.
              </h2>
              <p style={{ color: "hsl(var(--dark-muted))" }}>Refined with our manufacturer. Engineered for the Northeast.</p>
            </AnimatedSection>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {models.map((model) => (
              <div
                key={model.id}
                className="snap-start shrink-0"
                style={{ width: "min(80vw, 900px)" }}
              >
                <div className="aspect-[16/10] overflow-hidden mb-6">
                  <img src={model.image} alt={model.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="small-label mb-2" style={{ color: "hsl(var(--dark-muted))" }}>MODEL {model.number}</p>
                <h3 className="display-heading text-2xl md:text-3xl mb-2" style={{ color: "hsl(var(--dark-fg))" }}>{model.title}</h3>
                <p className="text-sm mb-2" style={{ color: "hsl(var(--dark-muted))" }}>{model.specLine}</p>
                <p className="display-heading text-lg mb-4" style={{ color: "hsl(var(--dark-fg))" }}>{model.price}</p>
                <button
                  onClick={() => setModalModel(model)}
                  className="small-label transition-colors inline-block border-b pb-0.5"
                  style={{ color: "hsl(var(--dark-fg))", borderColor: "hsl(var(--dark-fg) / 0.4)" }}
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SECTION 5: WHAT WE CHARGE FOR ——— */}
      <section className="section-light">
        <div className="content-max py-24 md:py-40">
          <AnimatedSection>
            <p className="small-label text-muted-foreground mb-6">WHAT WE CHARGE FOR</p>
            <h2 className="display-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              We don't hide pricing.
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {[
              { label: "FEASIBILITY REPORT", price: "$2,500", desc: "Site analysis, zoning compliance, permit pathway. Yours to keep." },
              { label: "THE UNIT", price: "From $189,000", desc: "Base unit price by model. Fixed at signing." },
              { label: "PERMIT MANAGEMENT", price: "$8,500 – $15,000", desc: "We handle every application, review, and approval. Priced by your town." },
              { label: "DELIVERY & PROJECT MANAGEMENT", price: "Variable", desc: "Site work, foundation, delivery coordination, finishing." },
            ].map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 80}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_1fr] gap-2 md:gap-8 py-6 border-t border-border items-baseline">
                  <p className="small-label text-muted-foreground">{item.label}</p>
                  <p className="display-heading text-xl text-foreground">{item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
            <hr className="border-border" />
          </div>
        </div>
      </section>

      {/* ——— SECTION 6: APPROACH ——— */}
      <section className="section-dark">
        <div className="content-max py-24 md:py-40">
          <AnimatedSection>
            <p className="small-label mb-6" style={{ color: "hsl(var(--dark-muted))" }}>APPROACH</p>
            <h2 className="display-heading mb-16 md:mb-24" style={{ color: "hsl(var(--dark-fg))", fontSize: "clamp(32px, 5vw, 56px)" }}>
              Designed for the Northeast.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                title: "BUILT FOR THE CLIMATE",
                body: "Insulation, structural specs, and rooflines designed for Northeast winters and humidity. Not a Sun Belt design dropped onto Long Island.",
              },
              {
                title: "PERMITS WITHOUT THE HEADACHE",
                body: "Our permit team has worked through dozens of Northeast municipalities. We know which towns approve what, what they ask for, and how to move applications without delay.",
              },
              {
                title: "PRICED IN THE OPEN",
                body: "We publish starting prices. We tell you what's included. We give you a full delivered cost before you sign anything.",
              },
            ].map((block) => (
              <AnimatedSection key={block.title}>
                <p className="small-label mb-4" style={{ color: "hsl(var(--dark-muted))" }}>{block.title}</p>
                <p className="leading-relaxed" style={{ color: "hsl(var(--dark-muted))" }}>{block.body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SECTION 7: MANUFACTURING ——— */}
      <section className="section-light">
        <div className="content-max py-24 md:py-40">
          <AnimatedSection>
            <p className="small-label text-muted-foreground mb-6">MANUFACTURING</p>
            <h2 className="display-heading text-foreground mb-8" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              Built in upstate New York.
            </h2>
            <p className="reading-column text-muted-foreground leading-relaxed">
              Every Plinth unit is built at our manufacturer's facility in upstate New York. Factory-controlled conditions, consistent materials, quality standards that don't exist on a typical job site. Then delivered, fully built, to your property.
            </p>
          </AnimatedSection>
          {/* Facility photo placeholder */}
          <div className="mt-16 aspect-[21/9] bg-muted" />
        </div>
      </section>

      {/* ——— SECTION 8: CONTACT ——— */}
      <section id="contact" className="section-dark">
        <div className="content-max py-24 md:py-40">
          <div className="max-w-[560px]">
            <AnimatedSection>
              <h2 className="display-heading mb-4" style={{ color: "hsl(var(--dark-fg))", fontSize: "clamp(32px, 5vw, 48px)" }}>
                Tell us about your property.
              </h2>
              <p className="mb-12" style={{ color: "hsl(var(--dark-muted))" }}>
                We'll come back within 48 hours with what's possible.
              </p>
            </AnimatedSection>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />

      {modalModel && (
        <ModelModal model={modalModel} onClose={() => setModalModel(null)} />
      )}
    </>
  );
}
