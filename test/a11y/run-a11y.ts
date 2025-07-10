import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { chromium } from 'playwright';

async function runAxeOnExample(pathToFile: string, reportDir: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fileUrl = `file://${path.resolve(pathToFile)}`;
  await page.goto(fileUrl);

  const jsonPath = path.join(reportDir, `Results.json`);
  const screenshotPath = path.join(reportDir, `Screenshot.png`);
  const htmlPath = path.join(reportDir, `Report.html`);

  fs.mkdirSync(reportDir, { recursive: true });

  // take screenies
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);

  // Inject axe
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const results = await page.evaluate(() => {
    // @ts-ignore
    window.axe.configure({
      reporter: 'v2',
      branding: {
        application: 'axe-playwright-report'
      }
    });

    // @ts-ignore
    return window.axe.run(document.body, {
      runOnly: {
        type: 'tag',
        values: ['wcag22aa', 'wcag21aa'], // https://github.com/dequelabs/axe-core/blob/237a5861b0fb044c885b154436696279deca7a13/doc/API.md?plain=1#L82
      },
      resultTypes: ['violations'], // Ignore passes, incomplete, inapplicable
      exclude: ['body > h1', 'body > h2', 'body > h3', 'body > p'] // eclude tags that are not important
    });
  });

  // Write JSON results
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`✅ JSON results written to ${jsonPath}`);

  // Generate HTML report with embedded screenshot
  const screenshotData = fs.readFileSync(screenshotPath);
  const html = createHtmlReport({
    results: results,
    attachments: [
      {
        data: screenshotData.toString('base64'),
        mimeType: 'image/png',
        path: path.basename(screenshotPath),
      },
    ],
  } as any);

  fs.writeFileSync(htmlPath, html);
  console.log(`✅ HTML report written to ${htmlPath}`);

  await browser.close();
}

// === CLI Handling ===
(async () => {
  const userInput = process.argv[2];
  const pattern = userInput ? `examples/**/${userInput}` : `examples/**/*.html`;

  const matchedFiles = await glob(pattern);

  if (matchedFiles.length === 0) {
    console.error(`❌ Could not find any HTML files matching '${userInput || '*.html'}'`);
    process.exit(1);
  }

  for (const file of matchedFiles) {
    const baseName = path.basename(file, '.html');
    const reportDir = path.join('artifacts', baseName);
    console.log(`\n▶ Running axe on: ${file}`);
    await runAxeOnExample(file, reportDir);
  }
})();
 