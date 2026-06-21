# Snakeoil Enterprises

Monorepo workspace for mobile applications, websites, and software products built by Benny "The Snake" Sorensen and the Snakeoil Enterprises team.

## Workspace Layout

```
.
├── apps/        # Deployable applications (mobile, web, desktop)
├── packages/    # Shared libraries and internal tooling
├── docs/        # Project documentation
├── scripts/     # Workspace automation scripts
└── package.json # Root workspace configuration
```

## Getting Started

This workspace is managed by [Paperclip](https://paperclip.ing) under the **Onboarding** project. The Founding Engineer agent (`grok_local`) owns initial setup and implementation.

### Prerequisites

- Node.js 20+
- [Grok CLI](https://x.ai) (`grok` command available in PATH)

### Install dependencies

```bash
npm install
```

### Start the web app

```bash
npm run start:web
```

Opens the Vite dev server at [http://localhost:5173](http://localhost:5173). See [`apps/web/README.md`](apps/web/README.md) for package-level commands.

### CI verification (one-command gate)

Run the full CI gate locally before delegating work or opening a PR:

```bash
npm run ci:verify
```

This runs a production build (`build:web`) plus workspace verification. When the Grok CLI is available it also runs `verify:adapter`; in CI environments without `grok`, it falls back to `verify:tooling` (Biome check + Vitest).

GitHub Actions runs the same script on push/PR via [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Deployed web app (GitHub Pages)

Pushes to `main` publish the production build of `apps/web` via [`.github/workflows/deploy-web.yml`](.github/workflows/deploy-web.yml).

1. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. After the first successful deploy, the site is available at:

   `https://<github-owner>.github.io/<repo-name>/`

   **Live site:** [https://snakeoil112.github.io/snakeoil-enterprises/](https://snakeoil112.github.io/snakeoil-enterprises/) (repo: [snakeoil112/snakeoil-enterprises](https://github.com/snakeoil112/snakeoil-enterprises))

3. The deploy workflow sets `VITE_BASE_PATH=/<repo-name>/` so asset paths resolve correctly on project pages. For a user/org site served from the repo root, set repository variable `VITE_BASE_PATH` to `/` in **Settings → Secrets and variables → Actions → Variables**.

The live URL also appears on the workflow run summary and in the `github-pages` deployment environment.

### Verify the Grok Adapter

```bash
npm run verify:adapter
```

This confirms the Grok CLI is installed and Paperclip runtime environment variables are present during heartbeat execution.

## Engineering Agent

| Field | Value |
|-------|-------|
| Agent | Founding Engineer |
| Adapter | `grok_local` |
| Model | `grok-build` |
| Reports to | CEO |

## Related Issues

- [SNAAA-4](/SNAAA/issues/SNAAA-4) — Workspace scaffold (this issue)
- [SNAAA-5](/SNAAA/issues/SNAAA-5) — CEO roadmap review

## Applications

| App | Package | Start command |
|-----|---------|---------------|
| Web shell | `@snakeoil/web` | `npm run start:web` |

## Next Steps

1. Extend the web shell with product pages and marketing content
2. Add shared packages under `packages/`
3. Establish recurring engineering cadence via Paperclip heartbeats