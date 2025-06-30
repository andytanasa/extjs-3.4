# AGENTS.md – Accessibility Improvement Instructions for Codex Cloud

## 📍 Objective

Make the **ExtJS 3.4 components** compliant with **WCAG 2.2 AA accessibility standards**, using **axe-core** for automated testing and validation.

You are to perform **minimal, functional changes only** to the ExtJS source code (e.g., components, templates, rendering logic) to eliminate
accessibility violations.
The examples in `examples/` are provided only as a rendering entry point and are not to be modified except for rendering verification purposes or to fix accessibility issues within the example code itself.
Each example directory might contain multiple html files that showcase different functionality of the same component. Each of the html file is treated as a separate test axe reporter will run on.
Component fixes should be limited only to the components and respective examples you were asked to fix. *DO NOT ATTEMPT* to fix everything in one go.

---

## 📁 Project Structure

```
/extjs-3.4/
├── examples/             # Standalone HTML examples using ExtJS components
│   ├── button
│       └──buttons.html
│   ├── form
│       └──absform.html
│       └──anchoring.html
│       └──check-radio.html
│       └──...
├── src/                  # ExtJS 3.4 core source code (components/templates)
├── resources/            # Assets
├── ext-all-debug.js      # Bundled debug build
└── test/
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
- Any other highlighted violations in the axe reports

### You Must NOT:

- Modify CSS, layout, spacing, colors, fonts, contrast
- Visually alter any component's appearance
- Refactor ExtJS internal API or change business logic unless required for accessibility

---

## 🧪 Accessibility Test Workflow (axe-core)

Script Invocation

Use the following command to run accessibility checks on a specific example:

```sh
npm run axe -- <example-filename.html>
```
This will:

Run axe-core tests against the matching file in the `examples/` directory
Produce a JSON report in `a11y-reports/<example-filename>.json`. 
Example filename should include the example subdirectory.

Example: 
```sh
npm run axe -- button/buttons.html
```
Will produce:
```
a11y-reports/button.html.json
```

---

## 📅 Workflow

1. Given a component name or list of components, determine where is the source code responsible for them
2. Inspect source code of the components and especially onRender. Look for html markup code and component templates. Inspect them for accessibility issues and attempt to fix them.
3. Given a component name or list of components, determine which `examples/<component name/*.html` file(s) render those components.
4. For each matched file:
   - Run `npm run axe -- <example subdirectory>/<example-filename.html>`
   - Review the corresponding `a11y-reports/<example-filename>.json`
5. If any violations are reported:
   - Locate and modify the responsible component inside the `src/` directory
   - Immediately run `npm run build` after modifying any files in `src/` to regenerate the bundled `ext-all-debug.js`
   - Re-run the axe test with `npm run axe` to confirm the fix
   - If the violations relate to any code that is located within the example directory, clearly say so and do not attempt to fix it in `src/` directory
6. Repeat this cycle until axe reports **0 error violations** for the example

> ⚠️ Do not modify the `examples/` files unless absolutely necessary for rendering or testing purposes or for fixing the accessibility issues within example files themselves.

---

## 🔍 Common Violations & Fixes

| Violation                               | Recommended Fix                                      |
|-----------------------------------------|------------------------------------------------------|
| Button has no accessible name           | Add `aria-label`, `aria-labelledby`, or visible text |
| Layout table interpreted as data        | Add `role="presentation"`                            |
| `<input>` missing label                 | Add `<label for="...">` or use `aria-label`          |
| Decorative markup exposed to AT         | Add `aria-hidden="true"`                             |
| Non-interactive element used as control | Add `role`, `tabindex`, keyboard events              |

---

## 📚 Commit Guidelines

Use clear, descriptive commits for each fix. Should follow conventional-commit style. Example:

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

- All `examples/<component name>/*.html` render correctly and pass `axe-core` audit with **0 error violations**
- Visual appearance of all components remains unchanged
- All modifications are limited to ExtJS component rendering logic
---

## 🚀 Final Notes

- Axe-core is the **validation oracle**. Use its results to guide and verify all changes.
- Only iterate on source files inside `/src/` that are responsible for rendering the markup.
- If a change to ExtJS internals is required for an accessibility fix, isolate and document the reasoning.
- Always rebuild using npm run build to apply changes to example behavior.
- Try to distinct the reported violations that are caused by example code versus the component code. Attempt to fix the example code if necessary. 
- Limit yourself only to the components and respective examples you were asked to do. *DO NOT ATTEMPT* to fix everything in one go.

---
