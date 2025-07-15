## ExtJS 3.4 Accessibility Modernization – AI Agent Instructions

This project upgrades ExtJS 3.4 components for WCAG 2.2 AA compliance using automated axe-core testing. All changes must preserve legacy browser support and visual appearance.

---

## 🏗️ Architecture & File Boundaries

- **Component System:** All UI elements extend from `Ext.Component` → `Ext.BoxComponent` → widget classes. Rendering logic is in `onRender` and `tpl` properties.
- **Source vs Examples:** Only modify `src/` for framework fixes. `examples/` are for demo/testing—change only for example-specific accessibility issues.
- **Build:** Source in `src/` is concatenated (see `ordered-files.js`) into `ext-all-debug.js`. Always run `npm run build` after editing `src/`.
- **Testing:** Accessibility is validated by running Playwright + axe-core on HTML files in `examples/`. Reports are output to `a11y-reports/` and `artifacts/`.

---

## 🚦 Developer Workflow

1. **Inspect the component source** (especially `onRender` and template variables) for HTML/ARIA issues.
2. **Run accessibility test:**
   ```sh
   npm run axe -- <example-subdir>/<example.html>
   ```
3. **Fix violations in `src/`** (not in `examples/` unless the example itself is at fault).
4. **Rebuild:**
   ```sh
   npm run build
   ```
5. **Re-test** until axe reports 0 violations.

**Example:**
```sh
npm run axe -- button/buttons.html
npm run build
npm run axe -- button/buttons.html
```

---

## 📁 Key Patterns & Conventions

- **Templates:** Components use string templates with `{placeholder}` syntax. Example:
  ```js
  var tpl = new Ext.Template('<div class="{cls}">{text}</div>');
  tpl.append(ct, {cls: 'x-btn', text: 'Click me'});
  ```
- **ARIA:** Add ARIA attributes directly in templates, not post-render. Prefer semantic HTML over ARIA roles when possible.
- **Screen Reader Text:** Use the `.sr-only` CSS class for visually hidden labels.
- **Focus:** Managed in `onRender` and event handlers. Ensure visible focus indicators.
- **No CSS/Visual Changes:** Do not alter layout, colors, or fonts—fix only markup/ARIA.

---

## 🛑 Common Violations & Fixes

| Violation                               | Fix Example                                      |
|-----------------------------------------|--------------------------------------------------|
| Button has no accessible name           | Add `aria-label`, `aria-labelledby`, or text      |
| `<input>` missing label                 | Add `<label for="...">` or `aria-label`           |
| Layout table interpreted as data        | Add `role="presentation"`                        |
| Decorative markup exposed to AT         | Add `aria-hidden="true"`                         |
| Non-interactive element as control      | Add `role`, `tabindex`, keyboard events           |

```js
// ❌ Bad: Icon-only button
{iconCls: 'add16', tooltip: 'Add User'}
// ✅ Good: Add hidden text
{iconCls: 'add16', text: '<span class="sr-only">Add User</span>'}
```

---

## 🔑 Key Files & Directories

- `src/widgets/Component.js` – Base rendering logic
- `src/widgets/form/FieldSet.js` – Example ARIA/role issues
- `src/widgets/form/Field.js`, `TextField.js`, `Checkbox.js`, etc. – Input patterns
- `examples/` – Demo HTMLs for testing
- `test/a11y/run-a11y.ts` – Axe runner config
- `AGENTS.md` – Full accessibility requirements

---

## 🧪 Commit & Completion

- Use clear, conventional commits (e.g. `fix(a11y): add aria-label to Ext.Button`)
- All example pages must pass axe-core with 0 violations
- Never change visual appearance or ExtJS public APIs

---

## 📝 Final Notes

- Axe-core is the validation oracle—use its results to guide all changes
- Only fix components/examples you are asked to—do not attempt global refactors
- Always rebuild after `src/` changes
- If a fix requires changing ExtJS internals, document the reason
- `gulp` - Concatenates source files using `ordered-files.js`
- `playwright` - Drives headless browser for testing
- `axe-core` - Accessibility violation detection
- `ts-node` - Runs TypeScript test runner

## Key Files for AI Agents

- `src/widgets/Component.js` - Base component class, core rendering patterns
- `src/widgets/form/FieldSet.js` - Example of ARIA role violations
- `examples/form/check-radio.html` - Demonstrates component integration
- `test/a11y/run-a11y.ts` - Test runner configuration
- `AGENTS.md` - Detailed accessibility requirements and scope

## Integration Boundaries

**Source vs Examples**: Only modify `src/` components for framework fixes. `examples/` are test cases - change only for testing or example-specific accessibility issues.

**CSS Constraints**: Never modify visual appearance, colors, or layout. Focus purely on semantic HTML and ARIA attributes.

**Legacy Browser Support**: ExtJS 3.4 targets IE6+, so use compatible HTML/ARIA patterns.
