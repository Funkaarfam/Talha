# Talha VFX Portfolio

A cinematic, film-noir portfolio site for a VFX artist and video editor.  
Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

---

## File Structure

```
portfolio/
├── index.html       ← Homepage (hero, work, about, skills, CTA, footer)
├── work.html        ← Full filterable project grid
├── about.html       ← Services, experience timeline
├── contact.html     ← Contact form + info cards
├── 404.html         ← "Frame Not Found" error page
├── 403.html         ← "Access Denied" error page
├── styles.css       ← All styles (single unified file)
├── main.js          ← All behaviour (cursor, grain, nav, reveal, etc.)
├── talha.png        ← Your photo (used in About section)
└── project1–6.mp4   ← Your project videos (add these yourself)
```

---

## Adding Your Videos

Each project card expects a video file. Just drop them in the same folder:

| File name     | Used in          |
|---------------|------------------|
| `Project1.mp4` | Card 01 (index + work page) |
| `Project2.mp4` | Card 02 |
| `Project3.mp4` | Card 03 |
| `Project4.mp4` | Card 04 |
| `Project5.mp4` | Card 05 (work page only) |
| `Project6.mp4` | Card 06 (work page only) |

Videos auto-play silently on hover and open full-screen in a modal on click.  
Recommended format: H.264 MP4, 1080p, under 20MB per clip for fast loading.

---

## Customisation

### Personal details
Search and replace `Talhaavaan@gmail.com` with your actual email address across all HTML files.

### Photo
Replace `talha.png` with your own photo. The About section expects a portrait (3:4 ratio works best).

### Social links
In `index.html`, find the footer `Connect` column and update the `href="#"` links:
```html
<a href="https://instagram.com/yourhandle">Instagram</a>
<a href="https://vimeo.com/yourhandle">Vimeo</a>
<a href="https://linkedin.com/in/yourhandle">LinkedIn</a>
<a href="https://behance.net/yourhandle">Behance</a>
```

### Contact form
The form currently simulates a successful send after a delay. To make it functional, replace the `setTimeout` block inside `initContactForm()` in `main.js` with a real API call (e.g. Formspree, EmailJS, or your own backend).

---

## Deployment

This is a static site — deploy anywhere:

- **Netlify / Vercel**: drag-and-drop the folder or connect your repo
- **GitHub Pages**: push to a `gh-pages` branch
- **Any web host**: upload via FTP

For 404 and 403 pages to work automatically, configure your host to serve `404.html` for missing pages (most hosts do this by default for files named `404.html`).

---

## Tech

- **Fonts**: Cormorant Garamond (display) + Outfit (body) via Google Fonts
- **Cursor**: custom JS with LERP smoothing
- **Grain**: animated canvas overlay
- **Reveal**: IntersectionObserver with stagger
- **Page transitions**: CSS `scaleY` wipe on navigation
- **No dependencies** — everything is vanilla

---

© 2026 Talha. All rights reserved.
