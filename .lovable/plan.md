
# Restructure Homepage to Match Reference Site

The reference video shows a significantly different site structure from what we currently have. Here's what needs to change:

## Branding Changes
- Logo: "*PLINTH-LABS" (not "Plinth")
- Nav items: *Plinth-Intelligence, Models, FAQ, Get Started (bordered button)
- Footer: Follow Us (Instagram, LinkedIn) · Headquarters (200 Division Street, Sag Harbor, NY) · Contact (business@plinth-labs.com)

## Homepage Sections (in scroll order)

1. **Hero** — Full-screen photo. Headline: "Housing Systems for Resilient Communities." Subtitle about precision-built ADUs and micro-cluster communities. Single CTA: "Feasibility study" (coral/accent button)

2. **The Problem Set** — Dark section. Left-aligned heading "The Problem Set." Large paragraph about the housing crisis and Plinth's AI-driven approach. Below: 4-column stats row (8m+, 50%, 33%, 58% with descriptions)

3. **Infill Exists in Three Mediums** — Light section. Heading "Infill Exists in Three Mediums." Three sub-sections, each with:
   - Full-width isometric B&W illustration
   - Section title (The Backyard / The Workforce / The Community)
   - Description text + 3 stat cards ($75K, 10M, 40) + "View solutions" button

4. **Three steps. One simple process.** — Dark section. Centered heading, then 4-column layout: 01 Study, 02A Permit, 02B Build, 03 Install. Each with a bold number, title, description paragraph, and a placeholder image below

5. **PRECISION-BUILT IN HUDSON VALLEY, NEW YORK.** — Dark section. Large bold uppercase text, left-aligned

6. **Models Showcase** — Full-screen model hero images (Studio, Two-Bed) with text overlay (name, description, "Learn More" button). Bottom bar with variant tabs: 01 VARIANT 0-000, 02 VARIANT 1-000, etc.

7. **Footer** — Dark. Three-column: Follow Us (Instagram, LinkedIn) | Headquarters (200 Division Street, Sag Harbor, NY) | Contact (business@plinth-labs.com). Bottom: copyright + Privacy/Terms links

## Assets Needed
- 3 isometric B&W community/backyard/workforce illustrations
- Process step images (placeholder-quality is fine)
- New model hero images for the full-screen showcase format

## Files Changed
- `src/components/Navbar.tsx` — rebrand + new nav items
- `src/components/Footer.tsx` — new layout
- `src/pages/Index.tsx` — complete rewrite of all sections
- Generate ~5 new images for the new sections

## What stays the same
- Design system tokens (colors, fonts, spacing)
- Models data structure
- About page, Models page (unchanged)
- AnimatedSection, ContactForm components
