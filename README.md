# HealthTrack AI

## Local setup

1. Copy the config template and add your Gemini API key:

   ```powershell
   cd C:\Users\Joseph\Documents\HealthWebsite
   copy config.example.js config.js
   ```

2. Edit `config.js` and paste your key from [Google AI Studio](https://aistudio.google.com/apikey).

3. Open `index.html` in a browser (or use a local server).

`config.js` is in `.gitignore` and will **not** be pushed to Git.

## Netlify deploy (Git)

1. Push this repo to GitHub (without `config.js`).

2. In [Netlify](https://app.netlify.com/) → your site → **Site configuration** → **Environment variables**, add:

   | Variable | Value |
   |----------|--------|
   | `GEMINI_API_KEY` | your Gemini API key |

3. Connect the site to your Git repo. Each push runs `node scripts/generate-config.js`, which creates `config.js` during the build.

Optional: `GEMINI_MODEL` (default: `gemini-2.5-flash-lite`).

## Files

| File | Committed to Git? |
|------|-------------------|
| `index.html` | Yes |
| `config.example.js` | Yes (template only) |
| `config.js` | **No** (secrets) |
