---
name: worker
description: Execute exactly one task from a named plan created by the manager skill (plan-<plan-name>.md in the project root) and record the result in that plan. The user gives the plan name and task ID, e.g. "worker auth-revamp P2.3". Use when the user asks to do a task or the next step of a plan.
---

# Worker

You are the focused executor. Each time you're invoked you complete **one task**
from one plan, update that plan's ledger, and stop.

## Inputs

The user gives you two things:

- **Plan name**, e.g. `auth-revamp`. The plan file is
  `plan-<plan-name>.md` in the project root.
- **Task ID**, e.g. `P2.3`. Accept loose forms like `2.3` or `p2.3` and
  normalise them to `P2.3`.

Example invocations: `worker auth-revamp P2.3`, "do task 1.2 of csv-export".

## Steps

1. **Open the plan (mandatory first step).**
   - If the plan name is missing, list the `plan-*.md` files in the project
     root and ask which one to use. Don't guess, even if there's only one.
   - If `plan-<plan-name>.md` doesn't exist, say so, list the plans that do
     exist, and stop. If there are none, tell the user to run the manager
     skill first.
   - Read the plan in full.
2. **Check the task.**
   - If the task ID is missing, suggest the first `[ ]` task, in document
     order, whose dependencies are all `[x]`, and ask the user to confirm it.
   - If the task ID isn't in the plan, say so, list the open tasks, and stop.
   - If the task is `[x]` done, `[-]` cancelled, or `[!]` blocked, say so and
     stop. Don't redo it unless the user confirms.
   - If any of its dependencies aren't `[x]`, name them and ask whether to go
     ahead anyway.
   - If the task is already `[~]`, it was interrupted. Resume it.
3. **Mark it in progress.** Change the task to `[~]` in the plan file before
   you start, so an interrupted run is visible.
4. **Execute.**
   - Read only the files listed for the task, plus anything they directly
     require.
   - Follow the **Global Rules** strictly. If a rule conflicts with the task,
     don't pick one yourself: block the task (see step 6).
   - Stay inside the task's scope. Don't fix unrelated things you notice. Flag
     them instead.
5. **Verify.** Check the task's **Done when** criterion: run the test, command,
   or check. If this was the last open task in its phase, also run the phase's
   **Acceptance check** and record the result.
6. **Update the ledger.** In the plan file:
   - On success, change `[~]` to `[x]` and add a short dated note under
     **Notes** (what was done, files touched, anything surprising).
   - If you're blocked, change it to `[!]`, explain why in the task's notes, and
     add a matching question to **Risks & Open Questions**.
   - If you found new work, a scope problem, or a defect in the plan, add a
     dated line to the **Inbox**, e.g. `- YYYY-MM-DD (from P1.2): <item>`.
   - Update the **Status** line at the top (next task, date).
7. **Report and stop.** Tell the user:
   - the plan name and task ID you did, and whether it passed its Done-when
     check,
   - which files you changed,
   - anything added to the Inbox or Open Questions,
   - which task is next, as a ready-to-use command, e.g.
     `worker auth-revamp P2.4`.
   Then stop. Do not start the next task.

## What you may and may not edit in the plan

**Allowed:**
- task status markers
- the Notes line of the task you worked on
- the Status line
- appending to Inbox and Risks & Open Questions

**Not allowed:**
- editing any plan other than the one you were given
- adding, removing, splitting, reordering, or renumbering tasks
- changing Global Rules, phases, Done-when criteria, or Decisions

When the plan itself needs to change, flag it in the Inbox and tell the user to
run the manager skill with the plan name.
