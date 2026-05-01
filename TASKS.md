# Tasks — Lamsa Communication Website

## Phase 1 — Planning with Claude Sonnet
- Read all markdown files.
- Use ui-ux-pro-max skill.
- Define final homepage structure.
- Improve design direction.
- Confirm component list.
- Confirm visual hierarchy.
- Do not code yet.

## Phase 2 — Setup
- Verify Next.js project.
- Verify Tailwind setup.
- Verify shadcn/ui & ui-ux pro max & gsap & framer motion setup.
- Verify logos are in public folder ( C:\PROJECT\LamsaCommunication\frontend\public\lamsa1.PNG , C:\PROJECT\LamsaCommunication\frontend\public\lamsa2.PNG ).
- Install needed dependencies.

## Phase 3 — Design System Implementation
- Configure Tailwind theme.
- Add brand colors.
- Set typography.
- Create reusable layout helpers.
- Create button variants if needed.

## Phase 4 — Components
Create:
- Header
- HeroSection
- ServicesSection
- AboutSection
- PortfolioSection
- ContactSection ( modern for email sending )
- Footer

## Phase 5 — Contact & Backend Integration
- Create Next.js API route: `/api/contact`
- Implement server-side email sending using Resend (or similar provider)
- Send all form submissions to: contact@lamsadz.com
- Implement optional auto-reply email to the user
- Keep backend logic simple and maintainable
- Handle errors properly (try/catch)
- Return proper HTTP responses (200 / 400 / 500)
- Add spam protection (rate limiting / captcha)
- Add honeypot field (name: "website") to contact form
- Validate honeypot field in backend API
- Reject requests if honeypot is filled

## Phase 6 — Polish
- Add responsive design.
- Add Framer Motion & GSAP animations.
- Add hover states.
- Add Email and other contact CTA.
- Optimize spacing.
- Make mobile version beautiful.

## Phase 7 — Final Review
- Check build errors.
- Check mobile layout.
- Check desktop layout.
- Check accessibility.
- Check performance.
- Remove unused code.