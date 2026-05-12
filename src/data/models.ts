import model03 from "@/assets/model-03.jpg";
import oneBedElevation from "@/assets/model-onebed-elevation.png";
import studioElevation from "@/assets/model-studio-elevation.png";
import officeElevation from "@/assets/model-office-elevation.png";
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
    id: "model-office",
    number: "04",
    title: "The Office",
    specLine: "240 SQ FT · WORKSPACE · 1/2 BATH",
    price: "FROM $129,000",
    image: officeElevation,
    description:
      "A dedicated workspace separate from the house. Floor-to-ceiling glass, a quiet acoustic envelope, and a half bath. Built for focused work without leaving the property.",
    specs: [
      { label: "FOOTPRINT", value: "16 × 15 FT" },
      { label: "CEILING HEIGHT", value: "9 FT" },
      { label: "BEDROOMS", value: "—" },
      { label: "BATHROOMS", value: "1/2" },
      { label: "GLAZING", value: "Full-height sliding glass" },
      { label: "HVAC", value: "Mini-split heat pump" },
      { label: "EXTERIOR", value: "Cedar shingle (standard)" },
      { label: "ROOFING", value: "Standing seam metal (standard)" },
      { label: "WINDOWS", value: "Black aluminum-clad wood" },
    ],
    pricing: [
      { label: "BASE UNIT", value: "From $129,000" },
      { label: "FEASIBILITY REPORT", value: "$2,500" },
      { label: "SITE WORK", value: "Typically $25,000 – $45,000" },
      { label: "FAST-TRACK PERMITTING", value: "Optional, priced separately" },
      {
        label: "ALL-IN TYPICAL",
        value: "$170,000 – $200,000",
        emphasized: true,
      },
    ],
    gallery: [interior, detail, exteriorAlt],
  },
];
