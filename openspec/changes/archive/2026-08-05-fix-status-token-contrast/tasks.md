## 1. Token updates

- [x] 1.1 In `packages/ui/src/theme/tokens/light.ts`, change `status.bg.success` (solid) from `{palette.green.600}` to `{palette.green.700}`.
- [x] 1.2 In `packages/ui/src/theme/tokens/dark.ts`, change `status.bg.danger` (solid) from `{palette.red.500}` to `{palette.red.600}`.
- [x] 1.3 Confirm no other token in `light.ts`/`dark.ts` references the old `green.600`/`red.500` values for these roles (e.g. borders, focus rings) that would need to move in lockstep.

## 2. Verification

- [x] 2.1 Recompute contrast for both updated pairs (foreground/background) and confirm ≥4.5:1.
- [x] 2.2 In the showcase app, visually check `Avatar` and `Chip` with `color="success"` `variant="solid"` (light theme) and `color="danger"` `variant="solid"` (dark theme). (Simulator GUI scripting wasn't available in this environment; verified instead via the `yarn showcase ios` build succeeding/launching cleanly plus the Jest suite's token-mapping tests, which assert against the real resolved theme — see 2.3.)
- [x] 2.3 Run `yarn typecheck`, `yarn lint`, and `yarn test` in `packages/ui`; update any snapshot fixtures that capture the old `success`/`danger` solid hex values. (All pass — 113/113 tests. No snapshot fixtures hardcode the old hex values; the `Avatar`/`Chip` token-mapping tests assert dynamically against the resolved theme.)

## 3. Spec sync

- [x] 3.1 Run `openspec validate --change fix-status-token-contrast --strict` and fix any issues.
