# DEXTERITY.IT - Static Website Files

## 📁 Complete File Structure

```
dexterity-website/
│
├── index.html              ✅ Created (Home page)
├── services.html           ✅ Created (Services overview)
├── services-detail.html    ✅ Created (Dynamic service detail)
├── courses.html            ✅ Created (Courses overview)
├── courses-detail.html     ✅ Created (Dynamic course detail)
├── docs.html               ✅ Created (Documentation library)
├── docs-detail.html        ✅ Created (Dynamic doc detail)
├── about.html              ✅ Created (Company profile)
├── terms.html              ✅ Created (Terms of service)
├── privacy.html            ✅ Created (Privacy policy)
├── contact.html            ✅ Created (Contact form)
├── 404.html                ✅ Created (Not found page)
├── 500.html                ✅ Created (Server error page)
│
├── css/
│   ├── styles.css          ✅ Created (Main stylesheet)
│   └── pages.css           📝 Optional (Page-specific styles)
│
├── js/
│   ├── main.js             ✅ Created (Core functionality)
│   └── pages.js            📝 Optional (Page-specific JS)
│
├── images/
│   ├── logo.png            📝 Your logo
│   └── favicon.ico         📝 Favicon
│
├── files/
│   ├── cv.pdf              ✅ Placeholder – replace with resume
│   ├── muhannad-ataya.vcf  ✅ Placeholder – replace with vCard
│   ├── azure-landing-zone-blueprint.zip ✅ Placeholder – replace with archive
│   ├── zero-trust-playbook.pdf ✅ Placeholder – replace with playbook
│   ├── copilot-adoption-guide.pdf ✅ Placeholder – replace with guide
│   └── sre-oncall-runbook.pdf ✅ Placeholder – replace with runbook
│
└── .htaccess               ✅ Created (Apache config)
```

## 🚀 Quick Start

### 1. Upload to Your Server
Upload all files to your web hosting via FTP/SFTP maintaining the folder structure.

### 2. Configure Domain
Point your domain `dexterity.it` to your server's IP address in your DNS settings.

### 3. Enable SSL
Use Let's Encrypt or your hosting provider's SSL certificate, then uncomment the HTTPS redirect in `.htaccess`.

### 4. Test
Visit `https://dexterity.it` and verify all pages work correctly.

## 📝 Page Overview

Each static page mirrors the original React experience. Customize the content per page:

### services.html
- Grid of service cards (Custom Development, AI Integration, Cloud Architecture, etc.)
- Each card links to `services-detail.html?slug=service-name`

### courses.html
- Grid of course cards with level and duration badges
- Each card links to `courses-detail.html?slug=course-name`
- Filter panel (search, difficulty, topic, duration) with live catalogue updates
- Progress tracker cards surface enrolment status

### docs.html
- Search bar and category filters
- Documentation cards with tags
- Links to `docs-detail.html?slug=doc-name`
- Kali Linux-inspired layout with sidebar, hero header, dark/light mode, and syntax-highlighted code blocks
- Global dark/light mode toggle wired into the navigation (desktop & mobile) and fallback buttons on error pages
- Fixed sidebar navigation, table of contents, dark/light mode, and code copy helpers

### about.html
- Your bio and photo
- Download links for resume and vCard
- Social media links (GitHub, LinkedIn)

### contact.html
- Contact form (configure Formspree or similar)
- Email, phone, location info

### terms.html & privacy.html
- Legal text from your business

## 🎨 Customization Tips

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --cyan-400: #22d3ee;  /* Change main accent color */
    --blue-600: #2563eb;  /* Change secondary color */
}
```

### Navigation
Edit links in the `<nav>` section of each HTML file.

### Content
Replace placeholder text in each page with your actual content.

### Course resource links
Update the Notion and GitHub URLs in `courses.html` and the doc detail mappings inside `js/main.js` so they point to live workspaces and repositories.

## 🔧 Advanced Features

### Form Handling
The contact form uses Formspree. Sign up at https://formspree.io and replace:
```html
<form action="https://formspree.io/f/your-id" method="POST">
```

### Analytics
Add Google Analytics or Plausible by inserting tracking code before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Clean URLs
The `.htaccess` file removes `.html` extensions, so:
- `index.html` becomes `/`
- `about.html` becomes `/about`
- `services.html` becomes `/services`

## 📱 Mobile Responsive
All pages are mobile-responsive by default. Test on different devices.

## 🔐 Security
- `.htaccess` includes security headers
- Sensitive files are protected
- Enable HTTPS in production

## 🌐 Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📧 Support
For questions: contact@dexterity.it

---

**Next Steps:** Create the remaining HTML pages using `index.html` as a template. Copy the navigation and footer sections, then add page-specific content in the `<main>` section.
