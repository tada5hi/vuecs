# @vuecs-tests/visual-regression

Playwright snapshots of every shared demo view (`examples/_shared/src/views/*.vue`) rendered through each shipping theme:

| Theme | Example app | Port |
|---|---|---|
| `@vuecs/theme-tailwind` | `examples/tailwind/` | 5180 |
| `@vuecs/theme-bootstrap` | `examples/bootstrap/` | 5181 |
| `@vuecs/theme-bulma` | `examples/bulma/` | 5182 |

The same `sharedRoutes` catalog drives both this matrix and the example apps' nav — adding a view in `examples/_shared/src/routes.ts` lights it up here automatically.

## Running locally

```bash
# One-time: install Chromium + its system deps
npm run -w @vuecs-tests/visual-regression install:browsers

# Run the snapshot comparison
npm run -w @vuecs-tests/visual-regression test

# After an intentional visual change — regenerate baselines
npm run -w @vuecs-tests/visual-regression test:update

# Inspect the HTML report after a failure
npm run -w @vuecs-tests/visual-regression report
```

Playwright boots the three example app dev servers automatically via its `webServer` config — `reuseExistingServer: true` outside CI, so a manual `vite dev` session keeps working.

## Baselines

Snapshots live under `specs/__snapshots__/themes.spec.ts/<theme>-<route>.png` and **are committed to git**. They're how CI knows what "correct" looks like.

**Baselines are platform-specific.** Font hinting + subpixel rendering differs between macOS, Windows, and Linux. CI runs on Ubuntu, so baselines must be generated on Ubuntu to avoid false positives.

To bootstrap or update baselines without an Ubuntu host:

1. Trigger the `visual-regression-update` workflow via the GitHub Actions UI (`workflow_dispatch`). It runs Playwright with `--update-snapshots` and commits the generated PNGs back via a PR.
2. Or run locally in Docker — pin the image tag to the **same Playwright
   version as `@playwright/test` in `package-lock.json`** (currently
   1.59.1). A mismatched image ships a different Chromium build + font
   stack and produces baselines that won't match the CI runner:
   ```bash
   docker run --rm -it -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.59.1-jammy bash
   # inside container:
   npm ci && npm run -w @vuecs-tests/visual-regression test:update
   ```
   Re-pin the tag when bumping `@playwright/test`.

## Tolerance

`maxDiffPixelRatio: 0.002` — 0.2% pixel difference is the Playwright-recommended default for theme-level diffs. Tighten in `playwright.config.ts` once false positives prove rare.
