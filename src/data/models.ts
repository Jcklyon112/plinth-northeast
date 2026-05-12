import model03 from "@/assets/model-03.jpg";
import oneBedElevation from "@/assets/model-onebed-elevation.png";
import studioElevation from "@/assets/model-studio-elevation.png";
import interior from "@/assets/interior-01.jpg";
import detail from "@/assets/detail-01.jpg";
import exteriorAlt from "@/assets/exterior-alt-01.jpg";

export interface ModelSpec {
  label: string;
  value: string;
}

export interface ModelPricing {
  label: string;
  value: string;
  emphasized?: boolean;
}

export interface PlinthModel {
  id: string;
  number: string;
  title: string;
  specLine: string;
  price: string;
  image: string;
  description: string;
  specs: ModelSpec[];
  pricing: ModelPricing[];
  gallery: string[];
}

export const models: PlinthModel[] = [
  {
    id: "model-02",
    number: "01",
    title: "The One-Bedroom",
    specLine: "640 SQ FT · 1 BED · 1 BATH",
    price: "FROM $239,000",
    image: oneBedElevation,
    description:
      "A proper one-bedroom home. Separated sleeping and living areas, a full kitchen, and enough space to live in full-time or host guests who stay more than a weekend. The model most clients choose for rental income.",
    specs: [
      { label: "FOOTPRINT", value: "32 × 20 FT" },
      { label: "CEILING HEIGHT", value: "9 FT" },
      { label: "BEDROOMS", value: "1" },
      { label: "BATHROOMS", value: "1" },
      { label: "KITCHEN", value: "Full galley kitchen with island" },
      { label: "HVAC", value: "Ducted mini-split system" },
      { label: "EXTERIOR", value: "Cedar shingle (standard)" },
      { label: "ROOFING", value: "Standing seam metal (standard)" },
      { label: "WINDOWS", value: "Black aluminum-clad wood" },
    ],
    pricing: [
      { label: "BASE UNIT", value: "From $239,000" },
      { label: "FEASIBILITY REPORT", value: "$2,500" },
      { label: "SITE WORK", value: "Typically $40,000 – $75,000" },
      { label: "FAST-TRACK PERMITTING", value: "Optional, priced separately" },
      {
        label: "ALL-IN TYPICAL",
        value: "$305,000 – $345,000",
        emphasized: true,
      },
    ],
    gallery: [interior, detail, exteriorAlt],
  },
  {
    id: "model-01",
    number: "02",
    title: "The Studio",
    specLine: "480 SQ FT · STUDIO · 1 BATH",
    price: "FROM $189,000",
    image: studioElevation,
    description:
      "Designed for the property owner who needs a flexible space — a guest house, a rental unit, a home office that's actually separate from home. One open room, a full kitchen wall, and a bathroom. Nothing wasted.",
    specs: [
      { label: "FOOTPRINT", value: "24 × 20 FT" },
      { label: "CEILING HEIGHT", value: "9 FT" },
      { label: "BEDROOMS", value: "Studio" },
      { label: "BATHROOMS", value: "1" },
      { label: "KITCHEN", value: "Full kitchen wall with counter seating" },
      { label: "HVAC", value: "Mini-split heat pump (heating and cooling)" },
      { label: "EXTERIOR", value: "Cedar shingle (standard)" },
      { label: "ROOFING", value: "Standing seam metal (standard)" },
      { label: "WINDOWS", value: "Black aluminum-clad wood" },
    ],
    pricing: [
      { label: "BASE UNIT", value: "From $189,000" },
      { label: "FEASIBILITY REPORT", value: "$2,500" },
      { label: "SITE WORK", value: "Typically $35,000 – $65,000" },
      { label: "FAST-TRACK PERMITTING", value: "Optional, priced separately" },
      {
        label: "ALL-IN TYPICAL",
        value: "$245,000 – $275,000",
        emphasized: true,
      },
    ],
    gallery: [interior, detail, exteriorAlt],
  },
  {
    id: "model-03",
    number: "03",
    title: "The Two-Bedroom",
    specLine: "860 SQ FT · 2 BED · 1 BATH",
    price: "FROM $299,000",
    image: model03,
    description:
      "The largest model in the lineup. Two bedrooms, a full living area, and a kitchen designed for actual cooking. Built for families, long-term tenants, or aging parents who want independence without distance.",
    specs: [
      { label: "FOOTPRINT", value: "40 × 22 FT" },
      { label: "CEILING HEIGHT", value: "9 FT" },
      { label: "BEDROOMS", value: "2" },
      { label: "BATHROOMS", value: "1" },
      { label: "KITCHEN", value: "Full kitchen with pantry storage" },
      { label: "HVAC", value: "Ducted mini-split system" },
      { label: "EXTERIOR", value: "Cedar shingle (standard)" },
      { label: "ROOFING", value: "Standing seam metal (standard)" },
      { label: "WINDOWS", value: "Black aluminum-clad wood" },
    ],
    pricing: [
      { label: "BASE UNIT", value: "From $299,000" },
      { label: "FEASIBILITY REPORT", value: "$2,500" },
      { label: "SITE WORK", value: "Typically $45,000 – $85,000" },
      { label: "FAST-TRACK PERMITTING", value: "Optional, priced separately" },
      {
        label: "ALL-IN TYPICAL",
        value: "$375,000 – $420,000",
        emphasized: true,
      },
    ],
    gallery: [interior, detail, exteriorAlt],
  },
];
