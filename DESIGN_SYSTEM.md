# Design System — Lamsa Communication

## Visual Direction
Premium black-and-white creative studio with strong red accent.

The website should feel:
- elegant
- bold
- clean
- artistic
- modern
- high-end

## Color System

### Core Colors
- Black: #000000
- White: #FFFFFF
- Soft White (Main Background): #F7F5F2
- Brand Red: #E30613

### Neutrals
- Charcoal: #141414
- Dark Gray: #232323
- Warm Gray: #A7A29A
- Light Gray: #E8E5E0

---

## Usage

### Backgrounds
- Main → Soft White (#F7F5F2)
- Sections → White (#FFFFFF)
- Contrast sections → Black (#000000)

### Text
- Primary → Black
- Secondary → Warm Gray

### Actions
- Primary CTA → Red (#E30613)
- Hover → Slightly darker red (#B8000A)

### Design Balance
- White = clarity
- Black = structure
- Red = attention

Use red sparingly for maximum impact.

## Typography
Use Geist as the primary font.

Style:
- Big bold hero headline
- Clean readable body text
- Strong section titles
- Small uppercase labels for premium feel

## Layout
- Full responsive
- Large whitespace
- Rounded cards
- Premium grid layouts
- Strong visual hierarchy
- Smooth scroll sections

## UI Components
Use shadcn/ui for:
- Button
- Card
- Badge
- Sheet
- Dialog
- Input
- Textarea
- Separator

## Animation
Use Framer Motion & gsap:
- subtle fade-up
- smooth hover
- gentle image movement
- no excessive animation
- Do good idea between Hero section and About Lamsa smoth scroling like whene scrol animation do like something then scrol with it to the next section only between this two section

## Animation Rule
- Use Framer Motion for normal section animations.
- Use GSAP only for advanced scroll animation between Hero and About.
- Do not overuse animation.
- Performance must stay smooth on mobile.

## Design Rules
- No cheap gradients
- No clutter
- No random colors
- No generic stock agency look
- Every section must feel custom to Lamsa
- Premium spacing is more important than adding too many elements
- All section should be connected in design 

## GSAP Rule (Strict)
- Use GSAP ONLY for Hero → About scroll transition
- Do NOT use GSAP in any other section
- All other animations must use Framer Motion

## Logo Usage
- Use lamsa2.PNG on light backgrounds
- On dark sections:
  - either invert using CSS filter
  - or use alternative version if needed
- Always ensure logo is visible (contrast check required)