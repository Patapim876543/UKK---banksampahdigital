# ANTIGRAVITY BUILD PROMPT — EcoBank Digital (Bank Sampah Digital Frontend)

## 0. CRITICAL SCOPE & SAFETY RULES (READ FIRST — NON-NEGOTIABLE)

- **You must operate ONLY inside the current project folder**, which lives under `D:\VS CODE SAVER\`. This parent directory contains ALL of my coding projects for school and personal work.
- **NEVER** read, list, write, move, rename, or delete any file or folder **outside** the current project's root directory. Do not traverse upward with `..`, do not touch sibling project folders, do not touch anything at `D:\VS CODE SAVER\` root level except the one folder you were told to work in.
- Before running any destructive command (delete, overwrite, `git reset --hard`, `rm`, mass rename, etc.), **stop and ask for explicit confirmation**, and state exactly which path will be affected.
- Do not run any global installs, do not modify system/environment files, do not touch other drives.
- I have lost important files before from an agent going out of scope and they were **not recoverable**. Treat this rule as the highest priority constraint in this entire prompt — higher than speed, higher than "helpfulness."
- If you are ever unsure whether a path is inside or outside the allowed project folder, **assume it is outside** and ask first.
- **Never commit or print any real JWT token or App Key value into git history, logs, or public output.** They belong only in `.env.local` (gitignored) and in-memory/localStorage at runtime — see Section 5.

## 1. Project Context (from the official UKK exam document)

This project is my **UKK (Uji Kompetensi Keahlian) RPL 2026/2027** practical exam submission, category **Frontend (Web)**, Paket A, titled:

> **"Aplikasi Bank Sampah Digital & Daur Ulang (Eco-Waste Management System)"**

**Theme / domain:** A digital waste bank platform that lets the public deposit recyclable waste (plastic, paper, metal, glass) at a waste-bank unit. Each deposit is weighed and converted into **points** based on category-specific point-per-kg rates. Accumulated points can be redeemed for rewards (vouchers, groceries, etc.). The goal is to encourage environmental awareness while giving people a tangible incentive to recycle.

There are two user roles in the system:

1. **Nasabah (Customer / the public)** — deposits waste, tracks points, redeems rewards.
2. **Admin Bank Sampah (Waste Bank Unit Administrator)** — manages customers, waste categories, rewards catalog, verifies/weighs deposits, and views monthly reports.

**My exam role is strictly Frontend (Web).** I do NOT build the backend or database. The committee already provides a **live REST API** for this exam (see Section 5 for the exact base URL, docs link, and auth flow) — this build should integrate against that real API directly rather than staying on mock data, using the response envelope and endpoints documented in the API contract.

## 2. Full Feature Requirements (PRD)

### 2.1 Nasabah (Customer) — required screens/features
1. **Register** — create account (username, password, full name, address, phone, optional photo upload placeholder).
2. **Login**.
3. **Waste Category Catalog** — list of recyclable waste types with price/kg and points/kg, filterable/searchable, grouped or tagged by type (plastik / kertas / logam / kaca).
4. **Submit Waste Deposit (Ajukan Penyetoran)** — multi-item form: pick a waste category, enter estimated weight (kg), repeat for multiple items, pick a date, optional note. Shows a running estimated total point calculation client-side.
5. **Deposit Status Tracker** — list of the customer's own deposit submissions with status badges: `Menunggu Konfirmasi`, `Diverifikasi`, `Ditolak`, `Selesai`. Filterable by month.
6. **Point Balance & Deposit History** — current point balance (large, prominent), history list of deposits, filterable by month.
7. **Redeem Points (Tukar Poin)** — browse rewards/voucher catalog, see points required and stock, redeem if balance is sufficient (disable/gray out if not enough points).
8. **Transaction Receipt / Nota** — printable-looking receipt view for both deposit transactions and redemption transactions, with a "Print" or "Download" action.

### 2.2 Admin Bank Sampah — required screens/features
1. **Register Unit** — register the waste-bank unit (unit name, manager name, phone, username, password).
2. **Admin Login**.
3. **Unit Profile** — view/edit unit profile info.
4. **Customer Management (CRUD)** — list, add, edit, delete customers (with photo, address, phone, point balance shown).
5. **Waste Category Management (CRUD)** — list, add, edit, delete categories (name, price/kg, points/kg, type: plastik/kertas/logam/kaca, photo).
6. **Rewards/Voucher Management (CRUD)** — list, add, edit, delete rewards (name, points required, stock, photo).
7. **Deposit Confirmation & Verification** — table of incoming deposit submissions, filter by status/month, open a detail view to confirm/reject/finalize with real weighed amounts vs. estimated amounts, add admin notes.
8. **All Transactions View** — combined view (tabs) of all deposit transactions and all redemption transactions, filterable by month.
9. **Monthly Recap Dashboard** — total tonnage collected, breakdown by waste type (plastik/kertas/logam/kaca) with tonnage/rupiah/points per type, total redemption transactions and points spent, month selector. Use simple charts (bar or donut) where it improves readability.

### 2.3 Cross-cutting requirements
- Fully responsive: mobile, tablet, and desktop layouts (this app's real-world audience includes phone users).
- Clear loading states (skeletons/spinners) while real API requests are in flight.
- Clear error/validation states on all forms (empty fields, invalid weight ≤ 0, insufficient points, API error messages surfaced from the response envelope's `message` field, network failures, 401/403 → redirect to login, etc.).
- Role-aware navigation: Nasabah and Admin have separate shells/layouts and separate nav items, matching the two bottom-nav groups implied by the source wireframe (Nasabah: Beranda / Setor / Riwayat / Tukar Poin / Akun — Admin: Dashboard / Transaksi / Data / Laporan / Akun).

## 3. Design System — MANDATORY (Apple-inspired)

A full design-token specification is provided in **`APPLE_DESIGN.md`** in the project root. **Read that file first and treat it as the binding design source of truth** — do not invent your own colors, spacing, or component shapes. Key points to internalize before writing any component:

- **Single accent color** `#0066cc` (Action Blue) for every interactive element (buttons, links, focus rings, selected states). Do not introduce a second accent color anywhere in the UI. On dark surfaces, use `#2997ff` instead (never Action Blue on dark).
- **Typography**: SF Pro Display for headlines (weight 600, tight negative letter-spacing), SF Pro Text for body (17px/400, never 16px). Since SF Pro isn't web-licensed, use `font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif` and pull in **Inter (variable)** from Google Fonts/next/font as the fallback, with `font-feature-settings: "ss03"` and slightly tightened letter-spacing per the notes in APPLE_DESIGN.md.
- **Weight ladder is 300 / 400 / 600 / 700 — weight 500 must never appear anywhere.**
- **Radius grammar**: `0px` for full-bleed sections, `8px` for compact utility elements, `11px` rare "pearl" elements, `18px` for utility cards, `9999px` (full pill) reserved for primary CTAs, chips, and search inputs. Never mix radii outside this scale.
- **One shadow only**: `rgba(0,0,0,0.22) 3px 5px 30px 0` — reserved exclusively for product/illustration imagery resting on a surface. Never put a shadow on a card, button, or text.
- **No gradients, no decorative chrome.** Visual rhythm comes from alternating light/parchment/dark full-bleed sections, not borders or shadows.
- **8px-based spacing scale**: 4 / 8 / 12 / 17 / 24 / 32 / 48 / 80.
- **Micro-interaction**: every button gets `transform: scale(0.95)` on active/press — this is the one system-wide interaction, apply it consistently.
- Since this app has a green/eco theme (Section 1), you may introduce **one supporting "eco" tone** (a deep green, e.g. `#1F7A4D` or similar) used ONLY for semantic success/points/eco-badge moments (e.g., "points earned", "verified" status, recycling type tags) — but the primary CTA/interactive accent stays Action Blue per the Apple system. Do not let the green compete with Action Blue for the same role. State this decision clearly as a code comment in the design tokens file so it's traceable.
- Re-implement the design tokens (colors, type scale, radii, spacing) as a single source (Tailwind config `theme.extend` **or** CSS variables in `globals.css` — your call, but pick ONE and be consistent) so every component references tokens, never inline hex/px magic numbers.

