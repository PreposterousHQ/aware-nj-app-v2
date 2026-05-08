# A.W.A.R.E. NJ — First Responder App

## What's in this folder

```
aware-nj-app/
  index.html      ← The entire app (single file, no build needed)
  manifest.json   ← PWA manifest (makes it installable)
  sw.js           ← Service worker (enables offline use)
  icons/          ← CREATE THIS FOLDER and add logo files
    icon-192.png  ← AWARE logo at 192×192px
    icon-512.png  ← AWARE logo at 512×512px
    logo.png      ← AWARE logo (any size, used in header)
  README.md       ← This file
```

---

## Step 1 — Add the AWARE logo

1. Create the `icons/` folder
2. Place the AWARE logo PNG into `icons/logo.png`
3. Create two square versions: `icons/icon-192.png` and `icons/icon-512.png`

Then in `index.html`, find the comment block:
```
╔══════════════════════════════════════════════════╗
║  LOGO PLACEHOLDER — REPLACE IN CLAUDE CODE      ║
```

Delete the `<div class="logo-placeholder">...</div>` and replace with:
```html
<img src="icons/logo.png"
     alt="AWARE NJ"
     style="width:84px;height:84px;border-radius:50%;margin-bottom:14px;" />
```

---

## Step 2 — Deploy to GitHub Pages (zero cost)

1. Create a GitHub repo named `aware-nj-app`
2. Push all files in this folder to the `main` branch
3. Go to repo Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`
4. Your app will be live at: `https://yourusername.github.io/aware-nj-app`

---

## Step 3 — Install on a phone (Add to Home Screen)

**iOS (iPhone/iPad):**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. The AWARE NJ icon appears on the home screen

**Android:**
1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home screen" or "Install app"

The app works offline once installed.

---

## Future: App Store distribution

When ready to publish to the App Store or Google Play:
- Use **Capacitor** to wrap this HTML into a native app shell
- Run: `npm install @capacitor/core @capacitor/cli`
- For iOS: `npx cap add ios` (requires Mac + Xcode + $99/yr Apple Developer account)
- For Android APK sideload: free (send `.apk` directly)
- For Google Play: $25 one-time fee

**TestFlight (iOS beta):** Lets you invite up to 10,000 testers via a link — no full App Store listing required. Best for NJ pilot program.

---

## Colors (for brand consistency)
- Background: `#07111F`
- Surface cards: `#0F1E30`
- Blue accent: `#63B3ED`
- Red (urgency): `#E53E3E`
- Amber (questions): `#F59E0B`
- Green (reference): `#68D391`

## No build step required
This is a plain HTML file. No Node.js, no npm, no webpack. Open it in any browser — it works.
