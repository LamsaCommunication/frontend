# Project Brief — Lamsa Communication Website

## Project Name
Lamsa Communication

## Project Logo's
- C:\PROJECT\LamsaCommunication\frontend\public\lamsa1.PNG
- C:\PROJECT\LamsaCommunication\frontend\public\lamsa2.PNG

## Project contacts
- +213 554.776.283 / +213 540.819.434
- contact@lamsadz.com
- Facebook : lamsa.communication
- instagram : https://www.instagram.com/lamsa_communication/
- TikTok : lamsa_com

## Type
Premium & modern communication studio / creative design studio website.

## Main Objective
Create a modern premium website that presents Lamsa Communication as a professional creative studio and helps visitors quickly understand services and contact the business.

## Target Audience
- Small businesses
- Event organizers
- Shops and boutiques
- Restaurants and cafés
- Brands needing custom print/design
- People ordering personalized gifts/cards/signage/custom clothing/apparel design/...

## Services
1. Graphic Design
2. Thank You Cards
3. Stickers & Labels
4. Neon LED Signs
5. Branding & Visual Identity
6. Print & Custom Orders
7. Packaging and communication products

## Website Goals
- Look premium and modern
- Build trust quickly
- Showcase creative work visually
- Explain services clearly
- Push visitors to WhatsApp/contact
- Work perfectly on mobile

## Pages
For v1, create a one-page landing website with sections:

1. Header / Navigation
2. Hero Section
3. About Lamsa
4. Services
5. Featured Work / Portfolio Preview
6. Contact
7. Footer

## Contact area
Contact on Email / Request a custom order.
When a visitor submits the contact form, the website must send the message securely to the studio email: contact@lamsadz.com.

## Brand Personality
- Premium
- Creative
- Elegant
- Modern
- Confident
- Warm
- Artistic

## Component Quality
- Use section components inside src/components/sections
- Use shared components inside src/components/ui
- Keep homepage clean in src/app/page.tsx
- Do not put all code in one file
- Every section must be responsive
- Every CTA must be functional or clearly prepared

## Contact Form Requirements
The contact form must send messages to: contact@lamsadz.com
The website must include a modern contact/request form that allows visitors to send project requests directly from the website.

Fields:
- Full name ( required )
- Email ( required )
- Phone number ( required for whatsapp sending only )
- Service needed 
- Message / project details

After submit:
- Show success message: "Your request has been sent successfully. Lamsa Communication will contact you soon."
- Show error message if sending fails.
- Protect against empty/invalid fields.
- Protect against abuse sending message.

## Email Destination
All submitted messages must be sent to the studio email:

contact@lamsadz.com

## SEO & AEO
Site title:
Lamsa Communication — Design, Print & Creative Studio

Description:
Lamsa Communication is a premium creative studio specializing in visual communication, graphic design, branding, custom print products, stickers, labels, thank-you cards, neon LED signage, packaging solutions, and personalized creative orders for businesses, brands, and events.

Keywords:
Lamsa Communication, graphic design Algeria, stickers Algeria, thank you cards, neon LED, branding, print studio, communication studio, graphic design, algeria, neon, communication, studio.

## Language
Primary website language: French
Secondary: English can be used for short premium labels if needed.

Tone:
- Professional
- Simple
- Premium
- Clear

### Technical Notes
- Follow modern best practices for performance, security, and code quality.
- Keep the implementation clean, simple, and maintainable.
- Avoid over-engineering or unnecessary dependencies.
- Prioritize fast loading, smooth interactions, and a reliable user experience.

## Backend Requirements
The website must include a small backend layer to handle contact form submissions securely.

## Purpose
The backend will receive contact form data from the website and send the message to the studio email: contact@lamsadz.com

## Backend Approach
Use a Next.js API route:
/api/contact

This API route will:
- Receive form data from the frontend
- Validate required fields
- Send the email to contact@lamsadz.com
- Return a success or error response to the frontend

## Email Sending
Use a professional email service such as Resend, SendGrid, or Nodemailer.

## Security Notes
- Do not expose email API keys in frontend code.
- Store email credentials in environment variables.
- Validate form data before sending.
- Add spam protection.
- Keep backend logic simple and maintainable.

## Environment Variables
The backend should be prepared to use:

RESEND_API_KEY=
CONTACT_EMAIL=contact@lamsadz.com

## User Experience
After submitting the form:
- Show loading state while sending
- Show success message if sent
- Show clear error message if failed
- All clickable elements have cursor-pointer

## WhatsApp Integration
Primary WhatsApp number:
+213 554 776 283

Use WhatsApp CTA buttons across the website.

WhatsApp link:
https://wa.me/213554776283

The contact form may also generate a pre-filled WhatsApp message using the visitor’s name, selected service, and message.
Use custom SVG for WhatsApp icon
Do not use emoji or fake icon

### Spam Protection
Use a honeypot field to prevent spam:

- Add a hidden input field named: `website`
- The field must not be visible to users
- The field must not be focusable (tabIndex={-1})
- If this field is filled → reject the request on the backend

This must be validated in the API route `/api/contact`.