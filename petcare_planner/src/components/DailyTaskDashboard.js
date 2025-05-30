import React from "react";
import TaskList from "./TaskList";
import HealthLog from "./HealthLog";
import Reminder from "./Reminder";

/**
 * DailyTaskDashboard - Shows today's scheduled tasks, reminders, and health log snippets.
 * @param {Object} props
 *  - tasks: today's tasks for the active pet or all pets
 *  - events: recent health events for active pet
 *  - reminders: in-app reminders array
 *  - onToggleStatus, onDismissReminder passed down for interactions
 */
 // PUBLIC_INTERFACE
function DailyTaskDashboard({ tasks = [], events = [], reminders = [], onToggleStatus, onDismissReminder }) {
  return (
    <section style={{ padding: "28px 0" }}>
      <h2 style={{ margin: 0, marginBottom: 14, fontWeight: 600 }}>Daily Dashboard</h2>
      {reminders?.filter((r) => !r.dismissed).map(reminder =>
        <Reminder key={reminder.id} reminder={reminder} onDismiss={onDismissReminder}/>
      )}
      <div style={{ display: "flex", gap: "36px", marginTop: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 3, minWidth: 240, maxWidth: 400 }}>
          <TaskList tasks={tasks} onToggleStatus={onToggleStatus} />
        </div>
        <div style={{ flex: 2, minWidth: 180 }}>
          <HealthLog events={events} />
        </div>
      </div>
    </section>
  );
}

export default DailyTaskDashboard;
