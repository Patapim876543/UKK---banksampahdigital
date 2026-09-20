# ANTIGRAVITY PROMPT — Fix: "Failed to fetch" / ERR_CONNECTION_TIMED_OUT on API Requests (EcoBank Digital)

This is a **separate, standalone, narrowly-focused task** on the project that already exists. Do not restart, re-plan features, or touch unrelated screens/files. Your only job right now is to find and fix this one specific connectivity bug.

## 0. CRITICAL SCOPE & SAFETY RULES (NON-NEGOTIABLE)

- Work **ONLY inside this current project's folder**, under `D:\VS CODE SAVER\`. Never read, write, move, or delete anything outside this one project folder.
- Read `lib/api/httpClient.ts` (or wherever the shared HTTP client lives) and its surrounding config fully before changing anything.
- Check `git status`/`git log` first; if there's no repo yet, `git init` and commit the current state before changing anything. Make one small, clearly-labeled commit for this fix.
- If a fix seems to require touching more than the HTTP client / env config / network layer, **stop and ask me first** rather than expanding scope.
- I've previously lost important files from an agent acting outside scope and could not recover them — this rule is the highest priority in this task.

## 1. Context & what's already been diagnosed

Frontend (Next.js + TypeScript) calling the real live API at base URL `https://learn.smktelkom-mlg.sch.id/bank_sampah/` via a shared client in `httpClient.ts`.

I've already isolated the problem somewhat, so **don't waste time re-diagnosing things I've already ruled out**:

- The backend server itself is confirmed healthy: `POST /api/v1/maker/register` and `POST /api/v1/auth/login` both return **201** successfully when tested directly in **Postman**, with no delay, using the exact same request bodies the frontend should be sending.
- The error seen in the frontend, specifically in the browser console, is:
  ```
  httpClient.ts:118  POST https://learn.smktelkom-mlg.sch.id/bank_sampah/api/v1/auth/login net::ERR_CONNECTION_TIMED_OUT
  ```
  (Line 118 of `httpClient.ts` — the exact line number may shift as you edit, but locate the actual `fetch`/axios call that's throwing this.)
- This does **NOT look like classic CORS** (a CORS block shows a distinct "blocked by CORS policy" console message and the request would appear as `(failed) net::ERR_FAILED` or similar with a CORS-specific reason, not a raw timeout) — but don't rule it out entirely without checking; a CORS preflight (`OPTIONS`) request hanging or being mishandled by the browser can sometimes surface in confusing ways.
- The failure appears **intermittent** — retrying the same login in the browser sometimes succeeds. This pattern (works in Postman every time, fails/times out unpredictably in the browser) points strongly toward something in the frontend's own request-handling code or environment, not the backend itself.

## 2. What to investigate, in this order

1. **Check for a client-side timeout/AbortController that's too short or misconfigured.** Open `httpClient.ts` and look for any `AbortController`, `signal`, or manual timeout logic (`setTimeout(() => controller.abort(), ...)`). If there's a hardcoded timeout value that's too aggressive (e.g., a few hundred ms, or a timeout that doesn't account for a real network round-trip to an external server), that alone can cause exactly this symptom — Postman has no such artificial limit, so it "succeeds" while your own client gives up early. If found, either remove the artificial timeout or set it to something realistic (e.g., 15–30 seconds) for calls to this external API.
2. **Check the base URL is being read and constructed correctly.** Confirm `process.env.NEXT_PUBLIC_API_BASE_URL` is actually resolving to the correct value at runtime in the browser (log it once temporarily to confirm, then remove the log). Watch for: a stale/missing value because the dev server wasn't restarted after `.env.local` was created or changed (Next.js requires a restart to pick up new env vars), a malformed URL from string concatenation (e.g., double slashes `//api/v1/...`, or a missing slash producing a wrong host), or the env var accidentally being `undefined` and `fetch` being called with a broken/relative URL that resolves somewhere unexpected.
3. **Check for duplicate or overlapping in-flight requests.** If a button isn't properly disabled while a request is pending, a user (or React re-render / effect re-run in dev's Strict Mode double-invoke) could be firing multiple concurrent requests to the same endpoint, and one hanging could visually look like "the login times out." Check the login form/handler for a missing loading-state guard, and check for any `useEffect` that might be re-triggering the call unexpectedly.
4. **Check retry/interceptor logic for a bug.** If there's any custom retry wrapper, request queue, or interceptor around the fetch/axios call, read it carefully for a logic bug that could cause a request to hang without ever resolving or rejecting properly (e.g., a retry loop with a broken exit condition, or a promise that's never resolved/rejected on a particular code path).
5. **Check whether dev-mode network throttling or a browser extension could be involved**, though this is less likely to be something you can fix in code — if steps 1–4 turn up nothing, note this as a possibility for me to check manually (e.g., ad-blocker or privacy extension interfering with the request, or Chrome DevTools "Network throttling" accidentally left on).
6. **Add clear, temporary diagnostic logging** around the actual `fetch`/axios call in `httpClient.ts` (request URL, headers being sent, timestamp before/after) so that if the bug is intermittent and hard to pin down from code review alone, we can capture more detail the next time it happens. Remove or gate this behind a `if (process.env.NODE_ENV === "development")` check so it doesn't ship to production noise.

## 3. Fix approach

- Fix the smallest thing that addresses the actual root cause you found — don't rewrite the whole HTTP client speculatively "just in case."
- If you find and fix an overly-aggressive timeout, make the new timeout value a named constant (not a magic number) so it's easy to tune later.
- If you find the request is duplicating, add the appropriate guard (disable button while pending, cancel previous in-flight request on a new one if that's the right UX, or fix the effect dependency causing re-firing).
- After the fix, test by logging in repeatedly, at least 10–15 times in a row, to confirm the intermittent failure no longer occurs — a single successful attempt doesn't prove an intermittent bug is fixed.

## 4. How to report back

Tell me specifically:
- What you found at each investigation step (even the ones that turned out fine — briefly confirm you checked).
- Which one was the actual root cause (or if you found more than one contributing issue).
- What you changed, in which file(s).
- How you verified it — specifically, how many repeated login/request attempts you tested and whether the issue recurred.

If after going through all of Section 2 you still can't find a code-level cause, say so plainly and tell me which of the remaining possibilities (browser extension, local network instability, a genuinely flaky moment on the backend despite Postman looking fine) seems most likely, rather than guessing at a fix for a cause you haven't actually confirmed.
