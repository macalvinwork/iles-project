# Internship Logging and Evaluation System (ILES)
## Screens, Login Flow & Frontend Notes

### Screens
**Login Page (All Roles):** Email, password, role-based redirect.

**Student Screens:**
- Student Dashboard – Placement info, logs, final score.
- Create/Edit Log – Form with save/submit functionality.
- Log Detail – View log, feedback, and resubmit.

**Workplace Supervisor Screens:**
- Supervisor Dashboard – Intern list, pending reviews.
- Log Review Page – Approve/return logs with comments.
- Log History Page – Timeline of changes.

**Academic Supervisor Screens:**
- Academic Dashboard – Student list.
- Student Logs View – Read-only logs.
- Evaluation Form – Score input with auto total.

### Login Flow
1. User logs in.
2. System checks role.
3. User is redirected to the appropriate dashboard:
   - Student Dashboard
   - Supervisor Dashboard
   - Academic Dashboard
   - Admin Dashboard

### Frontend Notes
- All data must come from the backend API.
- Do **NOT** implement business logic in the frontend.
- Use **React Router** for navigation.
- Protect routes (redirect unauthenticated users).
- Display submission deadlines clearly.
- Disable submission after deadline.
- Show score formula as preview (backend computes final).
- Use **color-coded status badges**: Draft, Submitted, Reviewed, Approved.

