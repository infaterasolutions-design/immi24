# Design System Strategy: The Authoritative Editorial

This design system is engineered to transform a standard news portal into a high-end, digital-first editorial experience. By moving away from rigid, legacy "newspaper" grids, we embrace a sophisticated hierarchy that balances the urgency of immigration updates with the prestige of a professional consultancy.

---

## 1. Overview & Creative North Star: "The Digital Diplomat"
The Creative North Star for this system is **The Digital Diplomat**. The aesthetic must feel authoritative yet accessible—avoiding the "government form" look in favor of a layered, fluid, and premium editorial experience.

To break the "template" look:
- **Intentional Asymmetry:** Use the spacing scale to create wider gutters on one side of the content to allow for pull-quotes or "breaking" metadata.
- **Micro-Layering:** Elements should never feel "pasted" on a flat background. We use a sophisticated stack of tonal surfaces to guide the eye.
- **Typographic Gravity:** We use dramatic scale shifts between `display-lg` and `body-md` to create a clear entry point for every story.

---

## 2. Color & Surface Architecture
We move beyond flat hex codes to a system of **Tonal Depth**. The primary Blue (`#1D4ED8`) is our anchor of trust, but its application is surgical.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural separation must be achieved through:
1. **Background Shifts:** Transitioning from `surface` to `surface_container_low`.
2. **Negative Space:** Utilizing the `spacing-12` or `spacing-16` tokens to define content blocks.

### Surface Hierarchy & Nesting
Treat the UI as a physical desk with stacked sheets of fine paper.
* **Base Layer:** `surface` (#f8f9fa) – The infinite canvas.
* **Section Layer:** `surface_container_low` (#f3f4f5) – Used for broad content groupings (e.g., a "Latest News" sidebar).
* **Card Layer:** `surface_container_lowest` (#ffffff) – Reserved for the highest priority interactive elements to provide a natural "pop."

### Signature Textures
* **The "Immigration Blue" Gradient:** For Hero CTA buttons and Featured News backgrounds, use a linear gradient from `primary` (#0037b0) to `primary_container` (#1d4ed8) at a 135° angle. This adds a "soul" to the brand that flat colors lack.
* **Glassmorphism:** Use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur for sticky navigation headers to maintain a sense of place.

---

## 3. Typography: Editorial Authority
We pair **Plus Jakarta Sans** (a more modern, premium evolution of Poppins) with **Inter** for clinical legibility.

* **Display & Headlines (Plus Jakarta Sans):** Used to command attention. `display-md` should be used for lead stories, utilizing tight letter-spacing (-0.02em) to feel "news-tight."
* **Body (Inter):** The workhorse. `body-lg` is the standard for article prose. Ensure a line-height of 1.6 to prevent "graying out" of long immigration law updates.
* **Labels (Inter):** Use `label-md` in all-caps with 0.05em tracking for category tags (e.g., "VISA UPDATES") to denote high-level classification.

---

## 4. Elevation & Depth
We eschew traditional "Drop Shadows" for **Tonal Layering**.

* **The Layering Principle:** To lift a card, place a `surface_container_lowest` card on a `surface_container` background. The subtle shift from #ffffff to #edeeef creates a modern, "borderless" elevation.
* **Ambient Shadows:** For floating elements like Modals or Mobile Menus, use a shadow with a 40px blur, 0% spread, and 6% opacity of `on_surface` (#F9FAFB). This mimics natural light rather than digital noise.
* **The "Ghost Border":** For form inputs, use `outline_variant` at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Cards (The "Editorial Tile")
- **Style:** `rounded-lg` (1rem). No borders.
- **Content:** Use `surface_container_lowest` for the background.
- **Spacing:** `spacing-5` internal padding to give text significant breathing room.

### Buttons (The "Action Anchor")
- **Primary:** `primary` background with `on_primary` text. `rounded-full` for a modern, tech-forward feel.
- **Secondary:** `surface_container_high` background. No border. This creates a "soft" button that doesn't compete with the primary news alert.

### News Ticker / Chips
- **Selection Chips:** Use `secondary_container` with `on_secondary_container` text.
- **Breaking News Chip:** Use `tertiary` (#7f2500) for a sophisticated "Urgent" signal that isn't the standard alarming red.

### Input Fields
- **State:** On focus, transition background from `surface_container` to `surface_container_lowest` and apply a 2px `primary` "Ghost Border" at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `spacing-16` (5.5rem) between major sections. Modern luxury is defined by white space.
- **Do** use `tertiary` accents for legal warnings or critical deadline updates—it feels more "Premium Legal" than "System Error."
- **Do** wrap images in `rounded-md` (0.75rem) to soften the "news" edge and match the card language.

### Don't:
- **Don't** use 100% black (#000000) for text. Always use `on_surface` (#191c1d) to maintain the high-end editorial softness.
- **Don't** use lines to separate list items. Use a `spacing-3` vertical gap and a background shift on hover.
- **Don't** use sharp 90-degree corners. Even the smallest "sm" rounding (0.25rem) keeps the system feeling human and approachable.