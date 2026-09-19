# ANTIGRAVITY PROMPT — UX Polish, Data-Sync Fix & Backend Re-Verification (EcoBank Digital)

This is another **separate, standalone task** on the project that already exists. Do not restart, re-plan features, or restructure folders. This pass has three focused goals, in priority order: **(A) fix data-sync issues first** (these are correctness bugs), **(B) re-verify the backend integration against the live API is accurate**, **(C) then do a light UX/comfort polish pass** on top of what's already working. Don't skip ahead to polish while sync/correctness issues remain.

## 0. CRITICAL SCOPE & SAFETY RULES (READ FIRST — NON-NEGOTIABLE)

- Work **ONLY inside this current project's folder**, under `D:\VS CODE SAVER\`. Never read, write, move, or delete anything outside this one project folder.
- **Read a file fully before changing it** — understand current behavior first, don't blind-overwrite.
- Any file deletion/rename, or a rewrite touching more than a small, localized patch, **requires asking me first** — tell me the exact path and why.
- Check `git status`/`git log` first. If there's no repo yet, `git init` and commit the current working state **before** changing anything, as a rollback point. Make small, separate commits per fix (sync fix, backend correction, UX tweak) with clear messages — never one giant commit bundling unrelated changes.
- No destructive git commands without asking first.
- I've previously lost important files from an agent acting outside scope and could not recover them — this rule is the highest priority in this whole task.

## 1. Context

Frontend (Next.js + TypeScript + Tailwind) for my UKK RPL exam project, "Aplikasi Bank Sampah Digital & Daur Ulang," two roles (Nasabah / Admin), consuming the real live API at `https://learn.smktelkom-mlg.sch.id/bank_sampah/` (Swagger docs at `/api/docs`), styled per `APPLE_DESIGN.md` + its extension notes already in the project root. It's already built and mostly working, but: **(1)** some parts of the frontend aren't staying in sync with backend state, and **(2)** I want you to re-check the backend integration is actually correct against the live docs, and **(3)** I'd like a light comfort/usability pass on the visuals.

## 2. TASK A — Data Synchronization Audit & Fix (do this first)

The symptom I'm noticing is that some parts of the frontend don't reflect the real backend state correctly. Go through this systematically — for **every** create/update/delete/status-change action in the app, verify what happens to related on-screen data immediately after:

1. **List views after mutation**: after creating, editing, or deleting a nasabah / kategori sampah / hadiah in the Admin panel, does the corresponding list update immediately (either by refetching the `GET` list endpoint, or by precisely patching local state from the mutation's own response payload — check the actual response shape in Swagger, don't assume)? Or does it show stale data until a manual page reload? Fix any place doing the latter.
2. **Point balance consistency**: after a Nasabah submits a deposit, and separately after an Admin verifies/finalizes that deposit (which recalculates real points), confirm the Nasabah's displayed **saldo poin** (on the dashboard, the point-balance screen, and anywhere else it's shown) updates correctly — check whether this requires a refetch of `GET /api/v1/dashboard/summary` / `GET /api/v1/auth/me` after the relevant action, and whether that refetch is actually happening. Don't let the UI show a locally-computed "estimated" point value in a place that should show the real, server-confirmed value once verification has happened.
3. **Deposit status consistency**: after an Admin changes a deposit's status (`diverifikasi` / `ditolak` / `selesai`), confirm the Nasabah's own status tracker screen and history reflect the new status without requiring a hard refresh or re-login — and confirm the Admin's own list view also updates after the action (not just the detail view you just acted on).
4. **Redemption consistency**: after a Nasabah redeems points for a reward, confirm (a) their displayed point balance decreases correctly, (b) the reward's stock count shown anywhere in the UI reflects the decrement, and (c) the new redemption appears in their history without a manual refresh. After an Admin updates a redemption's status, confirm it's reflected on the Nasabah side too.
5. **Session/profile drift**: confirm the locally stored user/profile object (used to render name, role, point balance, etc. in nav/headers) doesn't go stale relative to the server — e.g., if points changed via another action, does the header/summary widget showing point balance actually reflect it, or is it reading a stale cached object from login time?
6. **Cross-navigation freshness**: when navigating between screens (e.g., Admin: verify a deposit → go to "All Transactions" view), confirm the destination screen fetches fresh data on mount rather than reusing possibly-stale state from earlier in the session.
7. **Race conditions**: check for spots where a fast double-click or rapid consecutive actions (e.g., double-submitting a redemption) could cause inconsistent state; the UI should disable the action button while a mutation is in flight.

