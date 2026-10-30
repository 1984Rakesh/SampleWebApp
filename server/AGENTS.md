# Server Agent Instructions (Express + SQLite)

Follow the [server rules](../.agents/skills/server-architecture/SKILL.md), [shared rules](../.agents/skills/clean-architecture/SKILL.md) and [root instructions](../AGENTS.md).

## Layout

`src/` holds features (`security`, `profile`, `tasks`, each with domain/infrastructure/presentation plus a root `assembly.ts` and public `index.ts`), `app/` (config, composition, createApp), `foundation/` (database, persistence, http), `shared/domain/`, and thin `server.ts`. No client-only modules (dashboard, comparison, components) on the server.

## Verification

```bash
cd server
npm run build
npm test
npm run test:startup
npm run check:architecture
```

## Test safety

- `npm test` typechecks first. Tests never import `src/server.ts` (it starts the persistent app).
- Every test uses its own `:memory:` database and an ephemeral loopback port, with cleanup. Only explicit seed tests seed. Never use a persistent database path or ambient environment.
- Startup smoke tests run the compiled `dist/server.js` in child processes with an explicit isolated environment, `DB_PATH=:memory:`, dotenv pointed at the null device, an ephemeral port, and stop the child afterwards.
- `tests/client-contract.test.ts` needs both sides' dependencies installed.
- The build does not remove stale output after source moves. List stale files and get approval before deleting them; never add an automatic destructive clean to build scripts.
