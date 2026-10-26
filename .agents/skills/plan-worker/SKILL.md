---
name: plan-worker
description: Execute one task or batch from a Manager plan (plans/<feature-slug>/tasks/<ID>.md) with minimal turns and tokens, then open one PR. User-invoked only; the local-agent copy of the Devin "Plan Worker" playbook.
argument-hint: "Base: <branch> | Task: <task file path> (one per task) | Files: <space-separated paths>"
triggers: ["user"]
---

# Plan Worker

You execute one task (or one batch) from a plan written by the Manager (Claude). The Manager owns scope, review and merging. You own execution and a clean PR.

**Read only what the task needs.** Every file you open, and every turn you take, costs context: the whole context is re-sent on each turn. Target 5 turns for a normal task: (1) sync + read everything, (2) edits + verify + task-file update + commit + push, (3) open the PR, (4) reply, plus at most one turn for a failure. Put independent reads and commands in one turn as one chained command.

**Write tersely.** Between tool calls write at most one short line, or nothing: no plans, step summaries or restated task text. Full detail belongs only in the PR body.

**Never** search skills or knowledge, check CI, or invoke the `clean-architecture`, `client-architecture` or `server-architecture` skills unless the task's **Read only** line names one. The task file, conventions and `check:architecture` (inside verify) cover normal tasks.

## Inputs (from the prompt)
- `Base` branch, one `Task:` line per task (`plans/<feature-slug>/tasks/<ID>.md`), and a `Files:` line (space-separated, repo-root paths).
- Several `Task:` lines = a batch (see Batches). The task file is the single source of truth; if `Files:` and the task file differ, the task file wins.

## What you read and write
| File | You |
|---|---|
| `plans/<feature-slug>/tasks/<ID>.md` | read; write only `Status`, `PR` and the `## Report (Worker)` section |
| `plans/<feature-slug>/conventions.md` | read |
| `plans/RULES.md` | read only `## Verify commands` |
| `AGENTS.md`, `*/AGENTS.md`, `.agents/skills/*` | never open them |
| `README.md`, `decisions.md`, `questions.md`, `changelog.md`, other task files | never read or write |

Exception: if your task file names another task file, PR or source file as a reference, open that one.

## 1. Sync and read (one command)
- Work in the current checkout (the repo root). If `npm`/`node` is not on PATH, `source ~/.nvm/nvm.sh` in the same command.
- Your first command does all of this: `git fetch -q`, check out **Base** and `git pull -q`, create **Branch** from it, `cat -n` the task file(s), `conventions.md` and every path on the `Files:` line, print RULES.md's verify section (`sed -n '/^## Verify commands/,/^## Task types/p' plans/RULES.md`), and install dependencies quietly (`(cd client && npm ci > /tmp/install.log 2>&1 && echo INSTALL OK || tail -n 30 /tmp/install.log)`).
- If the working tree has uncommitted changes, stop and report instead of stashing or discarding them. After the push, check out **Base** again so the checkout is left as you found it.
- Note Type, Branch, Base, Files, Context, Do, Done when and Manager notes. Manager notes override general habits; they never override RULES.md or conventions.md (if they conflict, follow the notes and flag it in the PR).
- Beyond your Files, read only the references the task's **Read only** line names, and only the line ranges given; add them to the first command when you can. Never `cat` a reference over ~150 lines: `grep -n` the names you need and `sed -n` just those ranges.
- Everything else is off-limits, including `Ui*` wrapper sources and design-system files not on the **Read only** line. If a fact is missing, one `grep -n` per question is allowed; record the gap under Open questions.
- Facts stated in the task file or conventions are true: don't run experiments to confirm them. Probing tool behaviour is capped at 2 commands per question; past that, record it under Open questions.

## 2. Branch
- **Branch** comes from the latest **Base**. Never branch from `main` unless Base says so. Base is the feature branch for normal tasks and the parent task's branch for fix-ups (`<ID>a`).

## 3. Execute, in scope
- Touch only the listed **Files**, plus small, clearly required changes elsewhere (list them in the Report).
- Obey the Type: `refactor` no behaviour or visual change, existing tests pass unchanged · `ui` no business-logic change, match the spec, visual and viewport checks are the Manager's · `test` tests only · `setup` tooling/config only · `fix` only the findings listed in Do.
- Never add features, refactor unrelated code or edit other tasks. Suggestions go in the PR body.
- Class strings, attribute values, commands and code shapes given in Do tables or Manager notes are mandatory: copy them verbatim. Before verify, check each Manager-notes bullet against your edits.

## 4. Edit, verify, record and commit (one command)
- In a single foreground command, chained with `&&` from the repo root: write all edits; run verify (`(cd client && npm run verify > /tmp/verify.log 2>&1) && echo VERIFY OK`); run every **Done when** check; update the task file (`Status: [r]`, `PR: pending`, the Report lines below); `git add -A && git commit -q -m "<ID>: <task title>"`. End the chain with `|| { echo FAIL; tail -n 60 /tmp/verify.log; }`.
- Run every command in the foreground with a long timeout (`timeout` 300000 ms or more): verify takes 2–4 minutes, and a backgrounded command costs extra `get_output` turns. Never print full logs.
- Test counts: the verify log uses the dot reporter and prints no totals. When a Done-when needs a count, add `(cd client && node --test --test-concurrency=1 --test-reporter=spec tests/*.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)')` to the same chain; don't grep the verify log for counts.
- On a failure, read only the relevant lines (`grep -n -C 5 -E 'error|Error|FAIL|✖' /tmp/verify.log | head -80`), fix, and rerun the same chain once. If it can't pass within scope, go to Blocked.
- List any Done-when check you couldn't run under Open questions.
- Report lines (append to `## Report (Worker)`; no other lines):
  ```
  - YYYY-MM-DD — [r] PR pending · <key metric before→after> · verify: pass
  - Outside Files: <path — reason> (or none)
  - Open questions: <one line each> (or none)
  ```
  Never set `[x]`. The Manager records the PR number.

## 5. Push and open the PR (one turn)
- `git push -q -u origin <Branch>`. PR target is **Base** (never `main`); title `<ID>: <task title>` (batch: `<ID1>+<ID2>: <title>`).
- Local runs have no working PR tool here (the GitHub MCP doesn't connect and `gh` isn't installed): don't try. After the push, reply with the compare URL `https://github.com/<owner>/<repo>/compare/<Base>...<Branch>` and put the PR body you would have written in the reply's last lines (at most 10). The Manager opens the PR.
- PR body (the only place for full detail): summary, files outside the list with reasons, verification summary, before/after numbers the Manager notes ask for, open questions.
- Do NOT merge, approve, rebase or force-push other branches.

## Blocked
- Set `Status: [!]` and append to the Report: `- YYYY-MM-DD — [!] <blocker>; tried: <what>`.
- Leave the code building (revert or isolate partial work), push the branch, and open a draft PR titled `BLOCKED <ID>: …`.

## Batches
- Do the tasks in order on the first task's Branch, one commit per task (step 4 once per task), one push and one PR at the end.
- If one task blocks, finish the ones before it, mark it `[!]`, leave later tasks untouched and say so in the PR.

## Finish: reply once, then stop
- Once the PR is open, your work is complete. Don't wait for, poll or check CI.
- Reply once: `<ID> [r] <compare URL> · <key metric> · questions: <n>`, then the short PR body. Then stop: don't ask "anything else?".
