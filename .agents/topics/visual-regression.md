# Visual regression CI

Playwright snapshots every shared demo view × every shipping theme
to catch unintentional visual drift. Lives in a private workspace at
`tests/visual-regression/`, included by the root workspace configuration.

```
tests/visual-regression/
  playwright.config.ts   <- webServer boots all 3 example apps
                             (:5180 tailwind, :5181 bootstrap, :5182 bulma)
  specs/themes.spec.ts   <- reads sharedRoutes from @vuecs-examples/shared/routes
                             generates 99 tests (3 themes × 33 routes)
  specs/__snapshots__/   <- committed baselines (one PNG per test)
  package.json           <- @vuecs-tests/visual-regression (private)
```

Adding a view to `examples/_shared/src/routes.ts` automatically lights
it up in this matrix on every theme — no separate registration step.

**CI wiring:**
- `.github/workflows/visual-regression.yml` — runs on PRs that touch
  packages / themes / icons / examples / the visual-regression
  workspace itself. Builds, installs Chromium, runs `playwright test`
  in compare-only mode. Uploads the HTML report as a workflow
  artefact on failure. Includes a **self-bootstrap guard**: if
  `specs/__snapshots__/` contains no `.png` files, the workflow emits
  a warning and skips comparison (rather than failing on missing
  baselines). The guard becomes a no-op once the first baseline run
  lands.
- `.github/workflows/visual-regression-update.yml` — manually
  triggered (`workflow_dispatch`). Runs `playwright test --update-snapshots`
  on Ubuntu, then opens a PR with the regenerated PNGs via
  `peter-evans/create-pull-request`.

**Why two workflows.** Baselines are platform-specific (font hinting +
subpixel rendering differs by OS). Generating them on macOS / Windows
produces baselines that won't match the Ubuntu CI runner. The update
workflow runs in the same Ubuntu environment as the compare workflow,
so the two stay aligned. Local iteration uses Docker — pin the image
tag to the exact Playwright version locked in `package-lock.json`
(e.g. `mcr.microsoft.com/playwright:v1.59.1-jammy` while
`@playwright/test@1.59.1` is locked). A mismatched image ships a
different Chromium build + font stack, defeating the whole point of
matching CI.

**Bootstrap status.** Infrastructure is shipped; the actual baseline
PNGs are not yet committed. Maintainer triggers the update workflow
once to generate the initial 99 baselines, then subsequent PRs
compare against them. Documented at
`tests/visual-regression/README.md`.

**Tolerance.** `maxDiffPixelRatio: 0.002` — 0.2% pixel difference is
Playwright's recommended default for theme-level diffs. Tighten in
`playwright.config.ts` once false positives prove rare.
