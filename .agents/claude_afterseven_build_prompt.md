# Afterseven — Full Build Spec

You are building a production-minded MVP for an event reservation website called **Afterseven**.

Do not give me a vague architecture summary. Do not simplify the visual direction. Do not replace the design direction with generic SaaS UI. Build to this spec exactly.

---

## 1. Project context

The frontend project is **already set up** with:

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- GitHub Pages deployment target
- repo name: `afterseven`
- Vite base path must remain: `/afterseven/`

External services are **already prepared**:

- Supabase project exists
- frontend env vars for Supabase exist
- `RESEND_API_KEY` is already stored in **Supabase Edge Function secrets**

Do not waste time re-explaining setup. Start from the assumption that the project foundation already exists.

---

## 2. Product requirements

This is an event reservation website with **one active event at a time**.

### Public user requirements

- Public landing page shows the active event
- User can reserve spots for more than one person
- Public page must always show **how many spaces are left**
- User enters:
  - full name
  - email
  - number of spots
- After successful reservation:
  - reservation is stored
  - available spots are decreased
  - confirmation email is sent to the reserver
  - user sees a success/confirmation state

### Admin requirements

- Admin can log in
- Admin can create a new active event
- Admin can reset/replace the current event
- Admin can set:
  - event title
  - date
  - capacity
- Admin can view reservations for the active event

### Business constraints

- There is only **one active event at a time**
- Overbooking must be prevented **server-side**
- Reservation logic must not rely on client-side spot counting
- Email sending must happen only in backend logic
- The frontend is static-hosted on GitHub Pages
- Backend logic must use Supabase

---

## 3. Required stack

Use exactly this stack unless there is a strong technical reason not to:

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend

- Supabase Postgres
- Supabase Auth
- Supabase Edge Functions

### Email

- Resend

### Hosting

- GitHub Pages for frontend
- Supabase-hosted backend services

Do not switch to Next.js.  
Do not introduce Firebase.  
Do not introduce a custom Node/Express backend.  
Do not introduce unnecessary libraries.

---

## 4. Design direction

This is **not** a generic event booking page.

The site must feel like a **secret club**, **high-end**, **design-forward**, **mobile-first**, and **editorial**.

### Required visual mood

- dark, exclusive, cinematic
- modern and fashion-forward
- “members-only / underground / invitation-only” atmosphere
- brutalist web design influence
- sharp hierarchy
- intentionally bold layout
- strong typography
- minimal but dramatic composition
- sleek and premium, not playful

### Required style traits

- brutalist layout language
- heavy contrast
- large type
- rigid grid
- strong borders / framing where appropriate
- confident spacing
- asymmetric but controlled compositions
- modern luxury feel, not retro-web ugliness
- design should feel deliberate, not random

### Color direction

- overall dark mode aesthetic
- landing page background must have a **black → alabaster vertical gradient** from top to bottom
- the palette should stay restrained
- avoid colorful startup gradients or candy colors
- use neutrals, near-whites, charcoal, black, muted metallic accents if needed
- preserve legibility at all times

### UX / device requirements

- must be **cellphone friendly**
- must work well on narrow screens first
- should still feel premium on desktop
- typography and spacing must adapt well to mobile
- forms must be easy to use on phone
- no tiny tap targets
- no overcomplicated desktop-only layouts

---

## 5. Animation requirements

Use **Framer Motion** throughout the experience.

Animations must feel:

- refined
- intentional
- atmospheric
- premium
- smooth
- not gimmicky

### Required animation principles

- entrance reveals
- staggered text/content appearance where appropriate
- subtle section transitions
- hover/tap feedback
- elegant modal/panel transitions if used
- smooth state transitions for loading/success/errors
- animated updating of remaining spots if appropriate
- restrained motion, not chaotic motion

### Avoid

- excessive bouncing
- childish animation
- overly flashy parallax
- random floating effects
- motion that harms performance
- motion that distracts from the brutalist luxury aesthetic

Respect reduced motion preferences where possible.

---

## 6. Required routes

Use these routes:

- `/` → public landing page and reservation flow
- `/success` → reservation confirmation/success page
- `/admin` → admin auth + admin dashboard

Do not add unnecessary public pages unless justified.

---

## 7. Required architecture

I want the system designed correctly, not just visually.

### Frontend responsibilities

- render active event
- show spaces left
- submit reservation form
- show loading / success / error states
- allow admin login
- allow admin event management UI

### Backend responsibilities

These must be implemented as Supabase Edge Functions or equivalent secure backend logic within Supabase architecture:

- `create-reservation`
- `admin-create-event`
- `admin-reset-event`
- `admin-get-dashboard`

Do not let the client directly perform protected business logic.

---

## 8. Database model

Start with a simple relational model.

### Table: `events`

Required fields:

- `id`
- `title`
- `event_date`
- `capacity`
- `spots_remaining`
- `is_active`
- `created_at`

### Table: `reservations`

Required fields:

- `id`
- `event_id`
- `full_name`
- `email`
- `party_size`
- `reservation_code`
- `created_at`

