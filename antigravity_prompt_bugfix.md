# ANTIGRAVITY PROMPT — Bug Audit & Fix Pass (EcoBank Digital)

This is a **separate, standalone task** on a project that already exists and was already built in a previous session. Do **not** treat this as "continue building" — do not re-plan features, do not restructure folders, do not rewrite files that are already working correctly. Your job right now is narrower: **find what's broken and fix only that**, carefully.

## 0. CRITICAL SCOPE & SAFETY RULES (READ FIRST — NON-NEGOTIABLE)

- Work **ONLY inside this current project's folder**, under `D:\VS CODE SAVER\`. Never read, list, write, move, rename, or delete anything outside this one project folder — no sibling project folders, no parent-level files.
- Before touching any file, **understand what it currently does first** (read it fully) — do not blind-overwrite a working file while "fixing" an unrelated bug.
- If a fix requires deleting a file, renaming a file, or a large rewrite (not a small patch), **stop and ask me first**, and tell me exactly which file/path and why.
- Do not run any destructive git command (`git reset --hard`, force push, branch deletion, etc.) without asking first.
- If the project has git history (check with `git log` / `git status` first), **make small, separate commits per fix** with a clear message describing what bug was fixed — do not bundle many unrelated fixes into one commit. If there is no git repo yet, run `git init` and make an initial commit of the current working state **before** changing anything, so we have a safe rollback point.
- I previously lost important files from an agent acting outside scope, and they were not recoverable — treat the scope rule above as the highest-priority constraint in this whole task, above speed or thoroughness.

## 1. Context

This is the frontend (Next.js + TypeScript + Tailwind) for my UKK RPL exam project, **"Aplikasi Bank Sampah Digital & Daur Ulang"** — a waste-bank web app with two roles (Nasabah / Admin) consuming a real live REST API at `https://learn.smktelkom-mlg.sch.id/bank_sampah/` (Swagger docs at `/api/docs`), following an Apple-inspired design system (`APPLE_DESIGN.md` + its extension notes, already in this project's root). All of that was already implemented in a prior session. **I've now run it and something is broken or behaving incorrectly.**

## 2. Your task: audit, diagnose, and fix — in this order

1. **Reproduce first, fix second.** For every issue (whether I describe a specific symptom below, or you find one yourself), first confirm you can actually reproduce it — don't guess at a cause from just reading code. Run the app (`next dev`), exercise the actual flow, and watch the real console/network output.
2. **Read the real error before touching code.** Get the exact error message, stack trace, and/or failed network request (status code + response body). Form a specific hypothesis about the root cause. Only then make a change.
3. **Fix the smallest thing that correctly resolves the root cause** — not a broad rewrite, not suppressing the symptom (e.g. don't wrap an error in a silent `try/catch` just to make it stop showing; don't add `@ts-ignore` to silence a type error caused by a real bug).
4. **After each fix, verify it actually works** by re-running the exact flow that was broken, not just re-reading the code and assuming it's fine.
5. **Check you didn't break anything else** — quickly re-check adjacent/related screens that touch the same component, hook, or API service file you just changed.

## 3. Full systematic sweep (run this checklist even if I only reported one bug — related issues often hide nearby)

- **Type-check**: run `tsc --noEmit`. Fix every reported error.
- **Lint**: run `next lint` (or ESLint directly). Fix every error and warning, or explain in a code comment why one is intentionally left.
- **Production build**: run `npm run build`. It must complete with zero errors — dev mode can hide real bugs (missing `Suspense` boundaries, Server/Client Component serialization issues, etc.).
- **Console & Network audit, screen by screen**: open every one of the 8 Nasabah screens and 9 Admin screens, check the browser console for errors/warnings (including hydration mismatch warnings) and the Network tab for failed (4xx/5xx) or unexpectedly shaped API responses.
- **Auth/session flow**: confirm App Key onboarding, register, login, and `GET /api/v1/auth/me` session-restore all work; confirm a `401` response correctly clears the session and redirects to login instead of crashing or looping.
- **Every form**: submit with valid data (confirm success) AND invalid/empty data (confirm the right validation message shows, sourced from the API's `message` field where applicable, not a generic/blank error).
- **Money-path edge cases**: insufficient points on redemption, zero/negative weight on a deposit item, duplicate username on register — confirm each is handled gracefully with a clear message, not a crash or silent failure.
- **CORS**: if you see requests blocked by CORS policy in the console (since the app calls an external origin from `localhost`), confirm that's really what's happening (not a misread 401/404/500), and if so, route those calls through a Next.js API route handler (`app/api/.../route.ts`) as a same-origin proxy rather than calling the external API directly from the browser. Tell me clearly if you had to introduce this, since it changes where `x-app-key`/token header logic lives.
- **Responsive check**: re-check mobile (~390px), tablet (~834px), and desktop (~1280px+) on every screen you touch — a fix at one breakpoint can silently break another.
- **Design-system drift check**: while you're in these files anyway, flag (but don't auto-"fix" beyond an actual bug) any spot that clearly violates the design rules — a stray shadow on a card, a second accent color, font-weight 500 anywhere, a radius outside the defined scale — and tell me about it rather than silently restyling large sections.

## 4. Specific symptom(s) I'm seeing right now

> _(Describe here exactly what's broken: which screen, what you did, what happened vs. what you expected, and any error text visible on screen. If you paste a console error or screenshot, include it. Antigravity should treat this section as the priority item, then still run the systematic sweep in Section 3 around it.)_

## 5. How to report back

Do not just say "fixed it." For every bug you resolved, tell me:
- **What was broken** (the actual symptom/error).
- **Root cause** (why it was happening).
- **What you changed** (which file(s), briefly).
- **How you verified it's actually fixed** (what you did to confirm).

If something is broken and you're not confident in the fix, or the root cause is unclear, say so explicitly instead of guessing — I'd rather know it's still unresolved than have it silently papered over.
