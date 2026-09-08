# Amar Automats redesign

Open `index.html` to preview. All 25 HTML pages share `assets/css/brand.css` and `assets/js/brand.js`. No build step is required. PHP hosting is required for the existing contact endpoint.

The design uses black, white, neutral greys, and the requested #F75A00 orange, with Montserrat headings and Roboto body text. Google Fonts requires an internet connection; local system fonts provide fallbacks. The supplied guideline image provides the logo through a CSS crop; a dedicated production logo asset can replace it later.

Original page copies are in `.redesign-originals` for comparison. All original main-content text and product image references are preserved. Product images retain their embedded colors and branding. Existing company information supplies the capability cards and industry anchor; no new technical specifications or industry claims have been invented. Careers routes to a careers enquiry on the existing contact page rather than displaying unverified vacancies.

The homepage uses existing industrial imagery and the original video, with manual slide controls, pause control, and reduced-motion support. The about panel uses existing industrial imagery; it is not presented as a photograph of a new company building. Certificates open at full size. Product navigation retains the original catalog categories.

Validation: `verification.json` records desktop (1440 px), mobile (390 px), tablet contact (768 px), menu/slider behavior, image loading, overflow, JavaScript errors, and main-content/product-image preservation across 25 pages. `verify.cjs` reruns those checks against a local Edge debugging session on port 9222.

Existing backend limitation: `forms/contact.php` still uses `contact@example.com` and references a missing `assets/vendor/php-email-form/php-email-form.php` library. A real recipient and working mail backend must be configured before form email delivery can work. No real enquiries were submitted during testing.

Do not deploy `.redesign-originals`, `verify.cjs`, `verification.json`, or preview screenshots as public website content. The site itself remains static HTML, shared assets, and the original PHP endpoint.