For every genuine sync bug you find and fix, use a clear, consistent pattern going forward: **after any successful mutation, either (a) refetch the source-of-truth `GET` query for anything that mutation could have affected, or (b) update local/shared state directly and precisely from that mutation's own API response** — pick whichever fits the existing code's architecture, but be consistent about which pattern is used where, and document the choice briefly in a comment if it's not obvious.

## 3. TASK B — Backend Integration Re-Verification (do this second)

Re-open the live Swagger docs (`https://learn.smktelkom-mlg.sch.id/bank_sampah/api/docs`) and go through **every** service file in `lib/api/` one by one, cross-checking it against the live docs (the live docs are the final source of truth — more authoritative than my original written contract, in case anything drifted or was refined since):

- Exact path and HTTP method match.
- Exact request body field names, types, and required/optional status match the current DTOs shown in Swagger.
- Exact response shape being read matches what the endpoint actually returns (including nested objects like `detailSetors`, `nasabah`, `hadiah` sub-objects) — a mismatch here is a common, quiet source of bugs (e.g., reading `data.nasabah.name` when the real field is `data.nasabah.namaNasabah`).
- Correct headers per endpoint: confirm which endpoints need only `x-app-key`, and which additionally need `Authorization: Bearer <token>` — don't send a Bearer token where it's not expected, and don't omit it where it is.
- Check whether any endpoint in the live docs doesn't exist in the code yet, or exists in the code but no longer matches (renamed, restructured, deprecated) in the live docs.
- Confirm query parameters (`?bulan=`, `?status=`) are being sent with the exact expected format (e.g., `YYYY-MM`) and are actually wired to the relevant filter UI controls, not hardcoded or ignored.
- Confirm multipart/form-data requests (photo uploads on nasabah, kategori sampah, hadiah) are constructed correctly and the field name for the file matches exactly what the API expects.

List out anything you find and fixed, and separately anything you found questionable but weren't sure how to resolve — don't silently leave a mismatch unmentioned just because it didn't visibly crash.

## 4. TASK C — Light UX / Comfort Polish (do this last, and keep it light)

This is refinement, not a redesign — stay strictly within the existing `APPLE_DESIGN.md` tokens and its extension notes (Section 3.1 from the main build prompt: semantic colors, badge/table/card/modal/toast specs, etc.). Do not introduce new colors, fonts, or spacing values outside that system. Look for genuine comfort/usability issues like:

- **Touch targets**: on mobile, confirm buttons/icons a user taps (especially in the bottom nav and in admin table row actions) are comfortably sized (roughly 44×44px minimum tap area), not just visually small icons crammed together.
- **Feedback clarity**: every button that triggers an async action (submit, delete, redeem, verify) should show a clear in-progress state (disabled + spinner/label change) so it's obvious something is happening, and a clear success/error acknowledgment afterward (toast/inline message) — not just a silent state change the user might miss.
- **Form ergonomics**: labels clearly associated with fields (not just placeholder text that disappears on focus), sensible input types (`type="number"` for weight/points fields with appropriate `min`/`step`, `type="tel"` for phone), logical tab order, and the first field auto-focused where it makes sense (e.g., login username field).
- **Empty & loading states**: confirm every list-type screen has a genuinely helpful empty state (not just a blank area) and a real loading skeleton/spinner rather than a layout jump when data arrives.
- **Readability & spacing**: check for cramped areas (especially on mobile) where text or interactive elements sit too close together relative to the design system's own spacing scale — apply the existing scale values, don't invent new ones.
- **Navigational clarity**: confirm there's always an obvious way back (back button/breadcrumb) from detail/nota views, and that the active nav item is clearly indicated in both the Nasabah bottom nav and Admin sidebar.
- **Status legibility**: confirm the four deposit statuses and redemption statuses are visually distinct and instantly scannable (this should already be covered by the badge component from the design-system extension — just verify it's actually applied everywhere a status appears, not just in one screen).

For each polish change, keep it small and targeted — if you find yourself wanting to restructure a whole screen's layout, stop and ask me first instead of doing it unprompted.

## 5. How to report back

For Task A and B, list each issue found as: **what was wrong → root cause → what you changed → how you verified the fix** (re-tested the actual flow against the live API, not just re-read the code). For Task C, a short list of what you tweaked and why is enough. If something in Task A or B looks off but you're not confident about the right fix, say so explicitly rather than guessing or leaving it unmentioned.
