# theme-status-tokens Specification

## Purpose

Defines the minimum text/icon contrast the theme's `success`, `warning`, and `danger` status color tokens must provide, so components built on them (e.g. `Avatar`, `Chip`) are legible and accessible by construction.

## Requirements

### Requirement: Status solid tokens meet WCAG AA contrast
For each status color (`success`, `warning`, `danger`), the theme SHALL define its `solid` variant's background and foreground token pair (`status.bg.<color>` / `status.fg.<color>`) such that the foreground-on-background contrast ratio is at least 4.5:1 (WCAG 2.1 AA for normal text), in both the light and dark theme.

#### Scenario: Light theme solid pairing
- **WHEN** the light theme resolves the `solid` variant tokens for `status.bg.success`, `status.bg.warning`, or `status.bg.danger` paired with their corresponding `status.fg.*` token
- **THEN** the resolved foreground/background pair has a contrast ratio of at least 4.5:1

#### Scenario: Dark theme solid pairing
- **WHEN** the dark theme resolves the `solid` variant tokens for `status.bg.success`, `status.bg.warning`, or `status.bg.danger` paired with their corresponding `status.fg.*` token
- **THEN** the resolved foreground/background pair has a contrast ratio of at least 4.5:1
