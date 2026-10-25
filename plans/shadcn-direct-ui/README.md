# Plan: shadcn direct UI (Tasks App DS)
- Feature branch: feat/shadcn-direct-ui
- Current phase: P1 — DS tokens and primitives
- Next task: P1.T2
- Last updated: 2026-10-25

## Goal
Delete the ~45 custom `Ui*` wrappers in `client/src/components/ui/`, regenerate the shadcn/ui primitives styled to the Tasks App DS (`design-system/` in this folder, copied from https://claude.ai/artifact/ETKyCDM6Luq1GCm5n6um56), and have every screen use the shadcn components directly. Done means: no `Ui*` file or import left, rules/docs/dependency-cruiser describe direct shadcn usage, all client checks green, every screen works in light/dark at desktop and 375px.

Legend: `[ ]` todo · `[~]` in progress · `[r]` in review · `[x]` merged · `[!]` blocked · `[-]` dropped

## Phase 1 — DS tokens and primitives
Exit criteria: theme CSS carries the DS tokens; regenerated shadcn primitives with DS variants exported from `components/ui`; existing screens (still on wrappers) render; client checks green.
- [x] P1.T1 — Adopt DS theme tokens · ui · PR #19 · deps —
- [~] P1.T2 — Regenerate shadcn primitives · ui · PR — · deps P1.T1
- [ ] P1.T3 — DS variants on primitives · ui · PR — · deps P1.T2

## Phase 2 — Rules and shared components
Exit criteria: dependency-cruiser and docs allow direct shadcn in feature presentation/App; `components/app` and navbar/feedback use primitives only.
- [ ] P2.T1 — Allow direct shadcn imports (rules + docs) · setup · PR — · deps P1.T3
- [ ] P2.T2 — Rebuild components/app on primitives · ui · PR — · deps P2.T1
- [ ] P2.T3 — AppHeader, navbar and feedback · ui · PR — · deps P2.T2

## Phase 3 — Screens use shadcn directly
Exit criteria: `grep -rE "\bUi[A-Z]" client/src --include='*.ts*' | grep -v '^client/src/components/ui/'` is empty; client checks green.
- [ ] P3.T1 — Security screens · ui · PR — · deps P2.T3
- [ ] P3.T2 — Profile · ui · PR — · deps P2.T3
- [ ] P3.T3 — Tasks list and table · ui · PR — · deps P2.T3
- [ ] P3.T4 — Task and delete dialogs · ui · PR — · deps P3.T3
- [ ] P3.T5 — Dashboard · ui · PR — · deps P2.T3
- [ ] P3.T6 — Comparison · ui · PR — · deps P2.T3 · batch B1
- [ ] P3.T7 — App shell and toasts · ui · PR — · deps P2.T3 · batch B1

## Phase 4 — Remove wrappers, docs, acceptance
Exit criteria: no `client/src/components/ui/Ui*`; tests cover DS primitives; docs updated; browser walkthrough passes.
- [ ] P4.T1 — Replace wrapper tests · test · PR — · deps P3.T1–P3.T7
- [ ] P4.T2 — Delete the Ui* wrapper layer · refactor · PR — · deps P4.T1
- [ ] P4.T3 — Vendor DS docs, retire mui-to-shadcn skill · setup · PR — · deps P4.T2
- [ ] P4.T4 — Browser acceptance walkthrough · test · PR — · deps P4.T3
