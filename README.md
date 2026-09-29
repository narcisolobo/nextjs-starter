# nextjs-starter

My Next.js starter: App Router, `src/`, Tailwind CSS 4, React Compiler, TypeScript 7, and an ESLint 10 config that replaces `eslint-config-next`.

## Create a new app

```bash
pnpm create next-app --example "https://github.com/narcisolobo/nextjs-starter" my-app
cd my-app
cp .env.example .env.local
pnpm dev
```

Then:

- Change `"name"` in `package.json`. `create-next-app` keeps `nextjs-starter`.
- Set `meta` in `src/app/layout.tsx`.

## Scripts

| Script           | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `pnpm dev`       | Start the dev server                           |
| `pnpm build`     | Production build (type checks with TS 6, see below) |
| `pnpm lint`      | ESLint                                         |
| `pnpm typecheck` | Generate route types, then type check with TypeScript 7 |

## ESLint

`eslint-config-next` bundles `eslint-plugin-react`, `eslint-plugin-import` and `eslint-plugin-jsx-a11y`, none of which support ESLint 10. `eslint.config.mjs` builds the same rule set from plugins that do:

| eslint-config-next used | This template uses            |
| ----------------------- | ----------------------------- |
| eslint-plugin-react     | `@eslint-react/eslint-plugin` |
| eslint-plugin-import    | `eslint-plugin-import-x`      |
| eslint-plugin-jsx-a11y  | `eslint-plugin-jsx-a11y-x`    |

`@next/eslint-plugin-next`, `eslint-plugin-react-hooks` and `typescript-eslint` are used directly. The `@eslint-react` rules that duplicate `react-hooks` are turned off, since `react-hooks` also carries the React Compiler diagnostics.

A11y rules use the `jsx-a11y-x/` prefix, so disable comments look like `// eslint-disable-next-line jsx-a11y-x/alt-text`.

## TypeScript 6 and 7 side by side

TypeScript 7 doesn't ship the JavaScript compiler API yet, and `typescript-eslint` needs it. Following [the TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0):

```json
"@typescript/native": "npm:typescript@^7.0.2",
"typescript": "npm:@typescript/typescript6@^6.0.2"
```

- `tsc` (and `pnpm typecheck`) runs TypeScript 7.
- ESLint plugins import `typescript`, which is TypeScript 6.
- `next build` type checks with `tsc6`, because Next runs the `tsc` that belongs to the `typescript` package. So does VS Code's "Use Workspace Version".

When `typescript-eslint` supports TypeScript 7, replace both entries with `"typescript": "^7"`.

## Keeping it current

Pinned versions age, so update the template from time to time:

```bash
cd /Volumes/Dev/templates/nextjs-starter
pnpm up --latest
pnpm peers check
pnpm lint && pnpm typecheck && pnpm build
git commit -am "chore: update dependencies"
git push
```

`pnpm up --latest` ignores version ranges, so a major release can break tooling without failing the install. That's how TypeScript 7 broke ESLint here. If `pnpm peers check` reports issues or a check fails, fix it or pin that package back before committing.

While you're in there, check whether these can be retired:

- The TypeScript 6/7 aliases, once `typescript-eslint` accepts TypeScript 7.
- The `-x` plugin forks, once `eslint-config-next` supports ESLint 10 (if you'd rather go back to it).