You may add small supporting fields if justified, but do not bloat the schema.

---

## 9. Auth and permissions

Use Supabase Auth for admin access.

### Requirements

- admin-only actions must be protected
- public users must not be able to create or reset events
- public users must not be able to manipulate inventory directly
- reservation creation must be validated server-side
- row-level security strategy must be defined clearly

I want a practical MVP auth model, not over-engineered user management.

---

## 10. Reservation logic requirements

This part must be correct.

### `create-reservation` must:

- accept reservation input
- validate input
- fetch the active event
- verify enough spots remain
- create a reservation
- decrement remaining spots safely
- send confirmation email through Resend
- return updated reservation/result state

### Critical rule

Overbooking prevention must be enforced on the backend.  
Do not rely on the client for inventory accuracy.

If needed, use a transaction-like or concurrency-safe approach appropriate for Supabase/Postgres-backed logic.

---

## 11. Email requirements

Use Resend from backend logic only.

Confirmation email should include:

- event title
- event date
- reserved number of spots
- reservation code
- concise confirmation messaging

Keep email implementation secure and minimal.

Do not place Resend secrets in frontend code.

---

## 12. Frontend UX requirements

### Landing page

The landing page should feel like a premium branded experience, not just a form page.

- on first page open only show logo, website name, duration until next event and a "reserve a spot" button. when the button is clicked, the page should roll up to reveal the reservation part with:

- visible remaining spots
- form to reserve
- reservation CTA
- smooth scroll/section rhythm if needed

The reservation form should feel integrated into the design, not like a default admin panel dropped into the page.

### Admin page

Should be visually consistent with the site but more utilitarian.
Still elegant, still dark, still aligned with the brand.

### States to design properly

- loading state
- no active event state
- fully booked state
- success state
- validation error state
- backend failure state

---

## 13. Component and folder expectations

Use a clean component structure.

I want you to define and then implement a maintainable structure, for example around:

- `src/components`
- `src/pages`
- `src/lib`
- `src/hooks`
- `src/types`
- `supabase/functions`
- `supabase/migrations`

Keep responsibilities separated clearly.

---

## 14. Implementation expectations

Do not dump one giant unreadable code blob immediately.

I want you to work in this order:

1. final architecture
2. folder structure
3. schema and migrations
4. Edge Function contracts
5. frontend page/component plan
6. implementation in small slices

When generating code:

- provide complete files when appropriate
- keep code production-minded
- use TypeScript properly
- avoid fake placeholders unless clearly marked
- do not invent setup steps that were already completed

---

## 15. Visual implementation requirements

### Typography

- bold hierarchy
- dramatic scale differences
- editorial composition
- modern, clean, premium feeling
- avoid generic “default Tailwind app” look

### Layout

- brutalist web design
- grid-conscious
- intentional whitespace
- strong section separations
- sharp, high-contrast composition
- luxury minimalism, not clutter

### UI details

- buttons should feel premium and assertive
- inputs should feel branded and deliberate
- cards/panels should feel architectural, not soft and generic
- avoid over-rounded bubbly components unless strategically justified
- do not make it look like a dashboard template

---

## 16. Technical quality bar

I care about correctness and structure.

### Must do

- type-safe code
- reusable components where sensible
- secure boundaries between frontend and backend
- mobile-first responsiveness
- clean loading/error handling
- clean Framer Motion integration
- accessible enough to be usable

### Must avoid

- overengineering
- unnecessary libraries
- generic design
- weak reservation logic
- client-side-only state pretending to be backend truth
- exposing secrets
- ugly default shadcn/Tailwind styling with no custom design thinking

---

## 17. Deliverables I want from you

First, give me:

### A. Architecture summary

A concrete architecture for this exact product and stack.

### B. Folder structure

A full proposed repo tree.

### C. Database schema

SQL-ready schema design for the MVP.

### D. Edge Function contracts

For each function:

- request shape
- validation rules
- auth requirements
- DB operations
- response shape
- error cases

### E. Frontend plan

Pages, major components, and state flow.

### F. Visual system plan

Explain how you will translate:

- secret club
- brutalist
- luxury dark mode
- black-to-alabaster gradient
- mobile-first
- Framer Motion
  into actual UI structure

Then, after that, proceed to implementation in slices.

---

## 18. Non-negotiable rules

Do not:

- redesign it into a generic startup landing page
- make it light-themed by default
- drop the brutalist direction
- ignore mobile-first design
- ignore Framer Motion
- switch away from Supabase
- switch away from GitHub Pages constraints
- rely on client-side spot counting
- put secret keys in frontend code

Do:

- keep the design bold
- keep the architecture practical
- keep the code clean
- keep the mood exclusive and cinematic
- keep the UX modern and polished

---

## 19. Start now

Start with:

1. the architecture
2. the visual system
3. the folder structure
4. the schema
5. the Edge Function contracts

Do not start with filler text.
Do not give me generic advice.
Give me a concrete build plan for this exact site.
