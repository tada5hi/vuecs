# Bootstrap v4 theme

`@vuecs/theme-bootstrap-v4` ships Bootstrap 4.x class mappings for projects still on the older release line.

```bash
npm install @vuecs/theme-bootstrap-v4 bootstrap@4
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import bootstrap4 from '@vuecs/theme-bootstrap-v4';

app.use(vuecs, { themes: [bootstrap4()] });
```

```css
/* styles.css */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/theme-bootstrap-v4";  /* optional bridge — see caveat */
@import "@vuecs/design";
```

## ⚠️ Bridge has limited reach

The `@vuecs/theme-bootstrap-v4` bridge maps `--primary`, `--success`, etc. onto `--vc-color-*`. **However**: Bootstrap 4's component CSS is **Sass-compiled to literal hex values**, not CSS variables. So:

- ✅ The bridge **does** affect consumer-authored CSS that references `var(--primary)`.
- ❌ The bridge **does not** repalette Bootstrap's built-in components — those are baked at build time.

If you need full runtime palette switching of Bootstrap 4 components, you'd have to rebuild Bootstrap from Sass with a custom `_variables.scss`. For most projects, that's not worth it.

The bridge is shipped for API parity with v5 and for projects that author significant custom CSS on top of Bootstrap 4.

## Recommendation

If you can, **upgrade to Bootstrap v5** and use [`@vuecs/theme-bootstrap-v5`](/themes/bootstrap-v5) — full runtime palette support, smaller surface, no Sass dance.

## See also

- [Bootstrap v5](/themes/bootstrap-v5)
- [Design Tokens](/guide/design-tokens)
