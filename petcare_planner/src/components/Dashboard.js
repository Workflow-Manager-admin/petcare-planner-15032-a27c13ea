import React from "react";
import TaskList from "./TaskList";
import HealthLog from "./HealthLog";
import Reminder from "./Reminder";

// PUBLIC_INTERFACE
/**
 * Dashboard integrates today's tasks, reminders, and health log summary.
 * @param {Object} props - { tasks, events, reminders }
 */
function Dashboard({ tasks, events, reminders, onToggleStatus, onDismissReminder }) {
  return (
    <section style={{ padding: "30px 32px 24px", flex: 1 }}>
      <h2 style={{ fontWeight: "600", marginTop: 0, marginBottom: "8px" }}>PetCare Dashboard</h2>
      {reminders
        ?.filter((rem) => !rem.dismissed)
        .map((reminder) => (
          <Reminder key={reminder.id} reminder={reminder} onDismiss={onDismissReminder} />
        ))}
      <div style={{ display: "flex", gap: "44px", marginTop: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 3, minWidth: 260, maxWidth: 420 }}>
          <TaskList tasks={tasks} onToggleStatus={onToggleStatus} />
        </div>
        <div style={{ flex: 2, minWidth: 200 }}>
          <HealthLog events={events} />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