### 3.1 Design System Extension — app/dashboard patterns not covered by APPLE_DESIGN.md

`APPLE_DESIGN.md` is an analysis of Apple's **marketing/product pages** (hero tiles, store grids, buy flows). It does **not** define patterns this data-driven app needs: data tables, status badges, dashboard stat cards, modals, toasts, tabs, or form error states (its own "Known Gaps" section admits this). Do not invent these freely — derive them from the *existing* tokens and the system's stated principles (flat, no gradients, single shadow reserved for imagery, radius grammar, 8px spacing, weight ladder 300/400/600/700). Use these derived specs:

- **Semantic colors (new, minimal addition):** the palette has no error/warning color. Add exactly three semantic tokens, flat (no gradient), used only for status/feedback — never as decoration:
  - `success` — reuse the eco green from Section 3 (e.g. `#1F7A4D`) → maps to `Selesai` / `Diverifikasi` status, form success states.
  - `warning` — a muted amber (e.g. `#B45309`) → maps to `Menunggu Konfirmasi`.
  - `danger` — a restrained red (e.g. `#D92D20`, not neon) → maps to `Ditolak`, form validation errors, destructive-action confirmations.
  - Each gets a `-bg` tint at ~10% opacity for badge/alert backgrounds and a full-strength value for text/icon/border, keeping with the system's "flat, no shadow" rule.
