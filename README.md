# SnackFindr (retired)

**This repo is the retired prototype for [Keke](https://github.com/ohhgianinaa/keke-docs).**
It is preserved for history, tagged as `prototype-archive`, and is not the active codebase.

## Active code (private)

- [`keke-docs`](https://github.com/ohhgianinaa/keke-docs) — PRD, specs, and reconciliation notes
- [`snack-api`](https://github.com/ohhgianinaa/snack-api) — backend (Hono + Supabase + Redis)
- [`snack-mobile`](https://github.com/ohhgianinaa/snack-mobile) — Expo / React Native app

> Repos are still named `snack-*` for now; the product is **Keke**.

## Recovering the prototype

```bash
git fetch --tags
git checkout prototype-archive
```

The prototype was a Next.js project (`create-next-app`) that explored an early
version of the snack-finder concept. The new codebase is a fresh start, not
extracted from this repo.