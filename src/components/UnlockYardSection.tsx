import AnimatedSection from "./AnimatedSection";
import useRental from "@/assets/use-rental.jpg";
import useFamily from "@/assets/use-family.jpg";
import useOffice from "@/assets/use-office.jpg";

const USES = [
  {
    image: useRental,
    title: "Rental income",
    description: "Earn $2,000–$4,000/mo in the Northeast rental market.",
  },
  {
    image: useFamily,
    title: "Family home",
    description: "A private home for parents — steps away, not across town.",
  },
  {
    image: useOffice,
    title: "Backyard office",
    description: "Cathedral ceilings, natural light, zero commute.",
  },
];

export default function UnlockYardSection() {
  return (
    <AnimatedSection className="section-light py-24 md:py-32">
      <div className="content-max">
        <div className="max-w-2xl mb-16 md:mb-20">
          <h2
            className="display-heading text-foreground mb-5"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Unlock your yard.
          </h2>
          <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "clamp(15px, 1.2vw, 17px)" }}>
            Rental income. A home for family. A private studio. One building, countless possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {USES.map((use) => (
            <div key={use.title} className="bg-background">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={use.image}
                  alt={use.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="display-heading text-foreground mb-2" style={{ fontSize: "clamp(20px, 1.6vw, 24px)", fontWeight: 500 }}>
                  {use.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {use.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