- **Status badge / pill** — `{rounded.pill}`, `{typography.caption-strong}` (14px/600), padding `6px 12px`, colored via the semantic `-bg` background + full-strength text color, no border, no shadow. One badge component, four color variants (`success`, `warning`, `danger`, and a neutral gray for any default/unknown state).
- **Form input (text/select/textarea)** — not documented in APPLE_DESIGN.md (only `search-input`'s pill shape exists, which is wrong for a form field). Use: background `{colors.canvas}`, text `{colors.ink}` in `{typography.body}`, 1px solid `{colors.hairline}` border (upgrading to 2px `{colors.primary-focus}` on focus — reuse the same focus treatment as `button-primary-focus`), rounded `{rounded.sm}` (8px — NOT pill; pills stay reserved for actions/chips per the system's own rule), padding `12px 16px`. Label above the field in `{typography.caption-strong}`. Error state: border becomes `danger`, a `{typography.caption}` error message in `danger` appears below the field.
- **Data table (admin lists)** — no card shadow, no heavy borders; row separation via `{colors.divider-soft}` 1px hairlines only (consistent with the system avoiding decorative borders). Header row in `{typography.caption-strong}`, `{colors.ink-muted-48}` text. Body rows in `{typography.body}`. Row hover/press uses the same `scale(0.95)` press feedback only on actionable icon-buttons within the row, not the row itself. On mobile, collapse each row into a stacked card (reuse `store-utility-card` styling) rather than a horizontally-scrolling table.
- **Dashboard stat card** — derive from `{component.store-utility-card}` (white, `{rounded.lg}`, 1px hairline, `{spacing.lg}` padding): a large number in `{typography.display-md}` (34px/600), a label above it in `{typography.caption-strong}`, optional small trend/context line in `{typography.caption}` muted.
- **Modal / dialog** (delete confirmation, verify-deposit detail) — centered surface, background `{colors.canvas}`, `{rounded.lg}`, `{spacing.xl}` padding, NO drop shadow per the system's single-shadow rule — separate it from the page with a scrim instead: full-screen backdrop at `rgba(0,0,0,0.4)`, no blur needed (reserve `backdrop-filter: blur()` for the sticky/frosted patterns already defined, per Section "Elevation & Depth"). Primary action = `{component.button-primary}`, secondary/cancel = `{component.button-secondary-pill}`.
- **Toast / inline alert** — flat colored bar using the semantic `-bg` tint + full-strength left border accent (4px) in the matching semantic color, `{rounded.sm}`, `{spacing.md}` padding, icon + `{typography.body}` message. No shadow.
- **Tabs** (e.g. switching "Penyetoran" / "Penukaran" in admin transactions view) — underline style: `{typography.tagline}` for the label, active tab gets a 2px bottom border in `{colors.primary}`, inactive tabs in `{colors.ink-muted-48}`. No pill/background tabs — keep the same restraint as the rest of the system.
- **Bottom nav (Nasabah, mobile)** — fixed bottom bar, background `{colors.canvas}`, top 1px `{colors.hairline}` border, 5 icon+label items, active item in `{colors.primary}`, inactive in `{colors.ink-muted-48}`, label in a small caption size below the icon.
- **Sidebar nav (Admin, desktop ≥1024px)** — background `{colors.surface-black}` (matching `{component.global-nav}`'s reserved-pure-black role), text `{colors.on-dark}`, active item gets a subtle `{colors.surface-tile-1}` background pill behind the icon+label (not `{colors.primary}` fill — keep Action Blue for the small active-indicator/icon tint only, per the single-accent rule). Collapses to the same bottom-nav pattern as Nasabah on mobile widths.
- **Empty state** — centered stack: a simple line-art SVG illustration (flat, single-color `currentColor`, consistent with the icon set in Section 4 — never a stock illustration or emoji), a `{typography.body-strong}` headline, a `{typography.body}` muted sub-line, optional single `{component.button-primary}` call to action.

Treat this subsection as an addendum layered on top of `APPLE_DESIGN.md`, not a replacement — everything in Section 3 (single accent for actions, weight ladder, radius grammar, one-shadow rule) still governs these new components.

## 4. Icons — SVG ONLY, NEVER EMOJI

- Do not use any emoji character anywhere in the UI, in code comments meant to render as UI text, or as a placeholder icon. This is a hard rule.
- Use **inline SVG components** (React components returning `<svg>`) for every icon: navigation icons, waste-type icons (plastic/paper/metal/glass), status badges, points/coin icon, recycle icon, upload/camera icon, search icon, chevrons, close/checkmarks, etc.
- You may use `lucide-react` (it ships as real SVG, MIT licensed, tree-shakeable) as a base icon set for generic UI icons (search, chevron, close, check, plus, trash, edit, filter, calendar, etc.), imported as React components — this is acceptable because it's SVG, not emoji/icon-font.
- For **domain-specific icons that don't exist in a generic icon set** (e.g., a distinct plastic-bottle icon, a waste-bank/building icon, a scale/weighing icon, a points-coin-leaf icon), hand-author simple, minimal, single-color (`currentColor`) inline SVGs consistent with the flat, geometric, no-gradient Apple aesthetic. Keep them optically consistent in stroke width and corner treatment across the whole set.
- Centralize icons in a single `components/icons/` directory, one file per icon or one barrel file, so they're easy to swap later.

## 5. Backend Integration — LIVE API (real, not mocked)

The exam committee's real backend is already available. Use it directly.

- **API base URL:** `https://learn.smktelkom-mlg.sch.id/bank_sampah/`
- **Swagger / interactive API docs:** `https://learn.smktelkom-mlg.sch.id/bank_sampah/api/docs`
  → Before writing each service file, open the relevant section of these Swagger docs and verify the exact path, method, request body, and response shape match what you implement. The docs are the final source of truth if anything here seems ambiguous.
- Create a `.env.local` file (gitignored — do NOT commit it) at the project root containing:
  ```
  NEXT_PUBLIC_API_BASE_URL=https://learn.smktelkom-mlg.sch.id/bank_sampah/
  ```
  Read it in code via `process.env.NEXT_PUBLIC_API_BASE_URL`. Never hardcode the base URL string a second time anywhere else — always resolve it from this env var through one shared config/client module.

### 5.1 Multi-tenant App Key flow (must be built first, before any other screen)
This backend isolates each student's data behind a per-student "App Key," so this is the very first thing the app must handle:
1. Build a one-time **App Maker onboarding flow**: call `POST /api/v1/maker/register` (fields: `email`, `password`, `namaSiswa`, `kelas`, `namaApp`) to obtain an `appKey` + `token`. If I already registered, provide a **"Login as App Maker"** path instead (`POST /api/v1/maker/login`), and a **"Forgot App Key"** path (`GET /api/v1/maker/check-key?email=`).
2. Persist the resulting `appKey` in `localStorage` (or a cookie) client-side once obtained — this is not a secret in the security sense, but treat it as important user data, not to be logged or printed carelessly.
3. Every subsequent request to any `/api/v1/...` endpoint (except the maker register/login/check-key routes) **must** include header:
   ```
   x-app-key: <stored appKey>
   ```
4. Build one shared HTTP client wrapper (e.g. `lib/api/httpClient.ts`) that automatically attaches `x-app-key` (and, once a user is logged in, `Authorization: Bearer <jwt>`) to every outgoing request, and centrally unwraps/handles the standard response envelope and error format described below. Every other service file should call through this one client — never call `fetch` directly from a component or from an individual service file.

### 5.2 User auth (Nasabah / Admin)
- Nasabah self-register: `POST /api/v1/auth/nasabah/register` (multipart/form-data when a photo is included, JSON otherwise).
- Admin unit register: `POST /api/v1/auth/admin/register`.
- Shared login for both roles: `POST /api/v1/auth/login` → returns `role: "NASABAH" | "ADMIN"`, the relevant profile object, and a JWT `token`. Store the JWT the same way as the appKey and attach it as `Authorization: Bearer <token>` on all authenticated requests from then on.
- `GET /api/v1/auth/me` to re-hydrate the current session (call this on app load if a token exists, to confirm it's still valid and to know which role's shell to render).
- On any `401 Unauthorized` response, clear the stored token and redirect to the login screen.

### 5.3 Response envelope & error handling (apply everywhere, centrally in the HTTP client)
Success:
```json
{ "statusCode": 200, "success": true, "message": "...", "data": { } }
```
Error:
```json
{ "statusCode": 400, "success": false, "message": "...", "errors": null, "timestamp": "..." }
```
Every form and every list view should surface the `message` field on failure (as a toast, inline banner, or field-level error) rather than a generic "something went wrong." Dates from the API are ISO 8601; render them in a readable Indonesian format (e.g., `26 Agustus 2026`) at the UI layer, not by mutating the stored value.

### 5.4 Full endpoint map (mirror this structure exactly in `lib/api/`)
Build one service file per group, each function calling through the shared HTTP client from Section 5.1:

- `lib/api/maker.ts` → `registerAppMaker()`, `loginAppMaker()`, `getMakerProfile()`, `checkAppKeyByEmail()`
- `lib/api/auth.ts` → `registerNasabah()`, `registerAdmin()`, `login()`, `getMe()`
- `lib/api/nasabah.ts` (admin-side customer management) → `getAllNasabah()`, `createNasabah()`, `getNasabahById()`, `updateNasabah()`, `deleteNasabah()`
- `lib/api/kategoriSampah.ts` → `getKategoriSampah()`, `getKategoriSampahById()`, `createKategoriSampah()`, `updateKategoriSampah()`, `deleteKategoriSampah()`
- `lib/api/setorSampah.ts` → `submitSetoran()`, `getMySetoran(bulan?)`, `getAllSetoranAdmin(status?, bulan?)`, `getSetoranDetail(id)`, `verifySetoran(id, payload)`
- `lib/api/hadiah.ts` → `getHadiah()`, `getHadiahById(id)`, `createHadiah()`, `updateHadiah(id)`, `deleteHadiah(id)`
- `lib/api/penukaranPoin.ts` → `tukarPoin(hadiahId)`, `getMyPenukaran()`, `getAllPenukaranAdmin(bulan?)`, `updateStatusPenukaran(id, status)`, `getNotaPenukaran(id)`
- `lib/api/rekapitulasi.ts` → `getRekapBulanan(bulan)`
- `lib/api/dashboard.ts` → `getDashboardSummary()` (nasabah), `getDashboardStats()` (admin)
- `lib/api/seed.ts` → `seedSampleData()` — wraps `POST /api/v1/seed`. Surface this as a small dev-only "Load Sample Data" button (visible only in development mode) so I can quickly populate my own tenant's data for demoing/testing without typing everything by hand.

Match every request body's field names exactly to the DTOs in the API contract (`RegisterAppMakerDto`, `RegisterNasabahBankDto`, `RegisterAdminBankDto`, `LoginUserDto`, `CreateNasabahDto`, `UpdateNasabahDto`, `CreateKategoriSampahDto`, `UpdateKategoriSampahDto`, `CreateSetorSampahDto` with nested `ItemSetorDto[]`, `VerifySetorSampahDto` with nested `VerifyItemSetorDto[]`, `CreateHadiahDto`, `UpdateHadiahDto`, `CreatePenukaranPoinDto`) — do not rename fields to "cleaner" names in the request payloads, since the backend expects them verbatim. You may rename fields for internal component props/state if it improves readability, as long as the mapping to the wire format happens once, centrally, in the relevant `lib/api/*.ts` file.

### 5.5 File uploads
Several endpoints (`foto` fields on nasabah, kategori sampah, hadiah) accept `multipart/form-data`. Build one small shared helper for constructing `FormData` from a form state object + an optional `File`, reused across the customer, category, and rewards forms, so the multipart logic isn't duplicated three times.

## 6. Tech Stack & Project Conventions

- **Next.js** (App Router), **TypeScript** (strict mode), **Tailwind CSS** for styling (mapped to the design tokens above), **React Server/Client components** used appropriately (forms, interactive state, and anything calling the live API from the browser as Client Components).
- State management: local component state + React Context for auth/session (current user, role, JWT, appKey) — no need for Redux/Zustand unless the app genuinely grows complex.
- Form handling: use a lightweight, well-typed approach (native controlled inputs, or `react-hook-form` if you judge it meaningfully cleaner) with clear validation messages, validated client-side before hitting the API where possible (e.g., weight > 0, required fields) in addition to surfacing server-side validation errors.
- File/folder naming: kebab-case for files, PascalCase for component names.
- Every page and every component should be genuinely responsive — test your own layout reasoning at mobile (~390px), tablet (~834px), and desktop (~1280px+) widths as you build, per the breakpoints referenced in APPLE_DESIGN.md.
- Write clean, commented, production-quality code — this is an exam deliverable, not a throwaway prototype. Prefer clarity over cleverness.
- Add `.env.local` to `.gitignore` immediately if a `.gitignore` doesn't already exclude it.

## 7. How I want you to work (please go slow and be thorough)

I would rather this take longer and be right than be fast and sloppy — **please do not rush**. Work in clear phases and pause to summarize progress between phases rather than dumping everything at once:

1. **Phase 1 — Foundations**: set up the Next.js + TypeScript + Tailwind project skeleton, implement the design tokens from `APPLE_DESIGN.md` (fonts, colors, spacing, radii) as a single source of truth, build the base `components/icons/` set, and build the base layout shells (Nasabah shell + Admin shell with their distinct bottom/side navigation).
2. **Phase 2 — Live API bootstrap**: build the shared HTTP client, the App Maker onboarding flow (Section 5.1), the auth flow (Section 5.2), and the full `lib/api/` service layer (Section 5.4) against the real backend. Verify each endpoint actually works against the live API (using the "Load Sample Data" seed button) before moving on.
3. **Phase 3 — Nasabah flow**: implement all 8 Nasabah screens from Section 2.1 end-to-end against the real API, including loading states, empty states, and validation/error surfacing.
4. **Phase 4 — Admin flow**: implement all 9 Admin screens from Section 2.2 end-to-end against the real API, including CRUD interactions, file uploads, and the monthly recap view.
5. **Phase 5 — Polish pass**: responsive QA across breakpoints, consistency pass on spacing/typography/icon usage against the design system, fix any drift from Section 3's rules (no stray shadows, no accent-color drift, no weight-500 text, no radius mixing), and a final pass confirming every screen's error and loading states behave correctly against real API responses (including slow/failed requests).

After each phase, briefly tell me what you built and what's left, so I can review before you continue — don't silently barrel through all 5 phases in one shot.

## 8. Definition of Done for this build

- All 17 screens (8 Nasabah + 9 Admin) exist, are reachable via navigation, and are fully wired to the real live API — no mock data remains in the shipped app (aside from the optional dev-only seed button, which calls the real `/api/v1/seed` endpoint anyway).
- Nothing outside the project folder was touched.
- No emoji anywhere; all icons are SVG.
- Design system rules from Section 3 are followed consistently (single accent color discipline, correct type weights, correct radius grammar, single-shadow rule, no gradients).
- The `lib/api/` layer exactly mirrors the endpoint map in Section 5.4, all requests include the correct `x-app-key` / `Authorization` headers via the shared HTTP client, and all responses/errors are handled through the shared envelope logic.
- `.env.local` holds the API base URL and is gitignored; no token or app key is hardcoded or logged.
- The app builds and runs cleanly with `next dev` with no console errors, and core flows (register App Maker → register/login as Nasabah or Admin → submit a deposit → admin verifies it → nasabah redeems points) work end-to-end against the real backend.
