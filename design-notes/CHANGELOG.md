# Immidart Design Changelog

## [2026-06-30] Case detail page — Case Manager
**Files:** src/routes/case.$caseId.tsx
**Changed:** Full redesign based on wireframe. Replaced horizontal nav tabs + collapsible summary card with: (1) compact summary header (name, flags, travel route, dates, host entity, status, Approve/Reject buttons, "View more" link); (2) three-column layout — left vertical sidebar (11 tabs), center content panel with real dummy content for Questionnaire/Documents/Visa Info/Work Permit/Salary/LOA tabs, right panel with Notifications, Milestones (previous+current with actions), and action button card (Case Logs / Clarifications / Emails). All right-side overlays use Sheet components sliding in from the right.
**Why:** Wireframe called for left-nav + right-sidebar IA; old flat tab bar and collapsible card didn't match the design direction.
**Deferred:** Support Letter, Case Kit, Resident Permit, COC, Posted Worker Notification tabs show a generic placeholder — real forms pending module spec. Approve/Reject are non-functional (no confirmation dialog or API call yet).

## [2026-06-30] Supervisor Dashboard — Active Assignment (Host Country) — Supervisor
**Files:** src/routes/supervisor5.tsx
**Changed:** New page replicating supervisor3 but with a completely redesigned "Your Immigration Request" card. Removed the India→US flight progress bar (pre-travel state) and replaced it with: (1) host-country location banner with flag, city, "Currently working here" label; (2) assignment duration progress bar (days elapsed / total, days remaining counter, start/end dates); (3) meta grid showing permit type, permit expiry, permit number, host entity; (4) "Active" status pill; (5) "View Work Permit" and "Request Extension" action buttons. Added a right column with upcoming compliance actions (quarterly check-in due today, US address registration, ITIN deadline, permit renewal window) and a 2×2 quick contacts grid (Local HR, Immigration Attorney, Emergency Line, Housing Support).
**Why:** Supervisor3 models the "in transit / pre-arrival" state; supervisor5 models the "actively working in host country" state — a distinct persona moment that needs different data and CTAs.
**Deferred:** Request Extension and quick-contact buttons are non-functional; compliance actions are static dummy data (no API hookup yet).
