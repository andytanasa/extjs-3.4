import { chromium } from 'playwright';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

async function runAxeOnExample(pathToFile: string, outputFile: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(pathToFile)}`);

  // Inject axe
  await page.addScriptTag({ path: require.resolve('axe-core') });

  // Run axe
  const results = await page.evaluate(() => {
    // @ts-ignore
    window.axe.configure({ reporter: "no-passes" });
    // @ts-ignore
    return window.axe.run();
  });

  // Output
  fs.mkdirSync('a11y-reports', { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`✅ Accessibility results written to ${outputFile}`);

  await browser.close();
}

// === CLI Handling ===
(async () => {
  const filename = process.argv[2];

  if (!filename) {
    console.error("❌ Please provide a filename like: npm run axe -- buttons.html");
    process.exit(1);
  }

  const matchingFiles = await glob(`examples/**/${filename}`);
  if (matchingFiles.length === 0) {
    console.error(`❌ Could not find example file matching '${filename}'`);
    process.exit(1);
  }

  const file = matchingFiles[0]; // Only use the first match
  const out = `a11y-reports/${path.basename(file)}.json`;

  await runAxeOnExample(file, out);
})();
