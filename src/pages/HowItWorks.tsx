import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import factoryImg from "@/assets/factory.jpg";
import interior01 from "@/assets/interior-01.jpg";
import detail01 from "@/assets/detail-01.jpg";
import exteriorAlt from "@/assets/exterior-alt-01.jpg";
import backyardRender from "@/assets/backyard-render.png";

const STEPS = [
  {
    n: "01",
    label: "STEP ONE",
    title: "A free consultation call.",
    body: "It starts with a conversation. We learn about your property, your goals for the space, and your budget. You leave the call with a clear-eyed read on whether an ADU makes sense for your lot, and what the path forward looks like.",
    bullets: [
      "Zoning sanity check on your address",
      "What size and configuration your lot supports",
      "Realistic budget and timeline expectations",
    ],
    image: backyardRender,
  },
  {
    n: "02",
    label: "STEP TWO",
    title: "Site evaluation and preliminary design.",
    body: "Whether you're building for rental income or a place for family, we work with you to custom-design an ADU that maximizes your space and value. Our team visits the property, measures the lot, and drafts the first version. You walk away with the documents you need to make an informed decision.",
    bullets: [
      "Site plan showing setbacks, lot coverage, and placement",
      "Floor plan tailored to your backyard and use case",
      "Exterior and interior renderings",
      "Cost estimate from our construction partner",
      "A full proposal for the project, end to end",
    ],
    image: detail01,
  },
  {
    n: "03",
    label: "STEP THREE",
    title: "Detailed design and engineering.",
    body: "We take the preliminary design as the starting point and develop it into the real thing. Layouts get refined, finishes and fixtures get selected with you, and structural and MEP engineering coordination happens in parallel, so the design is fully resolved and buildable before it ever goes to the city.",
    bullets: [
      "Refined floor plans and elevations developed from the preliminary set",
      "Finish palettes, cabinetry, appliances, and fixtures selected with you",
      "Structural and MEP engineering coordinated into the drawings",
      "Lighting plan and millwork details resolved",
    ],
    image: interior01,
  },
  {
    n: "04",
    label: "STEP FOUR",
    title: "We handle the permits.",
    body: "This is the part most homeowners dread, and the part we take entirely off your plate. PLINTH hires and manages every licensed professional required to get your ADU through your municipality, so you stay on a single contract with us instead of juggling four.",
    bullets: [
      "Architects: stamped construction document set, ready to file",
      "Structural engineer: foundation and framing calculations",
      "MEP engineer: plumbing, electrical, and mechanical design",
      "Registered expediter: permit filing and follow-up",
      "Objections and resubmissions handled until your permits are approved",
    ],
    image: exteriorAlt,
  },
  {
    n: "05",
    label: "STEP FIVE",
    title: "Construction begins.",
    body: "Our contractor team breaks ground in your backyard. A site supervisor runs the project day to day; you get weekly progress updates and a single point of contact at PLINTH. When the last inspection clears, you get the keys.",
    bullets: [
      "Vetted contractor crew with Northeast experience",
      "Weekly progress photos and updates",
      "Final inspections and certificate of occupancy",
      "Walkthrough and handoff when complete",
    ],
    image: factoryImg,
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="section-light pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="content-max">
          <AnimatedSection>
            <p className="small-label text-muted-foreground mb-6">HOW IT WORKS</p>
            <h1
              className="display-heading text-foreground mb-8 max-w-4xl"
              style={{ fontSize: "clamp(40px, 7vw, 88px)" }}
            >
              How building an ADU in the Northeast works.
            </h1>
            <p className="reading-column text-muted-foreground">
              PLINTH runs the whole process. Consultation, design, engineering, permitting, and construction under one roof, so you have a single point of contact from your first call through your certificate of occupancy.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="section-light pb-24 md:pb-40 relative">
        <div className="content-max relative">
          {/* Center vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border hidden md:block"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-24 md:gap-32">
            {STEPS.map((step, i) => {
              const imageLeft = i % 2 === 1; // alternate: 01 right, 02 left, ...
              return (
                <AnimatedSection key={step.n}>
                  <div className="relative">
                    {/* Number badge centered on the line */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center">
                        <span className="display-heading text-foreground" style={{ fontSize: "18px", fontWeight: 500 }}>
                          {step.n}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-center">
                      {/* Image */}
                      <div className={`${imageLeft ? "md:order-1" : "md:order-2"}`}>
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          <img
                            src={step.image}
                            alt={step.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <div className={`${imageLeft ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8"}`}>
                        <p className="small-label text-accent mb-5">{step.label}</p>
                        <h2
                          className="display-heading text-foreground mb-5"
                          style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}
                        >
                          {step.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontSize: "15px" }}>
                          {step.body}
                        </p>
                        <ul className="flex flex-col gap-3">
                          {step.bullets.map((b) => (
                            <li key={b} className="flex gap-4 items-start text-foreground" style={{ fontSize: "14px" }}>
                              <span
                                className="mt-2 inline-block bg-accent shrink-0"
                                style={{ width: "20px", height: "1px" }}
                                aria-hidden="true"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Mobile number */}
                    <div className="md:hidden mt-6">
                      <span className="small-label text-muted-foreground">{step.n}</span>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
