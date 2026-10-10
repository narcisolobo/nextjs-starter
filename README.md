# nextjs-starter

My Next.js starter: App Router, `src/`, Tailwind CSS 4, React Compiler, TypeScript 7, and an ESLint 10 config that replaces `eslint-config-next`.

## Who it's for

`create-next-app` still installs ESLint 9, which npm flags as deprecated on every new project. This template runs current majors instead: ESLint 10 and TypeScript 7. A fresh install prints no deprecation warnings.

That comes at a cost. `eslint-config-next` doesn't support ESLint 10 yet, so the lint config is assembled by hand from community forks, and TypeScript 7 runs alongside TypeScript 6 because `typescript-eslint` can't load TypeScript 7 yet. Both are explained below. If you want the update fixes but not the new majors, see [Prefer fewer new majors](#prefer-fewer-new-majors).

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
- Replace or delete `LICENSE`. It covers this template, not your app.
- Keep or delete `renovate.json` (see [Keeping it current](#keeping-it-current)).

Your app gets the versions in this template's lockfile, so it's only as current as the template's last update. To pick up anything newer, run the [update steps](#keeping-it-current) in your app.

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

## Prefer fewer new majors

Either change works on its own.

**TypeScript 6 only.** Drop the aliases and install plain TypeScript 6. `pnpm typecheck` and `next build` then use the same compiler.

```bash
pnpm remove @typescript/native typescript
pnpm add -D typescript@^6
```

**`eslint-config-next` instead of the forks.** This puts you back on ESLint 9, so the deprecation warning returns.

```bash
pnpm remove eslint @eslint-react/eslint-plugin @next/eslint-plugin-next eslint-plugin-import-x eslint-plugin-jsx-a11y-x eslint-plugin-react-hooks typescript-eslint
pnpm add -D eslint@^9 eslint-config-next@<your next version>
```

Then replace `eslint.config.mjs` with the one `create-next-app` generates:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

## Keeping it current

Running new majors means more upkeep than `create-next-app`. [Renovate](https://docs.renovatebot.com/) handles most of it (`renovate.json`):

- Minor and patch updates arrive as one PR each Monday and merge themselves once CI passes.
- Security fixes open a PR right away.
- Majors each get their own PR and wait for a human, because they're what breaks tooling here.

CI (`.github/workflows/ci.yml`) runs `pnpm peers check`, lint, typecheck and build on every PR.

Apps made from the template inherit both files. Install the [Renovate GitHub App](https://github.com/apps/renovate) on your repo to use them, or delete `renovate.json`.

To update everything by hand:

```bash
pnpm up --latest
pnpm peers check
pnpm lint && pnpm typecheck && pnpm build
git commit -am "chore: update dependencies"
```

`pnpm up --latest` ignores version ranges, so a major release can break tooling without failing the install. That's how TypeScript 7 broke ESLint here. If `pnpm peers check` reports issues or a check fails, fix it or pin that package back before committing.

While you're in there, check whether these can be retired:

- The TypeScript 6/7 aliases, once `typescript-eslint` accepts TypeScript 7.
- The `-x` plugin forks, once `eslint-config-next` supports ESLint 10 (if you'd rather go back to it).

## About `npm audit`

If `npm audit` or `pnpm audit` reports a high-severity advisory in `braces` ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)), it comes from `@next/eslint-plugin-next > fast-glob > micromatch > braces`, which every Next.js lint setup includes. npm counts each package on that path, so one advisory can show up as several.

It can't be triggered here. The plugin only globs `settings.next.rootDir` from your ESLint config, and this template doesn't set it, so the vulnerable code never runs. It's a dev dependency, and none of it ships with your app.

## License

[MIT](LICENSE)
