# Immidart Dashboard — Functional Specification

> **Document type:** Product & functional behavior specification  
> **Audience:** Senior product managers, client stakeholders, solution architects  
> **Purpose:** Define *what the platform does* and *how capabilities adapt by user context* — for review, alignment, and scope discussion  
> **Status:** Interactive prototype (mock data; behaviors are designed but not yet backed by live APIs)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform Scope](#2-platform-scope)
3. [User Roles & Access Model](#3-user-roles--access-model)
4. [Dual-Role & Role-Applicability Model](#4-dual-role--role-applicability-model)
5. [Dynamic Dashboard Composition](#5-dynamic-dashboard-composition)
6. [Functional Capabilities by Persona](#6-functional-capabilities-by-persona)
7. [Application Modules](#7-application-modules)
8. [Core Workflows](#8-core-workflows)
9. [Cross-Cutting Capabilities](#9-cross-cutting-capabilities)
10. [Data & Case Model](#10-data--case-model)
11. [Prototype vs. Production Intent](#11-prototype-vs-production-intent)
12. [Discussion Points for Stakeholders](#12-discussion-points-for-stakeholders)

---

## 1. Executive Summary

**Immidart** (branded as **WorkAbroad** on the employee-lite experience) is a cross-border mobility platform that unifies international assignments, immigration filings, business travel, and related compliance services into a single employee and operations gateway.

The platform is designed around a key product principle: **users are not limited to a single persona**. A supervisor may simultaneously be on an international assignment. A case manager may need supervisor-style approvals on certain cases. The interface therefore **composes capabilities dynamically** — showing assignee-facing cards only when the user has an active assignment, supervisor widgets only when they manage a team, and so on.

This document captures those functional behaviors as implemented in the current prototype, organized for senior PM and client review sessions.

---

## 2. Platform Scope

### In scope (designed in prototype)

| Capability area | Description |
|-----------------|-------------|
| Role-based home experiences | Distinct landing dashboards for Case Manager, Supervisor, and Employee |
| Dual-role composition | Same user can see both team-management and personal-assignment surfaces |
| Case lifecycle visibility | Assignment journey tracking, child case hierarchy, status-driven actions |
| Task & action management | Things to do, Action Center, approvals, clarifications, urgency handling |
| Request initiation | International Assignment and Business Visa request wizard |
| Immigration operations | Screener queue metrics and operational filtering |
| Case workspace | Screening summary with approve/reject and submodule quick links |
| Reporting | Per-application saved report library with generate/download |
| Self-service tools | Visa Guide lookup, profile viewing, help resources |
| Search | Global case/employee search with drill-through to case detail |

### Out of scope / placeholder in prototype

| Item | Current state |
|------|---------------|
| Live API integration | All data is static mock content |
| Ask Immibro (AI assistant) | FAB present; no conversation backend |
| Knowledge Base, ServiceNow, Information Portal | Buttons/links present; no integration |
| Enterprise SSO / real auth | Demo login with role picker |
| Email notifications | Alerts are in-app only (mock) |
| Document upload processing | Upload actions are UI affordances only |

---

## 3. User Roles & Access Model

### Primary roles

| Role | Primary responsibility | Default landing (after login) |
|------|------------------------|-------------------------------|
| **Case Manager** | Owns and processes immigration/assignment cases end-to-end | `/` (Case Management Dashboard) |
| **Supervisor** | Approves team requests, provides clarifications, monitors reportee progress | `/supervisor` or `/supervisor2` |
| **Employee** | Completes personal assignment tasks, uploads documents, confirms travel | `/employee` or `/employee-lite` |

### Authentication behavior (prototype)

- User signs in with email, password, and **explicit role selection**.
- Selected role is stored client-side and determines the post-login redirect.
- Selected routes require authentication (`RequireAuth`): Case Manager home, Profile, Reports, Employee-lite.
- **No logout flow** is implemented yet; session persists until cleared manually.

### Intended production behavior (not yet built)

- Roles should be derived from **identity/HR data**, not chosen at login.
- A user may hold **multiple applicable roles** simultaneously (see Section 4).
- Route guards should evaluate **permissions per feature**, not a single role string.

---

## 4. Dual-Role & Role-Applicability Model

### Core concept

Real mobility programs frequently place people in **overlapping capacities**:

- A **supervisor** relocating abroad is still an **assignee** on their own case.
- An **employee** may occasionally **approve** travel or policy items.
- A **case manager** may appear as an action owner on cases they personally initiated.

The platform models this through **role applicability flags** (conceptual; to be supplied by backend):

| Applicability flag | Meaning | Drives visibility of |
|--------------------|---------|----------------------|
| `isAssignee` | User has at least one active personal assignment | "Your Assignment" card, assignment journey, personal task tabs, urgent assignee banner |
| `isSupervisor` | User has direct/indirect reportees with mobility cases | Team Cases table, team KPIs, supervisor todo tabs (Approvals / Clarifications) |
| `isCaseManager` | User owns operational case workload | Case volume KPIs, All Cases table, screening actions |
| `isDualRole` | User is both assignee and supervisor (or more) | Combined dashboard layout; contextual info tooltip |

### Supervisor Dashboard v2 (`/supervisor2`) — reference implementation

This page is the **clearest expression** of the dual-role model:

**Hero row (three columns, all role-applicable sections side by side):**

| Column | Applicability | Function |
|--------|---------------|----------|
| Team KPIs + Help | `isSupervisor` | Pending approvals, team members abroad, cases in progress, total assignments; drill-down to case lists |
| Things to do | `isSupervisor` | Supervisor-owned actions only: **Approvals** and **Clarifications** tabs (not "My tasks") |
| Your assignment | `isAssignee` | Full assignee journey card ported from Employee home — route, metadata, 5-step progress, current-step guidance |

**Contextual disclosure:** An info tooltip on Things to do states: *"You have access both as an Employee (Assignee) and Supervisor"* — signaling dual-role access without requiring the user to switch accounts.

**Supervisor Dashboard v1 (`/supervisor`) — alternate layout:**

- Uses a **compact** `MyAssignmentCard` banner at the top when the user is also an assignee (comment in code: *"only shown when user is also an assignee"*).
- Places team KPIs, Things to do, and Help in a three-column row below the assignment banner.
- v2 elevates the full assignment card to equal prominence in the hero row instead of a slim banner.

### Employee home (`/employee`) — assignee-primary with dual-role hint

- **Primary surface:** "Your assignment" with journey stepper, Things to do (**My tasks / Approvals / Clarifications** — three tabs, unlike supervisor's two).
- **Conditional urgent banner:** Shown only when an urgent task exists (*"only shown when there's an urgent task"*).
- **Dual-role tooltip:** Same info icon pattern — user may also have supervisor access.
- **Case listing:** Hierarchical view — assignments as parent records, WP/ATR child cases nested underneath.

### Action Center (`/actions`) — unified work queue

- **Team/work queue:** Filterable, sortable table of cases actioned across applications (All / Approvals / Clarifications).
- **Personal assignment section:** `MyAssignmentTasksSection` — collapsible block of assignee tasks (*"shown when logged-in user is also an assignee"*).
- **Personal todo list:** User can create todos, assign to colleagues via assignee picker, set due dates.
- Serves as the **single escalation point** linked from all dashboards ("View all" / Action Centre button).

### Role-applicable task taxonomy

Tasks are classified by **type** and filtered by **which tabs appear per persona**:

| Task type | Employee tab | Supervisor tab | Case Manager |
|-----------|--------------|----------------|--------------|
| `task` (general assignee action) | My tasks | — | Things to do (flat list) |
| `approval` | Approvals | Approvals | Things to do |
| `clarification` | Clarifications | Clarifications | Things to do |

Each task is also tagged with an **application module** (Assignments, Immigration, Travel, COC, LCA, Invite Letter) so users can identify which service line owns the work.

---

## 5. Dynamic Dashboard Composition

### Composition rules (intended production logic)

The prototype **renders all sections with mock data**. In production, the following rules should govern visibility:

| Section / Card | Show when | Hide when |
|----------------|-----------|-----------|
| Your Assignment (full card) | `isAssignee` && active assignment exists | No active assignment |
| MyAssignmentCard (compact banner) | `isAssignee` && active assignment exists | No active assignment |
| MyAssignmentTasksSection (Action Center) | `isAssignee` | Not an assignee |
| Urgent action banner (Employee) | Urgent task exists for user | No urgent tasks |
| Team KPI stat cards | `isSupervisor` | Not a supervisor |
| Team Cases table | `isSupervisor` | Not a supervisor |
| "Needs your sign-off" tab | `isSupervisor` && pending approvals exist | No pending sign-offs |
| Case Manager KPI grid (6 cards) | `isCaseManager` | Not a case manager |
| All Cases table with SLA tabs | `isCaseManager` | Not a case manager |
| Dual-role info tooltip | `isDualRole` (assignee + supervisor) | Single role only |
| Create Request button | User can initiate requests (typically employee or supervisor on behalf of team) | Policy restricts initiation |
| Reports button | User has reporting permissions | No report access |

### Dashboard layout variants (product options under review)

| Variant | Route | Layout intent |
|---------|-------|---------------|
| Supervisor v1 | `/supervisor` | Assignment as top banner; supervisor work in row below |
| Supervisor v2 | `/supervisor2` | Assignment as equal hero column alongside supervisor KPIs and todos |
| Employee full | `/employee` | Two-column hero: assignment + todos; case hierarchy below |
| Employee lite | `/employee-lite` | Marketing-style gateway for users who only need to start a request |
| Case Manager | `/` | KPI grid + todos; no personal assignment (unless dual-role flag set) |

**Discussion for PMs:** Which supervisor layout should be the default when `isAssignee && isSupervisor`? v2 treats both contexts as first-class; v1 de-emphasizes assignment to a banner.

### KPI drill-down behavior

Clicking a KPI stat card opens a **filtered case list** in a side panel. The list is scoped to the metric label (e.g., "Pending Approvals", "Overdue actions"). Users can search within the drill-down and navigate to individual case detail.

---

## 6. Functional Capabilities by Persona

### 6.1 Case Manager

**Purpose:** Operational command center for case throughput, SLA risk, and owned actions.

| Capability | Behavior |
|------------|----------|
| Volume KPIs | Six metrics: overdue actions, SLA breaches, weekly approvals, pending cases by module (Immigration, Assignments, Travel) |
| Things to do | Personal action queue — screening, paperwork generation, document clearance; each item links to case |
| Application quick links | Six modules; Immigration links to operations dashboard |
| All Cases | Tabbed table: Ongoing / Nearing SLA / Pending approval; sortable columns; filter popover |
| Global search | Header search submits to `/search?q=` |
| Create Request | Initiate International Assignment or Business Visa |
| Reports | Access saved reports hub |
| Action Centre | Badge-counted link to unified work queue |

### 6.2 Supervisor

**Purpose:** Team oversight, sign-off authority, and — when applicable — personal assignee progress.

| Capability | Behavior |
|------------|----------|
| Team KPIs | Pending approvals, team members abroad, cases in progress, total team assignments |
| Things to do | Approvals + Clarifications only; tasks reference reportee name and case |
| Your assignment | Full journey card when user is also assignee (v2) or compact banner (v1) |
| Team Cases | All team cases vs. "Needs your sign-off" filtered view; search and country filter |
| Create Request | Labeled for initiating on behalf of team member |
| Alerts | In-app notification feed: visa decisions, expiring documents, overdue approvals, new team cases |
| Applications strip | Quick navigation to Assignments, Immigration, Travel, Coverage modules |

### 6.3 Employee (Assignee)

**Purpose:** Self-service progress on own mobility journey.

| Capability | Behavior |
|------------|----------|
| Urgent banner | Surfaces highest-priority blocking action with due date |
| Your assignment | Route visualization, assignment metadata, 5-step journey with current-step callout |
| Things to do | My tasks / Approvals / Clarifications — employee completes or responds |
| Applications | Module cards with descriptions |
| Case listing | Expandable assignment → child case hierarchy; client-side search |
| Documents | Referenced in data model (passport, offer letter, visa docs, etc.) |
| Alerts | Actionable notifications with inline action buttons (Upload, Confirm) |
| Create Request | Start new mobility request from assignment card header |

### 6.4 Employee Lite

**Purpose:** Simplified entry for organizations wanting a lightweight self-service portal.

| Capability | Behavior |
|------------|----------|
| WorkAbroad positioning | Single gateway messaging for visa, travel, and assignment services |
| Create Request | Primary CTA |
| Quick actions | Ask Immibro, Visa Guide (linked), Knowledge Base, ServiceNow (placeholders) |
| Profile verification prompt | Reminds user to verify profile before proceeding |

---

## 7. Application Modules

Six service lines are modeled consistently across tasks, quick links, and reports:

| Module | Typical cases | Report examples |
|--------|---------------|-----------------|
| **Assignments** | International transfers, relocation packages | Active assignments, cost summary, headcount by destination |
| **Immigration** | Work permits, visa filings | Visa filings, SLA breach tracker, approvals by country |
| **Travel** | Business trips, short-term authorization | Travel requests, upcoming trips |
| **COC** | Certificate of coverage | Issuance and renewal (no saved reports in mock) |
| **LCA** | Labor condition applications | Quarterly filing reports |
| **Invite Letter** | Invitation letter requests | Issued letters, turnaround by country |

**Functional rule:** Every task, alert, and report is **tagged to exactly one module** so users can filter and prioritize without opening the case.

---

## 8. Core Workflows

### 8.1 Assignment request initiation

**Entry points:** Create Request button (header or assignment card) → `/assignment-request`

| Step | User action | System behavior (intended) |
|------|-------------|----------------------------|
| 1 — Initiation Questionnaire | Enter employee details, countries, policy, dates | Validate required fields; pre-fill from HR profile where available |
| 2 — Select Service | Choose required mobility services | Determine downstream case types (WP, ATR, etc.) |
| Submit | Confirm and submit | Create parent assignment + child cases; route to case manager queue |

Request types supported in UI: **International Assignment**, **Business Visa**.

### 8.2 Assignment journey (assignee-facing)

Five standard stages displayed on employee and supervisor-v2 dashboards:

```
Initiated → Documents → Filing → Decision → Active
```

| Behavior | Detail |
|----------|--------|
| Progress visualization | Completed steps marked done; current step highlighted with guidance text |
| Step callout | Explains what the assignee must do now (e.g., "Upload required documents") |
| Deep link | "View full details" navigates to case workspace |

**Supervisor v1** uses a 7-step variant in `MyAssignmentCard` (different granularity — discussion point for alignment).

### 8.3 Case screening & approval

**Entry:** Any case link → `/case/:caseId`

| Capability | Behavior |
|------------|----------|
| Module tab navigation | Horizontal tabs per case submodule (Screening, Approvals, Visa Processing, etc.) |
| Summary card | Collapsible; persists collapse preference per case in browser storage |
| Screening actions | Approve / Reject on pending screening status |
| Quick links | 15 submodule entry points (Documents, Letters, Salary, Clarification, Progress Tracker, etc.) |
| Case metadata | Route flags, dates, deployment model, initiator, visa type |

### 8.4 Supervisor sign-off workflow

| Trigger | Supervisor action | Outcome (intended) |
|---------|-------------------|-------------------|
| Letter of Assignment pending | Sign off | Unblocks assignment processing for reportee |
| Visa filing ready | Approve | Case manager proceeds with filing |
| Extension request | Provide clarification | Case manager receives response and continues |
| Reporting structure change | Confirm | HR/onboarding finalized |

Filtered via **"Needs your sign-off"** tab on Team Cases and **Approvals** tab on Things to do.

### 8.5 Action Center operations

| Feature | Behavior |
|---------|----------|
| Cases actioned summary | Count for selectable period (week / month / 6 months / year / lifetime) |
| Quick filters | By application module; SLA sort |
| Advance filter | Country, request type, visa type, travel date ranges; save named filter presets |
| Saved filters | Bookmark, apply, delete custom searches |
| Tabbed case table | All / Approvals / Clarifications with pagination and column sort |
| Personal todos | Create task, assign to team member, set due date, mark complete |
| Personal assignment tasks | Collapsible section when user is assignee |

### 8.6 Reporting

| Step | Behavior |
|------|----------|
| Select application | `/reports` shows six module cards with saved report counts |
| View reports | `/reports/:appId` lists saved reports with format (PDF/XLSX/CSV) |
| Generate | Dialog: name + format selection |
| Manage | View, download, delete saved reports |

### 8.7 Visa Guide (self-service lookup)

Three searchable selectors: **From country**, **To country**, **Visa type**. Intended to return policy guidance without opening a case (backend not wired).

### 8.8 Global search

`/search?q=` filters cases by query string (name, case ID, route). Results link to case detail.

---

## 9. Cross-Cutting Capabilities

### Action Centre (global entry)

- Accessible from all primary dashboards via header button with **badge count** (pending actions).
- Centralizes work that would otherwise be scattered across role-specific todos.

### Alerts

- Supervisor and Employee dashboards expose an **Alerts** panel (side sheet).
- Alert types: visa decisions, document expiry, overdue approvals, new team cases, travel updates.
- Employee alerts include **inline action buttons** (Upload, Confirm).

### Ask Immibro

- Persistent floating action button on main dashboards.
- Intended as AI mobility assistant; **not functionally connected** in prototype.

### Profile

- Seven information categories: Organization, Personal, Address, Qualification, Passport, Immigration, Experience.
- Referenced before request initiation on Employee-lite ("verify your profile").

### Help & Resources

- Information Portal, Get Support, Mobility Resources, Knowledge Base.
- Visa Guide is the only linked help tool in prototype.

---

## 10. Data & Case Model

### Hierarchy

```
Assignment (parent — e.g., ASN-2026-0142)
  └── Child cases
        ├── WP (Work Permit) — e.g., WP1039203903
        └── ATR (Authorization to Travel) — e.g., ATR5556667777
```

**Functional implication:** Employees see assignments first; operational users work at child case level. Supervisors see **team member** names on cases; employees see **own** cases only.

### Case identifiers

Case numbers encode type prefix (IWA, WP, ATR, WI, etc.) for quick recognition in tables and search.

### Status-driven UI

Status values drive:

- Color-coded status pills in tables
- Tab filtering ("Pending for Approval", "Nearing SLA")
- Approve/Reject availability on screening summary
- Urgency styling on tasks (red border, urgent label, red CTA)

### Task urgency rules (prototype)

- Tasks flagged `urgent: true` appear with red styling and prioritized CTA.
- Employee home shows top urgent task in a full-width banner when present.

---

## 11. Prototype vs. Production Intent

| Area | Prototype today | Production intent |
|------|-----------------|-------------------|
| Role detection | User picks role at login | Derived from HR/identity; multiple roles per user |
| Dynamic cards | Always shown with mock data | Gated by `isAssignee`, `isSupervisor`, etc. |
| Dual-role tooltip | Static on supervisor/employee pages | Shown when `isDualRole` from API |
| KPI values | Hardcoded | Real-time from case/SLA engines |
| Filter application | UI only on some dashboards | All filters query backend |
| Auth | localStorage role string | SSO + permission service |
| Create Request submit | UI stepper only | Creates cases, sends notifications |
| Approve/Reject | Buttons present | Workflow state transitions + audit trail |
| Reports | Client-side seed data | Generated from reporting service |
| Assignee picker | Static user list | Org hierarchy + workload visibility |

---

## 12. Discussion Points for Stakeholders

The following items are **deliberately open** for PM and client sessions:

### Dual-role & layout

1. **Default supervisor experience:** Should assignee context use the compact banner (v1) or full hero card (v2) when both roles apply?
2. **Single home vs. role switcher:** Should dual-role users land on one composed dashboard, or choose "View as Supervisor" / "View as Assignee"?
3. **Case Manager + assignee:** Should case managers who are personally relocating see assignment cards on `/`, or only on Action Center?

### Role applicability rules

4. What HR/identity attributes determine `isAssignee`, `isSupervisor`, `isCaseManager`?
5. Can a user be a supervisor for Module A (Assignments) but only an assignee for Module B (Travel)?
6. Should module-level applicability drive which application quick links appear?

### Task & workflow

7. Should supervisors ever see a "My tasks" tab (employee-style document uploads), or always route assignee work to the Employee/assignment surfaces?
8. What is the canonical assignment journey — 5 steps (employee/v2) or 7 steps (MyAssignmentCard v1)?
9. Who can initiate requests on behalf of others — supervisor only, or also case managers?

### Action Center

10. Is Action Center the **system of record** for all todos, or a filtered view of module-specific queues?
11. Should personal todos sync with external task systems (ServiceNow, Outlook)?
12. Should saved filters be personal, team-shared, or org-wide?

### Employee experience tiers

13. When should users get **Employee full** vs. **Employee lite** — by policy, by assignment complexity, or by user preference?
14. Is profile verification a **hard gate** before request submission?

### Reporting & compliance

15. Which report types are must-have at go-live per module?
16. Are report generation permissions tied to role, OU, or data scope?

### Alerts & notifications

17. Which alert types require email/push in addition to in-app?
18. Can users configure alert preferences by module or urgency?

---

## Appendix A — Route-to-Capability Map

| Route | Primary persona | Key functions |
|-------|-----------------|---------------|
| `/login` | All | Authenticate; role-based redirect |
| `/` | Case Manager | KPIs, todos, all cases, search, reports |
| `/supervisor` | Supervisor (+ assignee banner) | Team KPIs, todos, team cases, alerts |
| `/supervisor2` | Supervisor + assignee | Composed hero: KPIs, todos, full assignment card |
| `/employee` | Employee (+ dual-role hint) | Assignment journey, todos, case hierarchy, alerts |
| `/employee-lite` | Employee (simplified) | WorkAbroad gateway, create request |
| `/actions` | All operational roles | Work queue, filters, personal todos, assignee tasks |
| `/case/:caseId` | Case Manager, Supervisor | Screening, approve/reject, submodule links |
| `/immigration` | Case Manager / Ops | Screener queue, clarifications, allocated cases |
| `/assignment-request` | Employee, Supervisor | Two-step request wizard |
| `/visa-guide` | Employee | Country/visa lookup |
| `/search` | All | Global case search |
| `/profile` | All authenticated | HR/profile data viewing |
| `/reports` | Case Manager (+ authorized) | Report module picker |
| `/reports/:appId` | Case Manager (+ authorized) | Saved reports per module |

---

## Appendix B — Glossary

| Term | Definition |
|------|------------|
| **Assignee** | Employee who is the subject of a mobility case (relocating or traveling) |
| **Applicability** | Whether a UI capability applies to the current user based on their roles and active cases |
| **Assignment** | Parent mobility record encompassing one or more child cases |
| **Child case** | Operational record (WP, ATR, etc.) filed under an assignment |
| **Clarification** | Request for additional information before a case can proceed |
| **Dual-role** | User holding both assignee and supervisor (or other) capacities simultaneously |
| **Module** | One of six service lines: Assignments, Immigration, Travel, COC, LCA, Invite Letter |
| **Sign-off** | Supervisor approval required to unblock a reportee's case |
| **Things to do** | Role-scoped prioritized action list on home dashboards |
| **WorkAbroad** | Employee-facing program name used on the lite experience |

---

*This document should be updated as API contracts, permission models, and layout decisions are finalized with client stakeholders.*
