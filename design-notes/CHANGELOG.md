# Immidart Dashboard — Design Changelog

## [2026-06-27] Supervisor hero row height increased to 475px — Supervisor
**Files:** src/routes/supervisor.tsx, src/routes/supervisor4.tsx
**Changed:** Updated hero row height from `lg:h-[354px]` to `lg:h-[475px]` on both supervisor variants.
**Why:** User request to increase hero section height.
**Deferred:** supervisor2.tsx and supervisor3.tsx not touched — not requested.

## [2026-06-27] Supervisor hero row height — Supervisor
**Files:** src/routes/supervisor.tsx, src/routes/supervisor4.tsx
**Changed:** Pinned the hero row (Cards | Things to do | Help & Resources) to a fixed `354px` height at the `lg` breakpoint (`lg:h-[354px]` added alongside the existing `items-stretch`/grid-template classes). Below `lg`, the row still stacks to natural content height, unchanged.
**Why:** Direct user request to increase this row's height to 354px on these two specific variants.
**Deferred:** supervisor2.tsx and supervisor3.tsx were left untouched — not requested, and each uses its own column track widths (no shared layout component across the four supervisor variants, so this isn't a one-line propagation). `supervisor4.tsx`'s `helpResources` block doesn't carry its own `h-full` like the other two columns — it still stretches correctly via the grid's default `items-stretch`, so no functional gap, just noted for anyone touching that file next.
