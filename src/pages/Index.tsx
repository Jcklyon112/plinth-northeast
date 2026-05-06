import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { models } from "@/data/models";
import heroImage from "@/assets/hero-home.jpg";
import isoBackyard from "@/assets/iso-backyard.jpg";
import isoCommunity from "@/assets/iso-community.jpg";
import isoWorkforce from "@/assets/iso-workforce.jpg";
import modelStudioHero from "@/assets/model-studio-hero.jpg";
import modelTwobedHero from "@/assets/model-twobed-hero.jpg";

const modelShowcases = [
  {
    id: "studio",
    name: "STUDIO",
    image: modelStudioHero,
    description: "A minimal, light-filled space designed for focus, flexibility, and quiet use. The Studio model prioritizes clean lines, natural materials, and seamless indoor-outdoor flow — creating a calm, adaptable environment for work, rest, or extended living.",
    variants: ["01  VARIANT 0-000", "02  VARIANT 1-000", "03  VARIANT 2-000", "04  VARIANT 4-000"],
  },
  {
    id: "twobed",
    name: "TWO-BED",
    image: modelTwobedHero,
    description: "A flexible, multi-use layout designed for shared living, small families, or live-work setups. The Two Bedroom provides distinct private spaces while maintaining a cohesive, open living environment suited for longer-term occupancy.",
    variants: ["01  VARIANT 0-000", "02  VARIANT 1-000", "03  VARIANT 2-000", "04  VARIANT 4-000"],
  },
];

const infillMediums = [
  {
    title: "The Backyard",
    image: isoBackyard,
    description: "For aging parents, extra income, or a recent grad priced out of their first apartment — ",
    bold: "the answer is already in your backyard.",
    detail: "Plinth's end-to-end process takes you from zoning check to move-in day, so yours is one that does.",
  },
  {
    title: "The Community",
    image: isoCommunity,
    description: "For aging parents, extra income, or a recent grad priced out of their first apartment — ",
    bold: "the answer is already in your backyard.",
    detail: "Plinth's end-to-end process takes you from zoning check to move-in day, so yours is one that does.",
  },
  {
    title: "The Workforce",
    image: isoWorkforce,
    description: "For aging parents, extra income, or a recent grad priced out of their first apartment — ",
    bold: "the answer is already in your backyard.",
    detail: "Plinth's end-to-end process takes you from zoning check to move-in day, so yours is one that does.",
  },
];

const stats = [
  { heading: "Our Aging Parents.", value: "$75K", desc: "Average annual cost of assisted living. Keep your loved ones close and save thousands." },
  { heading: "The Missing Middle.", value: "10M", desc: "The deficit of housing units in the U.S. Rent to the teachers, nurses and service workers your community depends on." },
  { heading: "A Priced-Out Generation.", value: "40", desc: "Average age of a first-time homebuyer. Give your recent graduate a place to land." },
];

const processSteps = [
  { num: "01", title: "Study", desc: "Know What's Possible Before You Commit. We analyze your parcel — zoning, setbacks, utility access, and financial projections — so you have a clear picture of what can be built, what it will cost, and what it will earn. No guesswork, no surprises." },
  { num: "02A", title: "Permit", desc: "We Handle the Red Tape. Plinth manages the full permitting process — from application to approval. We work directly with local municipalities to keep things moving, so you don't have to." },
  { num: "02B", title: "Build", desc: "Your Unit Builds While Permits Process. Traditional construction waits for permits. Ours doesn't. Manufacturing runs in parallel — so by the time your permit is approved, your unit is ready to ship." },
  { num: "03", title: "Install", desc: "From Flatbed to Front Door. Plinth coordinates delivery, site prep, crane logistics, utility connections, and final inspections." },
];

