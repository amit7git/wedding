# आयुष ♥ पूजा — शादी का निमंत्रण
Static site (no build step). Run locally: `cd wedding && python3 -m http.server 8000` → http://localhost:8000
## Edit details: `config.js` (date, ceremonyTime, venue, map links, family names, events). Leave date/time empty until confirmed.
## Shehnai: put a legally licensed file at `assets/shehnai.mp3` (or change `audio` in config.js). Until then the music button shows "संगीत उपलब्ध नहीं".
## Publish: `npm i -g vercel && cd wedding && vercel --prod` (or drag folder to Netlify / GitHub Pages / Cloudflare Pages).

## Music: save your licensed shehnai file as `wedding/assets/shehnai.mp3` (same folder level as index.html -> assets/). Music starts when the visitor taps the envelope button; the floating button pauses/resumes it.

## Assets: everything lives in `assets/` — `ganesha-icon.png` (Ganesha on the envelope flap + first card), `toran-top.png` (header art), `footer-overlay.png` (footer art), `shehnai.mp3` (music), and the photos below. The gallery section stays hidden until at least one couple photo loads (no broken images).

## Photos (all optional — site looks complete without them):
- **Couple gallery** → `assets/couple01.jpg … couple04.jpg` (list editable via `gallery` in config.js).
- **Event card headers** → `assets/tilak.jpg`, `assets/haldi.jpg`, `assets/mehndi.jpg`, `assets/subh-vivah.jpg` (paths editable via `eventImgs` in config.js). There is no reception photo yet — `eventImgs.swagat` is left `""` so the सुंदर रंगीन हेडर shows. A missing/broken photo is removed automatically — never a broken image.
- Portrait or landscape both work; cards use `object-fit: cover`.

## वधू/वर परिचय: `brideIntro` / `groomIntro` in `config.js`. Each has a `name` and a `details` array (one line per entry). Leave a line out / leave it empty and it is simply not printed — nothing placeholder-like is ever shown to guests.
