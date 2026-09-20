# ANTIGRAVITY PROMPT — Fix: Points Not Crediting After Deposit Verification (EcoBank Digital)

This is a **separate, standalone, narrowly-focused task** on the project that already exists. Do not restart, re-plan features, or touch unrelated screens/files. Your only job right now is to find and fix this one specific bug.

## 0. CRITICAL SCOPE & SAFETY RULES (NON-NEGOTIABLE)

- Work **ONLY inside this current project's folder**, under `D:\VS CODE SAVER\`. Never read, write, move, or delete anything outside this one project folder.
- Read the relevant files fully before changing anything — don't blind-overwrite.
- Check `git status`/`git log` first; if there's no repo yet, `git init` and commit the current working state before changing anything, as a rollback point. Make one small, clearly-labeled commit for this fix.
- If the fix seems to require touching more than the deposit-verification flow and the point-balance display, **stop and tell me first** rather than expanding scope on your own.
- I've previously lost important files from an agent acting outside scope and could not recover them — this rule is the highest priority in this task.

## 1. Context

Frontend (Next.js + TypeScript + Tailwind) for a waste-bank exam project, consuming the real live API at `https://learn.smktelkom-mlg.sch.id/bank_sampah/` (Swagger docs at `/api/docs`). Two roles: Nasabah (customer) and Admin. The deposit-and-points flow works like this:

1. Nasabah submits a waste deposit → `POST /api/v1/setor-sampah/pengajuan`.
2. Admin reviews it and verifies/finalizes it → `PUT /api/v1/setor-sampah/admin/verify/{id}`, with a `VerifySetorSampahDto` body: `status` (`diverifikasi` | `ditolak` | `selesai`), `catatanAdmin`, optional `itemsReal` (array of real weighed amounts per category).
3. Per the documented example response for this endpoint, when `status` is set to `selesai`, the response message is *"Verifikasi penyetoran sampah berhasil disimpan dan poin nasabah telah diperbarui"* and includes an updated `totalPoin`.

## 2. The bug

**After a Nasabah submits a deposit and the Admin verifies it, the Nasabah's point balance stays at 0 / doesn't increase — it should reflect the earned points once the deposit is finalized.**

## 3. What to investigate (in this exact order) and fix

1. **Check what status value the Admin verify UI actually sends.** Open the Admin's deposit-verification screen/component and its corresponding `lib/api/setorSampah.ts` (or equivalent) function. Confirm: does the current flow let the admin progress a deposit all the way to `status: "selesai"`, or does the UI only ever send `status: "diverifikasi"` and stop there? Per the API's own documented behavior, points are only confirmed as updated when status becomes `selesai`. If there's no clear "finalize / mark as selesai" action in the Admin UI (as opposed to just "diverifikasi"), that's very likely the root cause — add/fix that step so the admin can explicitly finalize a deposit to `selesai`, and confirm the request payload actually carries that value.
2. **Reproduce it for real** — don't just read the code and assume. Actually submit a fresh deposit as a Nasabah, verify+finalize it as Admin with status `selesai`, and inspect the real Network response from `PUT /api/v1/setor-sampah/admin/verify/{id}` to confirm the API itself returned an updated, non-zero `totalPoin`.
   - If the API response itself already shows the correct updated points → the bug is on the frontend display side, go to step 3.
   - If the API response does NOT show updated points even with `status: "selesai"` → tell me clearly, this may be a backend-side issue outside your control, and include the exact request payload and response body you sent/received so I can report it if needed.
3. **Check whether the Nasabah-facing balance display refetches fresh data after verification.** Find every place the point balance is shown to the Nasabah (dashboard summary, dedicated point-balance/history screen, any header/nav widget showing balance) and confirm each one is sourced from a fresh call to `GET /api/v1/auth/me` and/or `GET /api/v1/dashboard/summary` — not from a stale cached profile/session object set at login time. If it's reading stale state, fix it so the balance refetches: at minimum on every screen mount/navigation to a screen that shows it, and ideally right after the Admin's verification action if the Nasabah could plausibly be viewing the app live (e.g., trigger a refetch on window focus, or simply ensure no screen ever trusts a cached balance older than the current page load).

## 4. How to report back

Tell me specifically:
- Which of the two causes above (or both) was actually happening — don't guess, confirm by reproducing.
- What you changed, in which file(s).
- How you verified the fix: re-run the full flow (submit deposit → admin finalizes to `selesai` → Nasabah's balance updates) and confirm the balance is correct both immediately and after a fresh page reload.

If you finalize to `status: "selesai"` and the live API still doesn't return updated points, don't try to "fix" this by guessing at backend logic or hacking around it in the frontend (e.g., don't just add the estimated points to the displayed balance client-side as a workaround) — report it to me plainly instead, since that would be a backend-side issue, not something to patch over in the UI.
