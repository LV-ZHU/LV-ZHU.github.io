# Frontend ownership and verification

## Boundaries

- `src/styles/common.css`: base elements and legacy shared controls. `shell.css`: navigation, footer, and comments. `surfaces.css`: shared inner-page layout, headings, resource links, and controls. It replaces `atlas-pages.css`; do not recreate an override stylesheet.
- Page styles use a page-root class through `:where(...)`. Keep new selectors scoped to that page, or move genuinely reusable rules into the shared layer. Homepage presentation is independent; inner-page refinements must not change it.
- Content belongs in `src/data/`; page composition belongs in `src/pages/`. Favorites and Travel controllers live in their `features` folders. Project articles have a separate presentation module so the route dispatcher stays small.
- Music retains its existing source order, search aliases, stable IDs, six platform links, and reviews. Study routes reuse the existing course registry without changing URLs.
- Preserve Chinese file encodings, user-authored strings, external links, storage keys, and Firebase schema. Dynamic dimensions may remain inline; static presentation belongs in CSS.

## State

- Storage helpers return defaults when reading fails and refuse to overwrite malformed records. Saving failures are contained; no automatic reset or data migration is performed.
- Travel cancels superseded map fetches and cancels pending synchronization when leaving the page. Favorites retains its timer cleanup and uses a separately tested typing transition.
- Only user-triggered actions should write to Firebase. Verification must not create test comments, travel records, or account changes in production.

## Checks

Run `npm test` for search identity, category filtering, platform encoding, storage failures, typing transitions, and map state/key compatibility. Run `npm run build` after a coherent set of edits.

For the 2026-09-21 refactor, static content comparisons passed for learning resources, favorite records, ACGN, music, project articles, travel, and jottings. Homepage sources match the saved pre-refactor baseline. Fifteen page components passed server-render smoke checks. Server rendering does not validate layout, effects, or network interactions.

Outstanding acceptance: browser tooling failed to load its request-header policy on two attempts. The final 390/768/1440px visual sweep, light/dark interaction checks, and live map behavior remain unverified. Authentication and remote writes were not exercised. Do not describe these as passed.

When browser access is restored, perform one consolidated sweep of Home, Study, project details, an article, Music, ACGN, Favorites, Travel, and Account. Check long text, local scrolling of wide tables, keyboard focus, mobile controls, and unchanged homepage appearance. Do not repeat the sweep after unrelated changes.
