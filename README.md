# Immidart Dashboard

A global mobility and immigration case-management platform built with TanStack Start, Tailwind CSS v4, and shadcn/ui. Originally scaffolded by Lovable and hand-finished into a production-grade prototype covering three personas: **Case Manager**, **Employee/Assignee**, and **Supervisor**.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Authentication](#authentication)
6. [Routing](#routing)
7. [Pages & Functional Logic](#pages--functional-logic)
   - [Login](#login-login)
   - [Case Manager Dashboard](#case-manager-dashboard-)
   - [Employee Dashboard](#employee-dashboard-employee)
   - [Employee Lite](#employee-lite-employee-lite)
   - [Supervisor](#supervisor-supervisor)
   - [Supervisor v2](#supervisor-v2-supervisor2)
   - [Supervisor v3 — All Caught Up](#supervisor-v3--all-caught-up-supervisor3)
   - [Supervisor v4 — All Caught Up + Empty KPIs](#supervisor-v4--all-caught-up--empty-kpis-supervisor4)
   - [Immigration Operations](#immigration-operations-immigration)
   - [Assignment Request Form](#assignment-request-form-assignment-request)
   - [Case Detail](#case-detail-casecaseid)
   - [Action Center](#action-center-actions)
   - [Reports Home](#reports-home-reports)
   - [Application Reports](#application-reports-reportsappid)
   - [Search Results](#search-results-search)
   - [Profile](#profile-profile)
   - [Visa Guide](#visa-guide-visa-guide)
8. [Shared Components](#shared-components)
9. [Data Types & Shapes](#data-types--shapes)
10. [Business Workflows](#business-workflows)

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | TanStack Start | 1.167.50 |
| Router | TanStack React Router | 1.168.25 |
| UI | React | 19.2.0 |
| Types | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 4.2.1 |
| Components | shadcn/ui (Radix UI) | latest |
| Icons | Lucide React | 0.575.0 |
| Flags | flag-icons | 7.5.0 |
| Server state | TanStack React Query | 5.83.0 |
| Forms | React Hook Form + Zod | 7.71 / 3.24 |
| Charts | Recharts | 2.15.4 |
| Build | Vite | 7.3.1 |
| Deployment | Cloudflare Workers | via `@cloudflare/vite-plugin` |
| Formatting | Prettier | 3.7.3 |
| Linting | ESLint | 9.32.0 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server on port 8080
npm run dev -- --port 8080

# Build for production
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

The dev server runs at `http://localhost:8080`. Navigate to `/login` to authenticate.

---

## Project Structure

```
src/
├── assets/               # Static assets (background images)
├── components/           # Shared UI components
│   ├── ui/               # shadcn/ui primitives (Button, Tabs, Sheet, etc.)
│   ├── ActionCentreButton.tsx
│   ├── AppLoader.tsx
│   ├── ApplicationBadge.tsx
│   ├── AskImmibroButton.tsx
│   ├── CreateRequestButton.tsx
│   ├── FlagIcon.tsx
│   ├── MyAssignmentCard.tsx
│   ├── PageHeader.tsx
│   ├── ReportsButton.tsx
│   ├── RequireAuth.tsx
│   └── UserMenu.tsx
├── data/
│   └── reportApplications.ts   # Saved report metadata per module
├── hooks/
│   └── use-mobile.tsx           # Responsive breakpoint hook
├── lib/
│   ├── auth.ts                  # localStorage-based auth helpers
│   ├── error-capture.ts
│   ├── error-page.ts
│   └── utils.ts                 # cn() class-merge utility
├── routes/               # File-based routes (one file = one page)
│   ├── __root.tsx         # Root layout, QueryClient provider, 404/error pages
│   ├── index.tsx          # Case Manager Dashboard (/)
│   ├── login.tsx
│   ├── employee.tsx
│   ├── employee-lite.tsx
│   ├── supervisor.tsx
│   ├── supervisor2.tsx
│   ├── supervisor3.tsx
│   ├── supervisor4.tsx
│   ├── immigration.tsx
│   ├── assignment-request.tsx
│   ├── case.$caseId.tsx
│   ├── actions.tsx
│   ├── reports.tsx
│   ├── reports.$appId.tsx
│   ├── search.tsx
│   ├── profile.tsx
│   └── visa-guide.tsx
├── router.tsx             # Router configuration
├── routeTree.gen.ts       # Auto-generated route tree
├── server.ts              # TanStack Start server entry
├── start.ts               # Client entry
└── styles.css             # Global styles + Tailwind v4 theme tokens
```

---

## Design System

### Brand Tokens

All tokens are defined as CSS custom properties in `src/styles.css` using the `@theme inline` directive and OKLch color space.

```css
/* Core brand palette */
--brand-canvas:  oklch(0.97 0.012 95)   /* Page background — warm off-white */
--brand-navy:    oklch(0.28 0.16 265)   /* Primary text, headers, nav */
--brand-blue:    oklch(0.55 0.22 258)   /* Interactive elements, links */
--brand-sky:     oklch(0.72 0.16 240)   /* Secondary accents */
--brand-orange:  oklch(0.72 0.18 55)    /* Highlight accent */
--brand-red:     oklch(0.60 0.22 25)    /* Errors, urgency, overdue */
--brand-amber:   oklch(0.78 0.15 70)    /* Warnings, pending states */

/* Semantic tokens (shadcn/ui compatible) */
--background:          oklch(1 0 0)
--foreground:          oklch(0.15 0.05 260)
--muted:               oklch(0.96 0.01 250)
--muted-foreground:    oklch(0.50 0.03 260)
--accent:              oklch(0.95 0.04 250)
--border:              oklch(0.92 0.01 250)
--ring:                oklch(0.55 0.18 260)
--table-head:          oklch(0.92 0.03 220)
```

### Status Colour Mapping

| Status | Colour | Token |
|---|---|---|
| Pending for Approval | Amber | `bg-brand-amber/10 text-brand-amber` |
| Pending for Screening | Green | `bg-emerald-500/10 text-emerald-600` |
| Visa Filed | Blue | `bg-brand-blue/10 text-brand-blue` |
| Awaiting Decision | Sky | `bg-brand-sky/20 text-brand-navy` |
| Docs Submitted | Green | `bg-emerald-500/10 text-emerald-600` |
| Approved | Green | `bg-emerald-500/10 text-emerald-600` |
| Completed | Green | `bg-emerald-500/10 text-emerald-600` |

### Typography Scale

| Preset | Root `font-size` | Use-case |
|---|---|---|
| `compact` | 13 px | Density-first screens |
| `default` | 16 px | Standard UI |
| `large` | 18 px | Accessibility mode |

Applied via `html[data-font-size="compact|default|large"]`.

### Radius System

```
--radius:    0.5 rem  (8 px)  base card corners
--radius-sm: 0.25 rem (4 px)  pills, badges
--radius-md: 0.375 rem (6 px)
--radius-lg: 0.5 rem  (8 px)
--radius-xl: 0.625 rem (10 px)
```

### Animations

| Name | Duration | Purpose |
|---|---|---|
| `fade-in-up` | 0.35 s | Page/card entrance — scale 0.96→1, y −8 px→0 |
| `immidart-orbit` | 12 s ∞ | Module icons orbit around AppLoader centre |
| `immidart-pulse` | 2.4 s ∞ | AppLoader centre wordmark breathe scale |

---

## Authentication

Authentication is localStorage-based (demo only — no backend).

**Helpers** (`src/lib/auth.ts`):

| Function | Description |
|---|---|
| `setAuth(role)` | Persist role to `immidart_auth_role` key |
| `getAuth()` | Read current role |
| `clearAuth()` | Remove on logout |
| `isAuthenticated()` | Returns `true` if key exists |

**Demo Credentials**

| Field | Value |
|---|---|
| Email | `sudharsan@immidart.com` |
| Password | `$Immidart@123$` |

**Role → Landing Page**

| Role | Redirects to |
|---|---|
| Case Manager | `/` |
| Employee | `/employee` |
| Supervisor | `/supervisor2` |
| Supervisor (All Caught Up) | `/supervisor3` |
| Supervisor (All Caught Up + KPI) | `/supervisor4` |

Protected routes are wrapped in the `<RequireAuth>` component which redirects to `/login` if no session exists.

---

## Routing

Routes are file-based via TanStack Router. The route tree is auto-generated into `src/routeTree.gen.ts`.

| Path | File | Persona |
|---|---|---|
| `/login` | `login.tsx` | Anonymous |
| `/` | `index.tsx` | Case Manager |
| `/employee` | `employee.tsx` | Employee |
| `/employee-lite` | `employee-lite.tsx` | Employee (simplified) |
| `/supervisor` | `supervisor.tsx` | Supervisor |
| `/supervisor2` | `supervisor2.tsx` | Supervisor (v2) |
| `/supervisor3` | `supervisor3.tsx` | Supervisor (All Caught Up) |
| `/supervisor4` | `supervisor4.tsx` | Supervisor (All Caught Up + empty KPIs) |
| `/immigration` | `immigration.tsx` | Case Manager / Immigration Ops |
| `/assignment-request` | `assignment-request.tsx` | Employee / Case Manager |
| `/case/$caseId` | `case.$caseId.tsx` | All personas |
| `/actions` | `actions.tsx` | Case Manager |
| `/reports` | `reports.tsx` | Case Manager |
| `/reports/$appId` | `reports.$appId.tsx` | Case Manager |
| `/search` | `search.tsx` | All personas |
| `/profile` | `profile.tsx` | All personas |
| `/visa-guide` | `visa-guide.tsx` | All personas |

The root layout (`__root.tsx`) wraps all routes with `QueryClientProvider` and provides a custom 404 and error boundary.

All routes with async loaders use a simulated 3 s delay (`await new Promise(r => setTimeout(r, 3000))`) to demonstrate the `AppLoader` pending state.

---

## Pages & Functional Logic

---

### Login (`/login`)

**Persona**: Anonymous

**Purpose**: Credential entry and role selection before entering the platform.

**Sections**

| Section | Detail |
|---|---|
| Branding | Immidart logo (blue + orange wordmark) |
| Email field | Text input, validated on submit |
| Password field | Password input, toggle visibility |
| Role selector | Dropdown — 5 roles map to different landing pages |
| Error banner | Inline error if credentials do not match hardcoded values |
| Submit button | Disabled until all three fields are filled |

**State**: `email`, `password`, `role`, `error`

---

### Case Manager Dashboard (`/`)

**Persona**: Case Manager / Operations

**Purpose**: Central hub for team case oversight, action tracking, and quick-access to all mobility modules.

**Hero section** — fixed `475 px` tall, 3-column grid `[340px · 1fr · auto]`:

| Column | Content |
|---|---|
| KPI cards (340 px) | 2 × 2 grid of stat cards (Pending Approvals, Team Abroad, Cases In Progress, Total Assignments). Each card is left-border-accented by tone (red / blue / green), shows a large value, and opens a slide-out case list on click. |
| Things to do (1fr) | Tabbed card — Approvals · Clarifications. Each task row shows ApplicationBadge, label, title, due date (red if urgent), and a ChevronRight link to `/case/$caseId`. Empty tab shows "Nothing here right now." Immibro hint shown when only 1 task remains. |
| Help & Resources (auto) | 2 × 2 grid of icon buttons: Information Portal, Get Support, Mobility Resources, Knowledge Base. |

**Applications strip** — 6-column row of quick-links:
`Assignments · Immigration · Travel · Coverage · LCA · Invite Letter`

**All Cases table** — full-width white card:
- Tabs: All cases · Needs your sign-off (with count)
- Popover filter: Destination Country
- Search bar: filters by Case No., Team Member, Country, Status in real-time
- Columns: Case No. · Team Member · Travelling to · Status · Action by
- Rows link to `/case/$caseId`

**Case list sheet** — slides in from right when a KPI stat card is clicked:
- Search bar within sheet
- Same table columns as the main case table

**Floating**: Ask Immibro button (bottom-right)

**Key data arrays**: `stats` (4 KPI cards), `supervisorTasks` (task rows), `rows` (team case table), `overlayCases` (stat sheet)

---

### Employee Dashboard (`/employee`)

**Persona**: Employee / Assignee

**Purpose**: Personal view of assignment progress, action items, and self-service tools.

**Hero section** — fixed `475 px`, 2-column grid `[1fr · 1fr]`:

| Column | Content |
|---|---|
| Your Assignment (1fr) | **Two-column internal layout** — Left pane (432 px): flag progress bar (IND → US with animated plane icon), 4-field meta grid (Type, Start date, Visa type, Case ref.), full-width `Pending for Screening` status badge (`text-[15px]`, `py-3.5`), two stacked action buttons (View Immigration Request · View Assignment Request), footer with last-updated date. Right pane (flex-1): condensed Latest Update notification card + Request Progress section with two milestone cards (current: green circle, next: lighter green, `animate-pulse`). |
| Things to do (1fr) | Same tabbed structure as Case Manager (My Tasks · Approvals · Clarifications). |

**Applications strip**: Same 6 quick-links as Case Manager.

**All Cases table**: Same structure as Case Manager.

**Floating**: Ask Immibro button

---

### Employee Lite (`/employee-lite`)

**Persona**: Employee (simplified / reduced-scope view)

**Purpose**: Stripped-down landing page for employees who only need quick-access to self-service tools.

**Sections**

| Section | Detail |
|---|---|
| Page Header | Shows name "Clark Kent", role "Employee" |
| Central card | WorkAbroad description paragraph, Create Request CTA |
| Quick actions | 4 buttons — Ask Immibro (gradient), Visa Guide, Knowledge Base, Service Now |

**Floating**: Ask Immibro button

---

### Supervisor (`/supervisor`)

**Persona**: Supervisor / Line Manager

**Purpose**: Team oversight — pending approvals, clarifications, and live case status.

**Hero section** — fixed `475 px`, 3-column grid `[340px · 1fr · auto]`:

Identical column structure to the Case Manager Dashboard (KPI cards · Things to do · Help & Resources). Supervisor-specific differences:

- Things to do tabs: **Approvals · Clarifications** (no "My Tasks")
- Stat cards link to supervisor-scoped case overlays
- `supervisorTasks` data includes approval and clarification type items

**Applications strip**, **Team Cases table**, and **Case list sheet** are structurally identical to the Case Manager page.

**My Assignment Card** shown above the hero if the supervisor is also an active assignee (`MyAssignmentCard` component).

---

### Supervisor v2 (`/supervisor2`)

**Persona**: Supervisor (extended variant)

**Purpose**: Full-featured supervisor view with Your Assignment section alongside Things to do and team cases.

**Hero section** — fixed `475 px`, 3-column grid `[340px · 1fr · 1fr]`:

| Column | Content |
|---|---|
| KPI cards + H&R (340 px) | 2 × 2 KPI grid (h-330 px) stacked above Help & Resources (flex-1). |
| Things to do (1fr) | Tabbed task list — Approvals · Clarifications. Task list is `overflow-y-auto` so it scrolls within the fixed height. Immibro hint when 1 task remains. |
| Your Assignment (1fr) | Same two-column layout as Employee hero — 432 px left pane (progress bar, meta grid, status badge `text-[15px]`, stacked buttons, footer) + flex-1 right pane (Latest Update notification + Request Progress milestone cards). |

**Applications strip** and **Team Cases table** identical to other supervisor pages.

**Quirky empty-state hint** (Things to do): when only 1 task remains, a `Sparkles` icon and Immibro CTA appear in the remaining space below the task list.

---

### Supervisor v3 — All Caught Up (`/supervisor3`)

**Persona**: Supervisor with no pending work

**Purpose**: Show a positive, zero-queue state — all approvals cleared, all cases resolved.

**Key data**: `supervisorTasks = []` (empty array) → `hasPendingCases = false`

**Conditional hero layout** (`hasPendingCases ? activeLayout : caughtUpLayout`):

**Active layout** (never shown with empty array — for reference): `[340px KPI · 1fr Your Assignment · 340px H&R]`

**Caught-up layout** (always shown): `[1fr Your Assignment · 340px H&R]`

| Column | Content |
|---|---|
| Your Assignment (1fr) | Identical two-column card to supervisor2 (432 px left + flex-1 notification + milestones). |
| Help & Resources (340 px) | 2 × 2 grid of resource buttons. |

**KPI stat values**: All four show `"00"` — no pending approvals, no active cases. Green "Nothing to sign off" / "All cases closed" badges.

**Team Cases table** still shows historical data (Completed, Approved, Docs Submitted statuses visible) — supervisor3 surfaces full case history even in the all-caught-up state.

---

### Supervisor v4 — All Caught Up + Empty KPIs (`/supervisor4`)

**Persona**: Supervisor with no pending work and no case history (new team / fresh start)

**Purpose**: Edge-case empty state — team has no assignments at all, not just a clear queue.

**Differences from supervisor3**:

| Property | supervisor3 | supervisor4 |
|---|---|---|
| Team Members Abroad | `"12"` | `"00"` |
| Total Team Assignments | `"148"` | `"00"` |
| `rows` (case table) | 6 historical rows | 4 rows |
| `overlayCases` | Populated | Empty array |

Layout and components are otherwise identical to supervisor3 (caught-up state).

---

### Immigration Operations (`/immigration`)

**Persona**: Case Manager / Immigration Operations specialist

**Purpose**: Specialised dashboard for screening, processing, and pipeline visibility across immigration requests.

**Navigation bar** (dark brand-navy, scrollable):
`Operations Dashboard · My Work Permit · Approvals · Screening · Compensation Benefits · Processing · Visa Processing`

**Sub-tab bar**: `Operations Dashboard` (active, blue underline)

**Filter bar** — 4 dropdowns + search + clear:
`Screener (Me / Team) · Destination Geo (EMEA / APAC / Americas) · Destination Country · Request Type (Work Permit / IWA / ATR)`

**KPI cards** (5 columns):
| Metric | Value |
|---|---|
| Clarification Pending with me | 2 |
| Clarification Responded | 10 |
| Clarification Requested | 28 |
| Pending for Screener Review | 33 |
| Allocated Case | 425 |

---

### Assignment Request Form (`/assignment-request`)

**Persona**: Employee / Case Manager initiating a new assignment

**Purpose**: Multi-step wizard to capture all information required for a new assignment or visa request.

**Stepper** (2 steps):

| Step | Label | State |
|---|---|---|
| 1 | Initiation Questionnaire | Active by default |
| 2 | Select Service Required | Unlocked after step 1 |

- Progress bar fills between steps
- Steps are clickable to navigate back
- Completed steps are visually distinguished; current step is bold; future steps are greyed

**Navigation**: "Next" button advances the stepper; back navigation returns to previous step.

---

### Case Detail (`/case/$caseId`)

**Persona**: All personas

**Purpose**: Full case record — documents, status, history, and all quick-action links for a single case.

**Navigation bar** (dark brand-navy, horizontally scrollable):
`Operations Dashboard · My Work Permit · Approvals · Screening · Compensation Benefits · Processing · Visa Processing · Review`

Left/right chevron buttons appear when tab content overflows the viewport.

**Sub-tab bar**: `Screening` (active, blue underline)

**Quick Links grid** (3 columns on desktop, responsive):
15 deep-link tiles — `Initiation Questionnaire · Questionnaire · Documents · Qualifying Rules · Salary · Letters · Generate Letters · Casekit · Visa/Work Information · Appointment details · Insurance Details · Clarification · Progress Tracker · Emails · Case Logs`

**Collapsible content panel**:
- Toggle button to expand/collapse the main case detail area
- State persisted to `localStorage` keyed by `caseId`

---

### Action Center (`/actions`)

**Persona**: Case Manager / Supervisor

**Purpose**: Prioritised queue of all cases requiring an action (approvals or clarifications), with sorting, filtering, and saved searches.

**Sections**

| Section | Detail |
|---|---|
| Tab filter | All · Approvals · Clarifications |
| Application filter | Multi-select checkboxes: Assignments, Immigration, Travel, etc. |
| Saved searches | Pre-saved named filters ("Portugal Pending", "Work Permits"); deletable |
| Sort controls | Column header click (asc/desc toggle); SLA quick-sort dropdown (None · High→Low · Low→High) |
| Table view | Default; columns — Case No. · Name · Country · Status · Initiated · SLA. Pagination at 8 rows/page. |
| Board view | Kanban columns by status (alternate mode, toggled via icon button) |

**Status values in this page**: `Pending for Screening · Pending for Supervisor Approval · Awaiting Clarification · Pending Documents Upload · Clarification Requested`

**Data**: `allRows` — 12 action items with case details, type (`approval | clarification`), SLA days.

---

### Reports Home (`/reports`)

**Persona**: Case Manager / Analytics user

**Purpose**: Browse and launch pre-built dashboards and saved reports.

**Tabs**: Reports · Dashboards

**Dashboard cards** (6):

| Dashboard | Tag |
|---|---|
| Assignment Overview | Assignments |
| Immigration Pipeline | Immigration |
| Travel Analytics | Travel |
| SLA Performance | All modules |
| Compliance Monitor | Compliance |
| Pending Actions Tracker | All modules |

Each card shows name, description, icon, last-viewed date, and module tag. Clicking opens the dashboard.

---

### Application Reports (`/reports/$appId`)

**Persona**: Case Manager

**Purpose**: View, generate, download, and delete saved reports for a specific application module.

**URL parameter**: `appId` — one of `assignments | immigration | travel | coc | lca | invite-letter`

**Sections**

| Section | Detail |
|---|---|
| Header | Application icon + label + "X reports generated for [App]" count |
| Add Report dialog | Report name input, format selector (PDF · XLSX · CSV), Generate button |
| Reports table | Columns — Report Name · Generated On · Generated By · Format · Actions (View, Download, Delete) |

**Data source**: `src/data/reportApplications.ts` — 6 application objects, each with pre-populated `SavedReport[]`.

---

### Search Results (`/search`)

**Persona**: All authenticated users

**Purpose**: Cross-platform search across cases, visa guide entries, and the information portal.

**URL parameter**: `q` (query string from the header search bar)

**Sections**

| Section | Detail |
|---|---|
| Query display | "Showing results for '[q]'" + result count |
| Cases section | Filtered list — Employee name, Case No. (blue monospace), from→to countries with flags, start–end dates. Clicking a row navigates to `/case/$caseId`. |
| Empty state | "No results found" message |

**Filter logic**: Case-insensitive match across employee name, request number, from country, to country.

---

### Profile (`/profile`)

**Persona**: All authenticated users

**Purpose**: View and manage personal and organisational profile information.

**Layout**: Two-column — 360 px left sidebar + flex-1 content panel

**Navigation bar** (brand-blue background, scrollable):
`MY PROFILE · PORTAL · KNOWLEDGE BASE`

**Left sidebar**

| Element | Detail |
|---|---|
| Dependents button | Top-right corner |
| Avatar | Circular, UserIcon fallback |
| Name | "IMMIDART ONE" |
| Profile tabs (3 × grid) | Organization · Personal · Address · Qualification · Passport · Immigration · Experience |

Active tab: navy background. Inactive: brand-blue background.

**Right content panel — Organisation Information** (shown by default):

15 fields displayed in a 3-column grid:
`GGID · Official Email · Operating Unit · Personnel Number · Employment Status · Employee ID · Global Grade · Hire Country · Local Grade · Current Designation · Legal Entity Name · Production Unit · Business Area · Strategic Business Unit · Business Unit`

Edit button (pencil icon) at top-right of the panel.

---

### Visa Guide (`/visa-guide`)

**Persona**: All authenticated users

**Purpose**: Look up visa requirements and entry conditions for a given origin → destination → visa type combination.

**Layout**: Centered card, max-width 3xl

**Search form** (3-column grid):

| Field | Type | Options |
|---|---|---|
| Travelling from | Searchable combobox | 15 countries (USA, UK, Canada, Australia, Germany, France, India, Singapore, Netherlands, Ireland, Japan, UAE, Switzerland, Sweden, Spain) |
| Travelling to | Searchable combobox | Same 15 countries |
| Visa Type | Searchable combobox | Work · Business · Student · Tourist · Dependent · Permanent Residence · Intra-Company Transfer · Short-Term Assignment |

Results are displayed below the form after submission.

---

## Shared Components

### `PageHeader`

Props: `name?`, `role?`, `compact?`

Full-width white header with 2 px navy bottom border. Contains:
- **Immidart logo** (left) — links to `/`
- **Search bar** (w-80, `Sparkles` icon) — triggers navigation to `/search?q=<query>` on Enter
- **Action Centre button** — links to `/actions`
- **Create Request button** — dropdown: International Assignment · Business Visa, both link to `/assignment-request`
- **Alerts bell** — opens a Sheet panel ("No alerts right now")
- **User menu** — avatar + name + popover (profile link, privacy notice, logout)

`compact` mode renders icon-only controls for use on detail pages where horizontal space is limited.

---

### `ApplicationBadge`

Props: `app: ApplicationType`, `className?`

Small pill component colour-coded by application module:

| App | Colours |
|---|---|
| Assignments | `bg-brand-blue/10 text-brand-blue` |
| Immigration | `bg-brand-navy/10 text-brand-navy` |
| Travel | `bg-brand-sky/20 text-brand-navy` |
| COC | `bg-emerald-500/10 text-emerald-600` |
| LCA | `bg-violet-500/10 text-violet-600` |
| Invite Letter | `bg-teal-500/10 text-teal-600` |

---

### `MyAssignmentCard`

Displays overdue supervisor tasks — cases from a reportee that need the supervisor's attention.

**Visual**: Dark navy card. Each row shows an "Overdue Task" alert badge, case reference (linked), reportee name, destination flag, status pill, and a "Complete action" button. A chevron expands extra items; the count of extras is shown as a red badge.

**Data shape**:
```typescript
{
  caseRef: string;
  reportee: string;
  description: string;
  flagCode: string;     // ISO 3166-1 alpha-2
  status: string;
}
```

---

### `CreateRequestButton`

Green-bordered dropdown button. Two options:

| Option | Icon | Route |
|---|---|---|
| International Assignment | Briefcase (green bg) | `/assignment-request` |
| Business Visa | Plane (green bg) | `/assignment-request` |

---

### `AskImmibroButton`

Floating chat assistant (bottom-right, fixed position).

**Trigger**: Brand-blue button with `MessageCircle` icon and "Ask Immibro" label.

**Chat panel** (384 px wide on desktop):
- Dark navy header with bot icon and close button
- Message bubbles — assistant (left, white bg) vs. user (right, blue bg)
- Typing indicator (3 bouncing dots)
- Text input + Send button

**Bot logic**: Keyword-based canned responses (`visa`, `document`, `status`, `sla`). Falls back to a generic reply for unrecognised input.

---

### `UserMenu`

Props: `name?`, `role?`, `compact?`

Popover menu anchored to the user avatar in the header.

| Item | Detail |
|---|---|
| Identity | Avatar + name + role (read-only) |
| View profile | Links to `/profile` |
| Data & Privacy | Inline privacy notice with "Read full privacy notice →" link |
| Log out | Calls `clearAuth()`, navigates to `/login` |

---

### `FlagIcon`

Props: `code: string` (ISO 3166-1 alpha-2), `className?`

Renders `<span className="fi fi-{code}">` using the `flag-icons` CSS library.

---

### `AppLoader`

Full-screen loader shown during route transitions (`pendingComponent`).

**Visual**: Immidart wordmark centred (pulsing, 2.4 s), surrounded by 6 module icons in orbital rotation (12 s, infinite). Each icon counter-rotates to stay upright. Dashed circular track behind orbit. Custom `message?` prop below the orbit.

---

### `RequireAuth`

Wrapper component that reads `isAuthenticated()` and redirects to `/login` if no session is found.

---

## Data Types & Shapes

```typescript
// KPI stat card
type Stat = {
  label: string;
  value: string;
  badge: string;
  tone: "red" | "amber" | "blue" | "green";
};

// Team case table row
type CaseRow = [
  caseNo: string,
  name: string,
  country: string,
  status: string,
  actionBy: string,
];

// Supervisor / case-manager task
type Task = {
  id: string;
  type: "task" | "approval" | "clarification";
  app: "Assignments" | "Immigration" | "Travel" | "COC" | "LCA" | "Invite Letter";
  label: string;
  title: string;
  description: string;
  dueDate: string;
  urgent: boolean;
  actionLabel: string;
  caseId: string;
};

// Action Center row
type ActionRow = {
  caseNo: string;
  name: string;
  country: string;
  status: string;
  initiated: string;
  sla: number;          // days remaining
  type: "approval" | "clarification";
};

// Saved report (reportApplications.ts)
type SavedReport = {
  id: string;
  name: string;
  generatedOn: string;
  generatedBy: string;
  format: "PDF" | "XLSX" | "CSV";
};

// Report application
type ReportApplication = {
  id: string;
  label: string;
  Icon: LucideIcon;
  description: string;
  reports: SavedReport[];
};
```

**All status values used across the platform**:

```
Pending for Approval
Pending for Screening
Pending for Supervisor Approval
Pending Documents Upload
Visa Filed
Awaiting Decision
Awaiting Clarification
Clarification Requested
Docs Submitted
Approved
Completed
```

---

## Business Workflows

### Supervisor Approval Workflow
1. Supervisor opens their dashboard — KPI cards show pending count.
2. "Things to Do" tab surfaces approval tasks sorted by urgency.
3. Supervisor clicks ChevronRight → navigates to `/case/$caseId`.
4. Reviews case detail, documents, and compensation info via Quick Links.
5. Approves or requests clarification.
6. On next page load the task disappears from the list; KPI count decrements.

### Case Manager Case Management Workflow
1. Case Manager views "All Cases" table, filters by country or status.
2. Clicks a case number → `/case/$caseId` for full record.
3. Uses Quick Links (Documents, Letters, Emails) to action items.
4. Navigates to Action Center (`/actions`) for SLA-sorted priority queue.
5. Sorts by SLA Low→High to surface most urgent cases first.

### Employee Self-Service Workflow
1. Employee lands on `/employee`.
2. Hero card shows active assignment progress bar and current status.
3. Request Progress section shows current and next milestones with dates.
4. Employee clicks "View Immigration Request" to review their case.
5. "Things to Do" prompts for any pending uploads or signatures.
6. "Ask Immibro" (floating) for instant answers to policy queries.

### SLA Management
- Each case carries an SLA value (days remaining).
- Action Center provides SLA-based quick-sort (High→Low / Low→High).
- Overdue items surface as urgent (red due date, red border on task card).
- SLA Performance dashboard in Reports tracks team-wide compliance.

### Clarification Loop
1. Case Manager raises a clarification request against a case.
2. Status updates to "Clarification Requested".
3. Supervisor / Employee receives item in "Clarifications" tab.
4. They respond via the case detail (`/case/$caseId` → Clarification quick link).
5. Status updates to "Clarification Responded".
6. Case Manager sees updated status in the All Cases table.

### New Assignment Request
1. User clicks "Create Request" → "International Assignment" or "Business Visa".
2. Lands on `/assignment-request` — Step 1: Initiation Questionnaire.
3. Fills in details, clicks "Next" → Step 2: Select Service Required.
4. Submits; a new case record is created and appears in the Case Manager table.

---

## Application Modules

The platform manages six mobility application types, each with its own badge colour, icon, and report namespace:

| Module | Abbreviation | Icon | Badge colour |
|---|---|---|---|
| Assignments | — | Briefcase | Brand blue |
| Immigration | — | Globe2 | Brand navy |
| Travel | — | Plane | Brand sky |
| Certificate of Coverage | COC | FileCheck | Emerald |
| Labor Condition Application | LCA | Scale | Violet |
| Invite Letter | — | Mail | Teal |

---

## Deployment

The project is configured for **Cloudflare Workers** via `wrangler.jsonc` and `@cloudflare/vite-plugin`.

```bash
# Preview production build locally
npm run build && npm run preview

# Deploy to Cloudflare
npm run deploy
```

Environment and secrets are managed through Cloudflare's `.dev.vars` file (local) and the Workers dashboard (production). The `.dev.vars` file is gitignored.
