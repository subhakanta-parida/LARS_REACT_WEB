# LARS Web

Next.js App Router, React, Manulife MUX, and React Hook Form. React Context and useReducer manage request state; React Hook Form owns field state. Vitest and React Testing Library cover the login flow. Custom CSS is isolated in `src/styles/`; Tailwind and alternate UI or state libraries are not used.

## Run

Use Node.js 22. Manulife registry access is required. Configure Artifactory authentication in your user-level npm configuration, never in source control.

```sh
npm ci --legacy-peer-deps
npm run dev
```

Open http://localhost:3000. The legacy peer resolver works around an npm 10 resolver failure observed during initial installation.

```sh
npm test
npm run lint
npm run build
```

## Authentication Integration

No LARS authentication service was supplied. `POST /api/auth/login` intentionally returns HTTP 503; no credentials are accepted, logged, or persisted by the server, and the UI never claims successful authentication. Replace this handler with your approved server-side authentication integration, secure HttpOnly session cookie, CSRF/origin protection, and rate limiting before production. Roles must be assigned and checked server-side, never trusted from the form.

The role options (Analyst, Administrator, Read only) are provisional; replace them with the approved LARS role catalogue. Only an explicitly remembered user ID is stored locally. Passwords are cleared after each attempt and never placed in persistent storage or shared state.

## Design and Quality

Based on the supplied Manulife sign-in reference while preserving the legacy LARS fields and Cancel action. Uses real MUX components, logos, icons, fonts, MuxProvider, Layout, package import optimization, and the `src/*` import alias from the documented Next.js starter structure. This is a minimal implementation of that documented structure, not a clone of the private starter repository.

Reference: https://mux.manulife.com/docs and https://mux.manulife.com/llm/nextjs.

The landscape is loaded from Unsplash; replace it with an approved, locally hosted corporate asset before production. The page targets WCAG 2.1 AA but requires a full accessibility audit. SonarQube must run under your organization's approved quality profile; no profile or server was supplied, so that gate is not claimed as passed.