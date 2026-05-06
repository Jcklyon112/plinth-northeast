import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ModelModal from "@/components/ModelModal";
import { models } from "@/data/models";
import heroHeader from "@/assets/hero-header.png";
import backyardImg from "@/assets/backyard-deployment.png";
import clusterImg from "@/assets/cluster-deployment.png";

const BODY_TEXT = "Most homeowners never realize what their property is actually capable of. Our intelligence layer scans your parcel against zoning, setbacks, utilities, and environmental constraints — then tells you exactly what you can build, where it fits, and what it's worth. From there, we manage the entire process: permits, manufacturing, and delivery.";
const ACCENT_TEXT = "One platform, from address to dwelling.";
const ALL_WORDS = [...BODY_TEXT.split(" "), ...ACCENT_TEXT.split(" ")];
const ACCENT_START = BODY_TEXT.split(" ").length;

function ScrollRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const rawProgress = (viewportHeight - rect.top) / (sectionHeight + viewportHeight);
    setProgress(Math.max(0, Math.min(1, rawProgress)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalWords = ALL_WORDS.length;

  return (
    <section ref={sectionRef} className="section-dark">
      <div className="px-6 md:px-12 py-24 md:py-40" style={{ maxWidth: "1400px" }}>
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
          style={{
            fontSize: "clamp(20px, 2.8vw, 32px)",
            lineHeight: 1.45,
            maxWidth: "960px",
          }}
        >
          {ALL_WORDS.map((word, i) => {
            const wordProgress = (progress - 0.15) / 0.55;
            const wordThreshold = i / totalWords;
            const isLit = wordProgress > wordThreshold;
            const isAccent = i >= ACCENT_START;

            return (
              <span
                key={i}
                style={{
                  color: isLit
                    ? isAccent
                      ? "hsl(var(--dark-muted))"
                      : "hsl(var(--dark-fg))"
                    : "hsl(var(--dark-fg) / 0.15)",
                  transition: "color 0.2s ease-out",
                }}
              >
                {word}{" "}
              </span>
            );
          })}
        </p>

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
      </div>
    </section>
  );
}

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Study",
    heading: "Know What's Possible Before You Commit.",
    body: "We analyze your parcel — zoning, setbacks, utility access, and financial projections — so you have a clear picture of what can be built, what it will cost, and what it will earn. No guesswork, no surprises.",
  },
  {
    number: "02A",
    title: "Permit",
    heading: "We Handle the Part That Stops Everyone Else.",
    body: "Permitting is where most ADU projects die. Plinth manages every submission, every agency response, and every approval milestone. You never call the building department.",
    isOurs: true,
  },
  {
    number: "02B",
    title: "Build",
    heading: "Your Unit Builds While Permits Process.",
    body: "Traditional construction waits for permits. Ours doesn't. Manufacturing runs in parallel — so by the time your permit is approved, your unit is ready to ship.",
  },
  {
    number: "03",
    title: "Install",
    heading: "From Flatbed to Front Door.",
    body: "Plinth coordinates delivery, site prep, crane logistics, utility connections, and final inspections.",
  },
];

function ProcessStepsSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section-dark">
      <div className="px-6 md:px-12 py-24 md:py-40" style={{ maxWidth: "1400px" }}>
        <AnimatedSection>
          <h2
            className="display-heading mb-20 md:mb-32"
            style={{
              color: "hsl(var(--dark-fg))",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            Four steps. The hard one is ours.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          {/* Step headers — 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  className="text-left group cursor-pointer"
                >
                  <p
                    className="display-heading mb-2"
                    style={{
                      fontSize: "clamp(40px, 6vw, 80px)",
                      color: isActive
                        ? "hsl(var(--dark-fg))"
                        : "hsl(var(--dark-fg) / 0.2)",
                      fontWeight: isActive ? 700 : 400,
                      transition: "color 0.3s, font-weight 0.3s",
                    }}
                  >
                    {step.number}
                  </p>
                  <p
                    className="display-heading"
                    style={{
                      fontSize: "clamp(24px, 4vw, 56px)",
                      color: isActive
                        ? "hsl(var(--dark-fg))"
                        : "hsl(var(--dark-fg) / 0.15)",
                      fontWeight: isActive ? 400 : 400,
                      transition: "color 0.3s",
                    }}
                  >
                    {step.title}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active step content — positioned under active column */}
          <div className="mt-12 md:mt-16">
            <div className="hidden md:grid grid-cols-4 gap-8">
              {PROCESS_STEPS.map((_, i) => (
                <div key={i}>
                  {activeStep === i && (
                    <div>
                      <p
                        className="mb-4 leading-relaxed"
                        style={{
                          color: "hsl(var(--dark-muted))",
                          fontSize: "clamp(14px, 1.4vw, 16px)",
                        }}
                      >
                        <span style={{ color: "hsl(var(--dark-fg))" }}>
                          {PROCESS_STEPS[activeStep].heading}
                        </span>{" "}
                        {PROCESS_STEPS[activeStep].body}
                      </p>
                      <div
                        className="mt-6 aspect-square rounded-lg overflow-hidden"
                        style={{ background: "hsl(var(--dark-fg) / 0.08)" }}
                      >
                        <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "hsl(var(--dark-muted))" }}>
                          Step {PROCESS_STEPS[activeStep].number} image
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Mobile: just show content below */}
            <div className="md:hidden">
              <p
                className="mb-4 leading-relaxed"
                style={{
                  color: "hsl(var(--dark-muted))",
                  fontSize: "clamp(14px, 1.4vw, 16px)",
                }}
              >
                <span style={{ color: "hsl(var(--dark-fg))" }}>
                  {PROCESS_STEPS[activeStep].heading}
                </span>{" "}
                {PROCESS_STEPS[activeStep].body}
              </p>
              <div
                className="mt-6 aspect-square rounded-lg overflow-hidden"
                style={{ background: "hsl(var(--dark-fg) / 0.08)" }}
              >
                <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "hsl(var(--dark-muted))" }}>
                  Step {PROCESS_STEPS[activeStep].number} image
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

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
      <ScrollRevealSection />

      {/* ——— SECTION 2B: TYPES OF DEPLOYMENT ——— */}
      <section className="section-light">
        {/* — The Backyard — */}
        <AnimatedSection>
          <div className="relative w-full">
            <div className="overflow-hidden bg-background">
              <img src={backyardImg} alt="Backyard ADU deployment isometric view" className="w-full object-contain" />
            </div>
            <h3
              className="display-heading text-foreground absolute bottom-0 left-0 px-6 md:px-12 pb-4"
              style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
            >
              The<br />Backyard
            </h3>
          </div>
          <div className="px-6 md:px-12 pt-8 pb-24 md:pb-32" style={{ maxWidth: "1400px" }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-8 md:gap-10">
              <div>
                <p
                  className="text-foreground leading-relaxed mb-6"
                  style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
                >
                  Own a backyard. Turn it into a dwelling that earns income, houses family, or makes your property worth more.
                </p>
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-8"
                  style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
                >
                  Plinth's end-to-end process takes you from zoning check to move-in day, so yours is one that does.
                </p>
                <a
                  href="#contact"
                  className="small-label inline-block border border-foreground px-5 py-3 text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  View solutions
                </a>
              </div>
              {[
                {
                  title: "Our Aging Parents.",
                  stat: "$75K",
                  desc: "Average annual cost of assisted living. Keep your loved ones close and save thousands.",
                },
                {
                  title: "The Missing Middle.",
                  stat: "10M",
                  desc: "The deficit of housing units in the U.S. Rent to the teachers, nurses and service workers your community depends on.",
                },
                {
                  title: "A Priced-Out Generation.",
                  stat: "40",
                  desc: "Average age of a first-time homebuyer. Give your recent graduate a place to land.",
                },
              ].map((item) => (
                <div key={item.stat}>
                  <p
                    className="display-heading mb-1"
                    style={{
                      fontSize: "clamp(18px, 2vw, 24px)",
                      color: "hsl(var(--foreground))",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="display-heading mb-3"
                    style={{
                      fontSize: "clamp(36px, 5vw, 72px)",
                      color: "hsl(var(--foreground) / 0.25)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.stat}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* — Cluster Development — */}
        <AnimatedSection delay={100}>
          <div className="relative w-full">
            <div className="overflow-hidden bg-background">
              <img src={clusterImg} alt="Cluster development isometric view" className="w-full object-contain" />
            </div>
            <h3
              className="display-heading text-foreground absolute bottom-0 left-0 px-6 md:px-12 pb-4"
              style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
            >
              The<br />Cluster
            </h3>
          </div>
          <div className="px-6 md:px-12 pt-8 pb-24 md:pb-32" style={{ maxWidth: "1400px" }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-8 md:gap-10">
              <div>
                <p
                  className="text-foreground leading-relaxed mb-6"
                  style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
                >
                  Group multiple units on a single parcel or across adjacent lots — <strong>purpose-built micro-communities at scale.</strong>
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-8"
                  style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
                >
                  Meet zoning, maximize density, and deliver workforce or attainable housing where it's needed most.
                </p>
                <a
                  href="#contact"
                  className="small-label inline-block border border-foreground px-5 py-3 text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  View solutions
                </a>
              </div>
              {[
                {
                  title: "Workforce Housing.",
                  stat: "8M+",
                  desc: "Single-family parcels with space for multi-unit infill development across the Northeast.",
                },
                {
                  title: "Revenue at Scale.",
                  stat: "3–8x",
                  desc: "Revenue potential versus a single backyard unit when clustering multiple dwellings.",
                },
                {
                  title: "Instant Feasibility.",
                  stat: "<48hrs",
                  desc: "To know whether your site qualifies for cluster development — at no cost.",
                },
              ].map((item) => (
                <div key={item.stat}>
                  <p
                    className="display-heading mb-1"
                    style={{
                      fontSize: "clamp(18px, 2vw, 24px)",
                      color: "hsl(var(--foreground))",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="display-heading mb-3"
                    style={{
                      fontSize: "clamp(36px, 5vw, 72px)",
                      color: "hsl(var(--foreground) / 0.25)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.stat}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ——— SECTION 3: HOW IT WORKS ——— */}
      <ProcessStepsSection />

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
