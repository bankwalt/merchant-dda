# merchant-dda

React prototype for the Jaris Business Anywhere onboarding flow (the DDA
"upgrade" experience that converts a processing-only merchant into a full
deposit-account customer). Six screens — intro, review, agreements, funds
flow, activating, success — including a Lithic-backed virtual-card
provisioning block and Apple/Google Wallet push stubs, plus a structured
consent audit trail and minimal funnel instrumentation ready to swap in
real sinks at Stage 3.

This repo is staged work ahead of integrating into the Jaris frontend
monorepo (`Frontend-dev` / `apps/merchant-portal`). Stages 1–2 are done
on this standalone repo so the dev loop stays fast; Stage 3 moves it
into the monorepo and wires it into the live merchant dashboard.

## Running locally

```bash
npm install
npm run dev        # http://127.0.0.1:5173 (or next free port)
npm run typecheck  # strict TS, must stay clean
npm run lint
npm run format
```

## Status

### Stage 1–2 — Conventions + Tailwind (merged in [#1](https://github.com/bankwalt/merchant-dda/pull/1))

**Stage 1 — Conventions**

- `app/` folder, kebab-case `.tsx` / `.ts` everywhere, `~/*` path alias
- TypeScript strict mode with typed prop interfaces and shared domain
  types in [`app/data/merchant.ts`](app/data/merchant.ts) (`Business`,
  `Applicant`, `Merchant`, `AgreementDef`, `SavingsConfig`,
  `ConsentRecord`…)
- Barrel `index.ts` in `components/`, `screens/`, `data/`
- [`prettier.config.mjs`](prettier.config.mjs) and
  [`eslint.config.mjs`](eslint.config.mjs) mirrored from the monorepo
  root (2-space, double quotes, trailing commas, 100-width,
  `prettier-plugin-tailwindcss`)
- `vite.config.ts` with `vite-tsconfig-paths`

**Stage 2 — Tailwind**

- [`tailwind.config.ts`](tailwind.config.ts) ports
  `@frontend/design-system/tailwind-preset.js` exactly: full palette
  (neutral/primary/secondary/info/success/warning/error), typography
  utilities (`.body-*`, `.heading-*`, `.legal-text`), plugins
  (`@tailwindcss/forms`, `@tailwindcss/aspect-ratio`,
  `tailwindcss-animate`)
- Palette CSS variables in
  [`app/styles/tailwind.css`](app/styles/tailwind.css) `@layer base` —
  byte-identical to the monorepo's `theme/palette.css`
- Existing markup (`body-500`, `heading-700`, `muted`, …) works
  unchanged because the preset I ported provides those classes

### Prototype polish (pre-Stage-3)

Incremental work on the standalone prototype before integration. Each
PR is focused and independently reviewable.

**Flow structure & content**

