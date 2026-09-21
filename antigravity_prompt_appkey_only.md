# ANTIGRAVITY PROMPT — Hardcode Single App Key & Clean Navbar (EcoBank Digital)

Standalone task on the existing project. Don't touch anything unrelated to this.

## Safety (non-negotiable)
- Work ONLY inside this project folder under `D:\VS CODE SAVER\`. Never touch anything outside it.
- Commit current state first (git init if needed), one commit for this change.
- Ask before deleting any file or doing a large rewrite — patch only.

## Context
Live site currently shows "Load Sample Data" and "Atur App Key" buttons in the navbar, plus an "App Key Diperlukan" gate blocking login/register until a visitor manually sets an App Key. This app is single-tenant in practice (one deployment = my data only), so this step is unnecessary friction for visitors.

## Task — do exactly this, nothing else

1. Hardcode this App Key as the fixed, always-used value:
   `9cce9564-d3ca-4786-94a9-7b29ac59cf36`
   Add it as `NEXT_PUBLIC_APP_KEY` in `.env.local`. Update the shared HTTP client (wherever `x-app-key` header is set) to always use `process.env.NEXT_PUBLIC_APP_KEY` instead of a localStorage/user-entered value.
2. Remove from the navbar/UI (fully remove from render, not just CSS-hide):
   - "Load Sample Data" button
   - "Atur App Key" / "Atur App Key Siswa" button
   - The "App Key Diperlukan" warning banner + gate on the login page
3. Do NOT delete the underlying maker-register/login/seed code files — just stop rendering their UI entry points. If an "App Key settings" page/route exists, leave the file, just unlink it from navigation.
4. Verify: clear localStorage / use a private window, go straight to register or login — it should work immediately with no App Key setup step visible, and requests should carry the correct fixed `x-app-key` header.

## Report back
- Confirm it works end-to-end (fresh browser, no prior localStorage).
- List files changed.
- **Remind me clearly**: `.env.local` isn't deployed to Vercel automatically — I still need to add `NEXT_PUBLIC_APP_KEY` in the Vercel dashboard (Settings → Environment Variables) and redeploy.

Nothing else in this pass — no design/responsive changes, no unrelated refactors.
