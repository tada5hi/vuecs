# Dependency Flow

```
Themes        ──configure──> ThemeManager    (in @vuecs/core)
Defaults      ──configure──> DefaultsManager (in @vuecs/core)
Design tokens ──configure──> CSS custom properties (--vc-color-*, --vc-radius-*) from @vuecs/design
                          |
Components ──read─────────┘ (via useComponentTheme / useComponentDefaults;
                             CSS resolves token vars at browser time)
     |
     └──> @vuecs/link (navigation uses link for route-aware anchors)
```
