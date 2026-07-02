# Sanctuary — Birthday Website

A dark-luxury, cinematic birthday site built with plain HTML, CSS, and vanilla JS.

## Structure

```
birthday/
├── index.html      → landing page (title, subtitle, "Open My Wish" button)
├── letter.html      → envelope animation, typing letter, polaroid, heart confetti
├── style.css        → all styling (gradient theme, glassmorphism, animations)
├── script.js         → floating hearts, transitions, typing effect, confetti
├── music/
│   └── sanctuary.mp3   ← add your own audio file here (not included)
└── images/
    └── photo.jpg        ← placeholder image included; replace with a real photo
```

## Before you open it

1. **Add your song** — drop an MP3 at `music/sanctuary.mp3`. I couldn't generate
   real audio, so the folder is empty; the site still works without it, it'll
   just play silence until you add a file.
2. **Swap the photo** — `images/photo.jpg` is currently a soft placeholder
   graphic. Replace it with the real photo you want to appear as the polaroid
   (any image works, it'll be cropped to fit).

## Running it

No build step needed — just open `index.html` in a browser, or serve the
folder locally (e.g. `npx serve .`) if your browser restricts local audio
autoplay/file access.

## Notes

- Music only starts after the "Open My Wish" click, per browser autoplay
  rules — this is intentional and required by every modern browser.
- All animation timings (envelope opening, typing speed, photo reveal,
  confetti) are tunable in `script.js` and `style.css` if you want it faster
  or slower.
