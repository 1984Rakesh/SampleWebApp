# Plan: shadcn direct UI (Tasks App DS)
- Feature branch: feat/shadcn-direct-ui
- Current phase: P3 — Screens use shadcn directly
- Next: batch B2 = P3.T7 + P4.T1 (not dispatched)
- Last updated: 2026-10-25

## Goal
Delete the ~45 custom `Ui*` wrappers in `client/src/components/ui/`, regenerate the shadcn/ui primitives styled to the Tasks App DS (`design-system/` in this folder, copied from https://claude.ai/artifact/ETKyCDM6Luq1GCm5n6um56), and have every screen use the shadcn components directly. Done means: no `Ui*` file or import left, rules/docs/dependency-cruiser describe direct shadcn usage, all client checks green, every screen works in light/dark at desktop and 375px.

Legend: `[ ]` todo · `[~]` in progress · `[r]` in review · `[x]` merged · `[!]` blocked · `[-]` dropped

## Phase 1 — DS tokens and primitives
Exit criteria: theme CSS carries the DS tokens; regenerated shadcn primitives with DS variants exported from `components/ui`; existing screens (still on wrappers) render; client checks green.
- [x] P1.T1 — Adopt DS theme tokens · ui · PR #19 · deps —
- [x] P1.T2 — Regenerate shadcn primitives · ui · PR #20 · deps P1.T1
- [x] P1.T2a — shadcn CLI alias and quiet verify script · setup · PR #21 · deps P1.T2
- [x] P1.T3 — DS variants on primitives · ui · PR #22 · deps P1.T2a

## Phase 2 — Rules and shared components
Exit criteria: dependency-cruiser and docs allow direct shadcn in feature presentation/App; `components/app` and navbar/feedback use primitives only.
- [x] P2.T1 — Allow direct shadcn imports (rules + docs) · setup · PR #23 · deps P1.T3
- [x] P2.T2 — Rebuild components/app on primitives · ui · PR #24 · deps P2.T1
- [x] P2.T2a — ChecklistRow chip variants (fix-up of PR #24) · fix · PR #25 · deps P2.T2
- [x] P2.T3 — AppHeader, navbar and feedback · ui · PR #26 · deps P2.T2
- [x] P2.T3a — Restore navbar wiring assertions (fix-up of PR #26) · test · PR #27 · deps P2.T3
- [-] P2.T4 — Trim AGENTS.md files to pointers · setup · dropped (done by Manager 2026-10-25)

## Phase 3 — Screens use shadcn directly
Exit criteria: `grep -rE "\bUi[A-Z]" client/src --include='*.ts*' | grep -v '^client/src/components/ui/'` is empty; client checks green.
- [x] P3.T1 — Security screens · ui · PR #28 · deps P2.T3
- [x] P3.T2 — Profile · ui · PR #29 · deps P2.T3
- [x] P3.T2a — Profile form Cancel and card titles (fix-up of PR #29) · fix · PR #30 · deps P3.T2
- [x] P3.T3 — Tasks list and table · ui · PR #31 · deps P2.T3
- [x] P3.T4 — Task and delete dialogs · ui · PR #32 · deps P3.T3
- [x] P3.T5 — Dashboard · ui · PR #33 · deps P2.T3
- [x] P3.T6 — Comparison · ui · PR #34 · deps P2.T3 · batch B1
- [ ] P3.T7 — App shell and toasts · ui · PR — · deps P2.T3 · batch B1

## Phase 4 — Remove wrappers, docs, acceptance
Exit criteria: no `client/src/components/ui/Ui*`; tests cover DS primitives; docs updated; browser walkthrough passes.
- [ ] P4.T1 — Replace wrapper tests · test · PR — · deps P3.T1–P3.T7
- [ ] P4.T2 — Delete the Ui* wrapper layer · refactor · PR — · deps P4.T1
- [ ] P4.T3 — Vendor DS docs · setup · PR — · deps P4.T2
- [ ] P4.T4 — Browser acceptance walkthrough · test · PR — · deps P4.T3
