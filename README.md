# SolarVolt – Renewable Energy Website Template
**Version 1.0** | Built March 2025

A premium, production-ready website template for a Renewable Energy Installer (Solar &amp; Wind), featuring a public marketing site and a client energy monitoring dashboard.

---

## 📁 File Structure

```
renewable-energy/
├── index.html                   ← Homepage
├── sitemap.xml
├── robots.txt
├── README.md
├── assets/
│   ├── css/
│   │   ├── style.css            ← Main design system
│   │   ├── dark-mode.css        ← Dark theme overrides
│   │   ├── rtl.css              ← RTL language support
│   │   └── dashboard.css        ← Dashboard layout styles
│   ├── js/
│   │   ├── main.js              ← Core JS (theme, nav, forms, calc)
│   │   └── dashboard.js         ← Dashboard JS (sidebar, charts, live data)
│   └── images/
│       ├── favicon.svg
│       ├── hero-bg.png
│       ├── solar-residential.png
│       ├── solar-commercial.png
│       ├── wind-farm.png
│       ├── about-mission.png
│       └── team.png
├── pages/
│   ├── about.html               ← Company story, mission, team
│   ├── services.html            ← Services, pricing, FAQ
│   ├── blog.html                ← Blog with sidebar
│   ├── contact.html             ← Contact form + map
│   ├── dashboard.html           ← Client energy dashboard
│   ├── 404.html                 ← Custom error page
│   └── coming-soon.html         ← Pre-launch page with countdown
└── documentation/
    └── (see below)
```

---

## 🚀 Quick Start

1. Open `index.html` in any modern browser — no build tools required.
2. All assets are loaded via CDN (Boxicons icons, Google Fonts).
3. Works offline after first load (fonts cached by browser).

---

## 🎨 Customisation Guide

### Colors
Edit CSS variables in `assets/css/style.css` (`:root` block):
```css
--clr-primary:       #0ea66b;   /* Main green brand color */
--clr-primary-dark:  #0b8a58;
--clr-secondary:     #f59e0b;   /* Amber accent */
--clr-accent:        #3b82f6;   /* Blue for data */
```

### Fonts
Change the Google Fonts import at the top of `style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter...');
/* --font-body: 'Inter', sans-serif; */
/* --font-heading: 'Outfit', sans-serif; */
```

### Content
- **Company name**: Search/replace "SolarVolt" across all HTML files.
- **Phone/Email**: Update in all pages (contact.html, footer, navbar).
- **Address**: Update structured data in `index.html` and `contact.html`.
- **Images**: Replace files in `assets/images/` (keep filenames or update `src` attributes).

---

## 🔗 Integrations

### Contact Form (Formspree)
In `contact.html`, update the form action:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
Sign up free at [formspree.io](https://formspree.io).

### Google Maps
Replace the map placeholder div in `contact.html` with:
```html
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_ID"
  width="100%" height="300" frameborder="0"
  allowfullscreen loading="lazy">
</iframe>
```

### Newsletter (Mailchimp)
Replace `.newsletter-form` action with your Mailchimp embed URL.

### Google Analytics
Add before `</head>` in all pages:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXX');</script>
```

---

## ♿ Accessibility

- WCAG 2.1 AA compliant markup
- All images have descriptive `alt` text
- Form inputs have associated `<label>` elements
- ARIA roles and landmarks throughout
- Skip-link available (add `<a href="#main" class="sr-only">Skip to content</a>`)
- Keyboard navigable: all interactive elements are focusable
- Sufficient colour contrast ratios (≥4.5:1)

---

## 🌙 Dark/Light Mode

Automatic system preference detection with manual toggle. Theme persists via `localStorage`.

To force dark mode programmatically:
```js
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 🌐 RTL Support

Add `dir="rtl"` to `<html>` and the RTL stylesheet automatically adjusts layout:
```html
<html lang="ar" dir="rtl">
```

---

## 📊 Dashboard

The `/pages/dashboard.html` client portal includes:
- **Live energy output** (simulated, update with real API)
- **Monthly production bar chart** (pure CSS/JS, no library needed)
- **System health progress bars**
- **Energy mix donut chart**
- **Events/alerts data table**
- **Collapsible sidebar** (desktop + mobile)
- **Real-time clock**

To connect real energy data, replace the `LiveData` module in `dashboard.js` with your inverter/monitoring API calls.

---

## 📄 Pages Reference

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, features, calculator, services, testimonials |
| About | `pages/about.html` | Mission, team, values, milestones |
| Services | `pages/services.html` | Service details, pricing, FAQ |
| Blog | `pages/blog.html` | Article listing with sidebar |
| Contact | `pages/contact.html` | Form, map, contact info |
| Dashboard | `pages/dashboard.html` | Client energy monitoring portal |
| 404 | `pages/404.html` | Custom not found page |
| Coming Soon | `pages/coming-soon.html` | Countdown launch page |

---

## ✅ Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 📜 Credits

- **Icons**: [Boxicons](https://boxicons.com) (MIT License)
- **Fonts**: Google Fonts – Inter, Outfit (SIL Open Font License)
- **Images**: AI-generated via Google Gemini

---

## 📞 Support

For customisation help or bug reports, contact: info@solarvolt.com

---

## 📋 Changelog

### v1.0 – March 2025
- Initial release
- 8 pages: Home, About, Services, Blog, Contact, Dashboard, 404, Coming Soon
- Dark/Light mode with system preference detection
- RTL support
- Savings calculator with animated results
- Live energy dashboard with real-time data simulation
- Contact form with client-side validation
- WCAG 2.1 AA accessibility compliance
- Full mobile responsiveness
- SEO meta tags and structured data
