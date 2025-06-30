# AGENTS.md – Accessibility Improvement Instructions for Codex Cloud

## 📍 Objective

Make the **ExtJS 3.4 components** compliant with **WCAG 2.2 AA accessibility standards**, using **axe-core** for automated testing and validation.

You are to perform **minimal, functional changes only** to the ExtJS source code (e.g., components, templates, rendering logic) to eliminate accessibility violations. The examples in `examples/` are provided only as a rendering entry point and are not to be modified except for rendering verification purposes.

---

## 📁 Project Structure

```
/extjs-source/
├── examples/             # Standalone HTML examples using ExtJS components
│   ├── button.html
│   ├── form.html
│   └── ...
├── src/                  # ExtJS 3.4 core source code (components/templates)
├── resources/            # Assets
├── ext-all-debug.js      # Bundled debug build
└── tests/
    └── a11y/
        └── run-a11y.ts   # Axe runner script
```

---

## ✅ Scope of Fixes

### You Must Fix:

- Missing accessible names (`aria-label`, `aria-labelledby`, visible text)
- Misused semantic elements (e.g., `<i>` for spacing)
- Improper roles or missing roles (`role="button"`, `role="presentation"`)
- Screen reader traps or invisible focusable elements
- Inputs missing labels
- Improper keyboard navigation and focus handling

### You Must NOT:

- Modify CSS, layout, spacing, colors, fonts, contrast
- Visually alter any component's appearance
- Refactor ExtJS internal API or change business logic unless required for accessibility

---

## 🧪 Accessibility Test Workflow (axe-core)

Use the following script to run automated tests:

```ts
// tests/a11y/run-a11y.ts
import { chromium } from 'playwright';
import fs from 'fs';

async function runAxeOnExample(filePath: string, reportPath: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${filePath}`);
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const results = await page.evaluate(() => (window as any).axe.run());
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  await browser.close();

  if (results.violations.length > 0) {
    console.error(`${results.violations.length} violations found`);
    process.exit(1);
  }
}
```

---

## 📅 Workflow

1. **Identify which ExtJS component is responsible** for rendering markup seen in `examples/*.html`.
2. **Run axe-core** using the provided script against that example file.
3. If any violations are reported:
    - Open the related ExtJS component in `/src/`
    - Make a **minimal** fix to eliminate one or more violations
    - Re-run `run-a11y.ts` to verify the fix
4. Repeat this cycle until axe reports **0 violations** for the example

> ⚠️ Do not modify the `examples/` files unless absolutely necessary for rendering or testing purposes.

---

## 🔍 Common Violations & Fixes

| Violation                               | Recommended Fix                                      |
| --------------------------------------- | ---------------------------------------------------- |
| Button has no accessible name           | Add `aria-label`, `aria-labelledby`, or visible text |
| Layout table interpreted as data        | Add `role="presentation"`                            |
| `<input>` missing label                 | Add `<label for="...">` or use `aria-label`          |
| Decorative markup exposed to AT         | Add `aria-hidden="true"`                             |
| Non-interactive element used as control | Add `role`, `tabindex`, keyboard events              |

---

## 📚 Commit Guidelines

Use clear, descriptive commits for each fix. Example:

```bash
fix(a11y): add aria-label to unnamed button in Ext.Button template
```

---

## ❌ Out of Scope

- CSS or visual adjustments
- Accessibility improvements unrelated to axe-core violations
- Changing ExtJS public APIs or component behavior

---

## 🧲 Completion Criteria

- All `examples/*.html` render correctly and pass `axe-core` audit with **0 violations**
- Visual appearance of all components remains unchanged
- All modifications are limited to ExtJS component rendering logic

---

## ⚡ Suggested NPM Setup

```bash
npm install --save-dev playwright axe-core ts-node glob
```

To run tests:

```bash
npx ts-node tests/a11y/run-a11y.ts
```

---

## 🚀 Final Notes

- Axe-core is the **validation oracle**. Use its results to guide and verify all changes.
- Only iterate on source files inside `/src/` that are responsible for rendering the markup.
- If a change to ExtJS internals is required for an accessibility fix, isolate and document the reasoning.

---
