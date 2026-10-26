# Client Agent Instructions (React)

Follow the [client rules](../.agents/skills/client-architecture/SKILL.md), [shared rules](../.agents/skills/clean-architecture/SKILL.md) and [root instructions](../AGENTS.md).

## Layout

`src/` holds features (`security`, `profile`, `tasks` with domain/data/presentation; `dashboard`, `comparison` presentation-only), `app/` (composition, providers, router), `foundation/` (network, session, theme), `shared/` (domain, data), `components/` (ui, app, feedback, layout), and thin `App.tsx`/`main.tsx`.

UI source of truth: [docs/design-system/](./docs/design-system/README.md) (tokens in `globals.css`, one spec per component in `components/*.md`). Never import `components/bundle.js`.

## Verification

```bash
cd client
npm test
npm run build
npm run lint
npm run check:architecture
```

If client DTOs or mappers move, update the import paths in `server/tests/client-contract.test.ts` and run the server `npm test` and `npm run test:startup`.