export default function Index() {
  const [activeModel, setActiveModel] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[600px]">
        <img
          src={heroImage}
          alt="Plinth accessory dwelling unit"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-24 md:pb-32">
          <h1 className="display-heading text-foreground mb-6" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Housing Systems for Resilient<br />Communities.
          </h1>
          <p className="text-foreground/80 text-base md:text-lg max-w-[600px] mb-8 leading-relaxed">
            Plinth-Labs is a real estate development platform delivering precision-built ADUs and micro-cluster communities across America's most supply-constrained markets.
          </p>
          <a
            href="#contact"
            className="inline-block mono-label bg-accent text-accent-foreground px-6 py-3 hover:bg-accent/90 transition-colors"
          >
            Feasibility study
          </a>
        </div>
      </section>

      {/* THE PROBLEM SET */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max">
          <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-12">
            The Problem Set.
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-[1100px] mb-20">
            Across the United States, millions of parcels are underutilized in the midst of a housing crisis. Plinth transforms overlooked infill parcels into housing-ready opportunities. We leverage our proprietary AI technology to identify eligible land, manage the process end-to-end, and deliver housing through prefabricated construction. Compressing timelines, reducing cost, and unlocking scalable residential supply.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "8 m+", desc: "of underutilized infill parcels in the United States." },
              { value: "50 %", desc: "of renters are burdened by the cost of housing." },
              { value: "33 %", desc: "of adults under 35 are living at home." },
              { value: "58 %", desc: "of employers lose staff to housing costs each year." },
            ].map((stat) => (
              <div key={stat.value}>
                <p className="display-heading text-4xl md:text-6xl text-muted-foreground/40 mb-3" style={{ letterSpacing: "0.05em" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* INFILL EXISTS IN THREE MEDIUMS */}
      <section className="section-light">
        <AnimatedSection className="section-padding pb-0">
          <div className="content-max">
            <h2 className="display-heading text-4xl md:text-7xl mb-0" style={{ color: "hsl(var(--light-fg))", opacity: 0.3 }}>
              Infill Exists in<br />Three Mediums
            </h2>
          </div>
        </AnimatedSection>

        {infillMediums.map((medium, idx) => (
          <div key={medium.title}>
            {/* Isometric Image */}
            <div className="w-full">
              <img
                src={medium.image}
                alt={medium.title}
                className="w-full h-auto"
                loading="lazy"
                width={1920}
                height={1080}
              />
            </div>

            {/* Content */}
            <AnimatedSection className="py-16 md:py-24">
              <div className="content-max">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                  <div>
                    <h3 className="display-heading text-3xl md:text-4xl mb-6" style={{ color: "hsl(var(--light-fg))" }}>
                      {medium.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "hsl(var(--light-muted))" }}>
                      {medium.description}
                      <strong style={{ color: "hsl(var(--light-fg))" }}>{medium.bold}</strong>
                    </p>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--light-muted))" }}>
                      {medium.detail}
                    </p>
                    <a
                      href="/models"
                      className="inline-block mono-label border px-5 py-2.5 transition-colors"
                      style={{ borderColor: "hsl(var(--light-fg))", color: "hsl(var(--light-fg))" }}
                    >
                      View solutions
                    </a>
                  </div>
                  {stats.map((stat) => (
                    <div key={stat.heading}>
                      <h4 className="display-heading text-lg md:text-xl mb-2" style={{ color: "hsl(var(--light-fg))" }}>
                        {stat.heading}
                      </h4>
                      <p className="display-heading text-4xl md:text-5xl mb-3" style={{ color: "hsl(var(--light-fg))" }}>
                        {stat.value}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--light-muted))" }}>
                        {stat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        ))}
      </section>

      {/* THREE STEPS */}
      <section className="section-dark section-padding">
        <div className="content-max">
          <AnimatedSection className="text-center mb-20 md:mb-32">
            <h2 className="display-heading text-2xl md:text-4xl text-foreground">
              Three steps. One simple process.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {processSteps.map((step) => (
              <AnimatedSection key={step.num}>
                <p className="display-heading text-4xl md:text-5xl text-muted-foreground/30 mb-2">
                  {step.num}
                </p>
                <p className="display-heading text-3xl md:text-4xl text-muted-foreground/60 mb-6">
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  {step.desc}
                </p>
                <div className="aspect-square bg-secondary/50 rounded" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRECISION-BUILT */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max">
          <h2 className="display-heading text-4xl md:text-7xl lg:text-8xl text-foreground uppercase leading-none">
            PRECISION-BUILT IN<br />HUDSON VALLEY,<br />NEW YORK.
          </h2>
        </div>
      </AnimatedSection>

      {/* MODELS SHOWCASE */}
      <section className="relative">
        {modelShowcases.map((model, idx) => (
          <div
            key={model.id}
            className={`relative h-screen min-h-[600px] ${idx !== activeModel ? "hidden" : ""}`}
          >
            <img
              src={model.image}
              alt={model.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-32 md:pb-40">
              <h2 className="display-heading text-5xl md:text-8xl text-foreground mb-4 uppercase">
                {model.name}
              </h2>
              <p className="text-foreground/70 text-sm md:text-base max-w-[600px] mb-6 leading-relaxed">
                {model.description}
              </p>
              <a
                href="/models"
                className="inline-block mono-label border border-foreground/50 text-foreground px-5 py-2.5 hover:bg-foreground hover:text-background transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Variant tabs at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="grid grid-cols-4">
                {model.variants.map((variant, vi) => (
                  <button
                    key={vi}
                    onClick={() => setActiveVariant(vi)}
                    className={`py-4 mono-label text-center border-t-2 transition-colors ${
                      vi === activeVariant
                        ? "border-foreground text-foreground"
                        : "border-muted-foreground/20 text-muted-foreground/50 hover:text-muted-foreground"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Model switcher (click areas or auto-advance could be added) */}
        {modelShowcases.length > 1 && (
          <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-3 z-10">
            {modelShowcases.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveModel(idx); setActiveVariant(0); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === activeModel ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
                aria-label={`View model ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
