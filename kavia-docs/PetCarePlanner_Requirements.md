# PetCare Planner – Main Container Requirements

## Overview

The PetCare Planner is a React-based web application designed to help users manage the daily care and long-term health of multiple pets. The application combines the scheduling of recurring care tasks, a health event log, profile management for pets, and timely reminders—all within a modern, visually cohesive dark-themed interface.

This requirements document provides a comprehensive outline of the functional features, user interface and experience expectations, data modeling and persistence, state management approach, critical user workflows, and explicit constraints or limitations for the main container and base structure of the application. It is intended for both stakeholders and development teams to ensure a clear, mutual understanding of the project scope.

---

## Functional Requirements

### 1. Pet Profile Management
- Users can add, edit, and delete multiple pet profiles.
- Each pet profile includes: Name, Species/Breed, Birthdate or Age, Photo/Avatar, Optional notes.
- Profiles are visually selectable, with active selection impacting dashboard, scheduling, and logs.

### 2. Recurring Task Scheduling
- Users can create recurring daily/weekly tasks for a specific pet (e.g., feeding, walks, medication).
- Tasks can be set with specific times.
- Ability to edit or remove tasks.
- Option to view all upcoming tasks for all pets, or filter by specific pet.

### 3. Daily Task Dashboard
- The main screen presents a dashboard listing today’s scheduled tasks, grouped or filtered by pet and time.
- Completed tasks can be marked as done.
- "Missed" or "upcoming" tasks are visually distinct.
- Urgent upcoming tasks are highlighted.

### 4. Health Event Logging
- Users can log health-related events for any pet (e.g., vaccinations, vet visits, medication doses).
- Each event includes event type, date/time, notes, and (if feasible) supporting attachments.
- Health logs are displayed in a timeline format for each pet.

### 5. Reminders & Notifications
- The app provides reminders for scheduled tasks and important events.
- Reminders appear as non-intrusive notification banners and as dashboard highlights.
- As a web-only app, notifications are limited to in-app displays (no push or OS-level notifications).

---

## UI/UX Expectations

- **Branding & Theme**: The interface uses a dark mode as default. Core palette: primary color #4CAF50 (accent elements), secondary color #FFFFFF (text/UI), accent #FF9800 (calls to action, highlights). KAVIA branding is respected via logo and color application.
- **Navigation**: Persistent top navigation bar with branding and quick access to pet profiles or settings.
- **Layout**: Central dashboard with modular sections—main area for the task list/log, sidebar or horizontal tabs for pet profiles, buttons for actions.
- **Component Philosophy**: All UI is built from custom React components (no external UI frameworks). Buttons, lists, modals, forms, and calendars are all handcrafted for consistency and clarity.
- **Responsiveness**: Design is mobile-friendly, rendering well on phones, tablets, and desktops.
- **Accessibility**: Sufficient color contrast, focus outlines, and keyboard navigation are provided.

---

## Data Modeling

### Pet Profile Object
- `id: string`
- `name: string`
- `species: string`
- `breed?: string`
- `birthDate?: string`
- `photoUrl?: string`
- `notes?: string`

### Task Object
- `id: string`
- `petId: string`
- `description: string`
- `time: string` (e.g., "08:00", 24h)
- `recurrence: string` ("daily", "weekly", etc.)
- `status: string` ("pending", "done", "missed")

### Health Event Object
- `id: string`
- `petId: string`
- `eventType: string` ("vet visit", "vaccination", etc.)
- `date: string`
- `notes?: string`
- `attachmentUrl?: string`

### Reminder Object
- `id: string`
- `type: string` ("task", "healthEvent")
- `forId: string` (relates to either a Task or Health Event)
- `datetime: string`
- `dismissed: boolean`

---

## State Management

- State relating to pets, tasks, logs, and reminders is centrally managed via [React Context](https://react.dev/reference/react/createContext) and/or component state.
- Persistence (for reloads and offline use) is achieved using browser `localStorage`. All CRUD operations must reflect both in-memory state and persistent storage.
- UI theme and user preferences should also be stored in localStorage as appropriate.
- No backend: all state and data are local to the end-user’s browser.
- Modular state providers are encouraged (e.g., `PetProvider`, `TaskProvider`).

---

## Critical User Workflows

### Add a New Pet
1. User clicks “Add Pet” in the profile sidebar/tab.
2. User fills out the form (required: name, species).
3. Optional: Add photo and notes.
4. User saves; new profile is accessible and impacts dashboard/tasks.

### Schedule a Recurring Task
1. User selects a pet profile.
2. User adds a “new task,” specifying action, recurrence, and time.
3. Task appears on the dashboard for the chosen days/times per pet.

### Log a Health Event
1. User selects pet, navigates to health log/timeline.
2. User adds a health event with description, date/time, (optionally notes or attachments).
3. Log entry appears in pet’s health timeline.

### Complete and Acknowledge Tasks
1. Dashboard shows today’s tasks.
2. User marks tasks as completed; task status updates and is de-emphasized in UI.
3. Missed or overdue tasks remain highlighted for action.

### Dismiss or Acknowledge Reminders
1. Upcoming task/health event reminders are shown visually (banner/notification/pill).
2. User dismisses or acknowledges; reminder is marked as such in state.

---

## Constraints & Limitations

- The application is a browser-only (“frontend-only”) solution. There is no server storage or backend API.
- All data resides in browser localStorage. Clearing browser storage deletes user data.
- No external component libraries (e.g., Material UI, Ant Design) are permitted for UI structure or widgets.
- All core UI/UX elements should be handcrafted, using the conventions in `App.css` as references for style and theme.
- Real-time and background notifications are limited to in-app display; no integration with OS, mobile push, or SMS/email alerts.
- Photo uploads for pet profiles and attachments for health logs may be stored as base64 within localStorage for simplicity, size permitting.
- Theming and color adjustments should reference and extend `:root` variables in `App.css`.
- App is designed for rapid iteration, so clean modular code is favored over premature optimization.

---

## References & Information Sources

- React entry and main container logic: [`src/App.js`](../petcare_planner/src/App.js), [`src/index.js`](../petcare_planner/src/index.js)
- Application theme and CSS variables: [`src/App.css`](../petcare_planner/src/App.css)
- Project and UI context: [README.md](../petcare_planner/README.md)

---

## Future Considerations (Out of Scope)

- Multi-user, cloud, or backend sync.
- Real push/browser/os notifications.
- Integration with other calendar or reminder services.
- Analytics and data export.

---

_Last updated: YYYY-MM-DD_
