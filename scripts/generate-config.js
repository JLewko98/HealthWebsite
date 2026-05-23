/**
 * Netlify build step: creates config.js from environment variables.
 * Set GEMINI_API_KEY in Netlify → Site configuration → Environment variables
 */
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

if (!apiKey) {
  console.error(
    'Missing GEMINI_API_KEY. Add it in Netlify under Environment variables.'
  );
  process.exit(1);
}

const outPath = path.join(__dirname, '..', 'config.js');
const content = `window.APP_CONFIG = {
  API_KEY: ${JSON.stringify(apiKey)},
  MODEL_NAME: ${JSON.stringify(model)},
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Generated config.js for deploy (model:', model + ')');