- Disclosure list consolidated from 4 rows to 2 tabbed groups
  ([#3](https://github.com/bankwalt/merchant-dda/pull/3))
- Intro redesigned around the virtual debit card with an Apple/Google
  Wallet CTA
  ([#4](https://github.com/bankwalt/merchant-dda/pull/4))
- Success screen lands on a non-zero **Business Anywhere** balance
  from the swept settlement
  ([#6](https://github.com/bankwalt/merchant-dda/pull/6)), with a
  matching first-time virtual-card education block (tap, lock,
  settle) ([#12](https://github.com/bankwalt/merchant-dda/pull/12))
- Broader three-prop value hero on intro — no-fee banking, 2% APY
  savings, spend without delay
  ([#8](https://github.com/bankwalt/merchant-dda/pull/8))
- "Partner" brand prefix dropped from product copy everywhere except
  the "Powered by Partner" regulatory footer
  ([#13](https://github.com/bankwalt/merchant-dda/pull/13))

**Failure paths & recovery**

- Support-escape bottom sheet wired into business and applicant
  forms, plus activation-error and wallet-add-failure branches
  reachable via `?demo=activate-fail` and `?demo=wallet-fail`
  ([#5](https://github.com/bankwalt/merchant-dda/pull/5))
- Re-verify-identity copy removed, PAN-reveal fallback on wallet
  failure removed (out of PCI scope), virtual-only card copy
  tightened
  ([#9](https://github.com/bankwalt/merchant-dda/pull/9))
- Wallet buttons restyled to match the official Add-to-Wallet
  pattern — both black, stacked, branded glyphs
  ([#14](https://github.com/bankwalt/merchant-dda/pull/14))

**Quality & a11y**

- Instant-settlement copy consistency, shared `StepDots` with
  `role="group"` + `aria-current="step"`, keyboard-friendly "Mark
  this section as read" on disclosures, live phone/email validation
  on forms
  ([#7](https://github.com/bankwalt/merchant-dda/pull/7))

**Instrumentation**

- Structured consent audit trail stored per accepted group with
  `{groupId, docVersions, acceptedAt, userId}`. `userId` is `null`
  in the prototype; Stage 3 populates it from the Auth0 session
  ([#10](https://github.com/bankwalt/merchant-dda/pull/10))
- Minimal funnel analytics via `track(event, props)` and
  `useScreenView` in [`app/lib/analytics.ts`](app/lib/analytics.ts).
  Eleven events wired across screen mounts and key actions
  (disclosure accepted, activate clicked, activation failed, wallet
  add succeeded/failed, support opened). Console sink for now; Stage
  3 swaps in the real analytics client
  ([#11](https://github.com/bankwalt/merchant-dda/pull/11))

## Stage 3 — Monorepo integration

> **Requires a writable checkout of `Frontend-dev` and cannot run
> standalone.** This prototype's `npm run dev` loop stops working once
> the code moves in, because it will depend on workspace packages.

### Target location

The DDA flow plugs into [`apps/merchant-portal`](https://github.com/Jarisinc/Frontend-dev/tree/main/apps/merchant-portal)
(Nx project name `fasttrack`) as a partner-scoped application sub-flow.
Follow the existing URL pattern:

```
apps/merchant-portal/app/routes/$partner/application/$applicationId/
  dda/
    intro.tsx          ← screens/intro.tsx
    review.tsx         ← screens/review.tsx
    agreements.tsx     ← screens/agreements.tsx
    funds.tsx          ← screens/funds-flow.tsx
    activating.tsx     ← screens/activating.tsx
    success.tsx        ← screens/success.tsx
    layout.tsx         (new — shared step-dots chrome, guards, loader)
```

Register the routes in
[`apps/merchant-portal/app/routes.ts`](https://github.com/Jarisinc/Frontend-dev/blob/main/apps/merchant-portal/app/routes.ts)
under the existing `layout("./routes/$partner/application/$applicationId/layout.tsx", [...])`
block.

### Concrete checklist

**Routing**

- [ ] Convert `useState<Step>` state machine in
      [`app/app.tsx`](app/app.tsx) to React Router v7 file-based routes.
      Replace `onContinue` / `onBack` callbacks with `<Link>` or
      `useNavigate()`.
- [ ] Replace the `PhoneChrome` wrapper with the portal's real layout
      (`root.tsx` + partner layout).
- [ ] Extract shared flow chrome (step-dots, back button, screen-footer)
      into a `layout.tsx` for the `dda/` prefix.

**Data**

- [ ] Replace the in-memory `initialMerchant` with a React Router
      `loader` that fetches the merchant from
      `@frontend/fshp-server/api` using the `applicationSessionId`.
- [ ] Replace `useState` mutations (`updateBusiness`, `updateApplicant`,
      `SavingsForm.onSave`) with `<Form>` + route `action` handlers
      that PATCH to the merchant services used by the existing
      application flow.
- [ ] Disclosures: either move the four HTML files into a
      monorepo-hosted static bucket or serve them via a resource route
      (`app/routes/resources/disclosures.$slug.ts`) mirroring the
      cookies banner pattern at
      `app/routes/resources/notice.tsx`.

**UI / design system**

- [ ] Swap the custom `.btn`, `.btn-primary`, `.btn-secondary`,
      `.btn-ghost` in `app/styles/screens.css` for the
      `@frontend/design-system` `<Button>` component.
- [ ] Swap custom form primitives (`Field`, `TextInput`, `Select`,
      `ReadonlyRow`, `Section` in
      [`app/components/form-fields.tsx`](app/components/form-fields.tsx))
      for the design-system equivalents.
- [ ] Swap the bottom sheet (`EditSheet`, `DisclosureSheet`) for the
      design-system `Sheet` / `Dialog`.
- [ ] Audit remaining custom compositional CSS (`.virtual-card`,
      `.instant-hero`, `.flow-card`, `.savings-cta`) — decide which
      stay as local CSS and which should graduate into
      `packages/ui/design-system/` or a new
      `packages/features/dda-ui/`.
- [ ] Delete the local [`tailwind.config.ts`](tailwind.config.ts) and
      import `@frontend/design-system/tailwind-preset` instead.
- [ ] Delete local palette vars in `app/styles/tailwind.css` — they
      come from `@frontend/design-system/base.css`.

**Nx wiring**

- [ ] Add a `project.json` under the new location with targets for
      `typecheck`, `build-routes`, `dev`, `test` (match the
      `merchant-portal` project.json shape).
- [ ] Add workspace-relative path references in the app's
      `tsconfig.json` for each `@frontend/*` package used.
- [ ] Run `nx sync` so `@nx/react/router-plugin` picks up the new
      routes.

**Partner context + auth**

- [ ] Gate entry behind the existing `applicationAuthMiddleware` so the
      flow only opens inside a valid JWT application session.
- [ ] Wire the "Powered by Partner" chrome in
      [`app/components/phone-chrome.tsx`](app/components/phone-chrome.tsx)
      to the partner-context loader at `routes/$partner/layout.tsx`.
      Product copy already uses the generic "Business Anywhere" name
      per [#13](https://github.com/bankwalt/merchant-dda/pull/13); the
      four bank-owned disclosures stay un-branded per
      [the compliance constraint](#disclosure-ownership).
- [ ] Populate `ConsentRecord.userId` from the Auth0 session (`sub` +
      `org_id`) and persist records server-side when the merchant
      taps Continue on the agreements screen. See
      [`app/data/merchant.ts`](app/data/merchant.ts) for the shape
      and [`app/screens/agreements.tsx`](app/screens/agreements.tsx)
      for the emission point.
- [ ] Replace the `/jaris.svg` logo with the partner's themed logo
      via the existing theming package (`@jarisinc/theming`).

**Card / wallet integration**

- [ ] Wire the Apple / Google Wallet stubs in
      [`app/screens/success.tsx`](app/screens/success.tsx) to Lithic's
      push-provisioning API. See
      [docs](https://docs.lithic.com/docs/digital-wallets-push-provisioning).
      The UI already handles `idle → pending → added/error` per wallet
      with a branded retry variant.
- [ ] Apple Wallet web push is not available — button must deep-link
      to the native portal app on iOS or fall back to a QR handoff.
- [ ] Confirm the PCI posture: the prototype never renders PAN/CVV in
      the DOM (the fallback was removed in
      [#9](https://github.com/bankwalt/merchant-dda/pull/9)). If
      merchants need to see card details later, surface them from a
      Lithic-hosted iframe (`card.embed`) inside the dashboard, not
      this onboarding flow.

**Testing**

- [ ] Port / add Vitest unit tests for reducers and pure helpers.
- [ ] Add Storybook stories colocated with each screen
      (`*.stories.tsx`) — stories are a gating convention in this
      monorepo.
- [ ] Add Playwright e2e flow coverage under
      `apps/merchant-portal-e2e/`.
- [ ] MSW mocks for the new merchant + disclosure endpoints in
      `apps/merchant-portal/test/msw/`.

## Disclosure ownership

Four disclosures in the flow are **not partner-brandable** — their
titles and document content are maintained between Jaris, the merchant,
and sponsor bank First Internet Bank (FIB):

- Deposit Account Terms & Conditions
- Business Savings Disclosure
- Account Fee Schedule
- Visa Business Debit Card Agreement

Do not template the partner brand into these disclosures during
Stage 3. Surrounding UI chrome (colors, logos, "Powered by …") is
fine; the disclosure documents themselves are canonical across
partners.
