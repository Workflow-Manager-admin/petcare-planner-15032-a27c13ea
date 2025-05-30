import React, { useMemo } from "react";
import { usePets } from "../contexts/PetContext";
import { useTasks } from "../contexts/TaskContext";
import HealthLog from "./HealthLog";
import Reminder from "./Reminder";

/**
 * Returns today's date in YYYY-MM-DD string (local).
 */
function todayYMD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * Quick-action button for accessibility and theme.
 */
function QuickActionButton({ title, icon, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      className="btn btn-small"
      title={title}
      aria-label={ariaLabel || title}
      onClick={onClick}
      style={{
        background: "var(--kavia-orange)",
        color: "#fff",
        margin: "0 2px",
        borderRadius: 4,
        border: "none",
        cursor: "pointer",
        minWidth: 32,
        minHeight: 28
      }}
    >
      {icon}
    </button>
  );
}

/**
 * NEW DailyTaskDashboard - Shows today's scheduled tasks for ALL pets, grouped by pet, sortable by time.
 * Allows marking done, editing, adding with accessible controls. Uses theme and context data.
 *
 * @param {Object} props
 *  - reminders: array of reminders (optional)
 *  - onDismissReminder: fn(reminderId) (optional)
 *  - showHealthLog: bool (if true, show side health log panel)
 */
// PUBLIC_INTERFACE
function DailyTaskDashboard({ reminders = [], onDismissReminder, showHealthLog = true }) {
  // Get all pets/tasks from context
  const { pets } = usePets();
  const { tasks, updateTask, addTask } = useTasks();

  // Gather today's tasks, group by petId, and sort by time
  const todayStr = todayYMD();
  const todayTasksByPet = useMemo(() => {
    // Only tasks scheduled for today
    const tasksToday = tasks.filter(
      t =>
        (!t.date || t.date === todayStr) // If no date, treat as due today (for recurring tasks)
    );
    // Group by petId
    const byPet = {};
    for (const t of tasksToday) {
      if (!byPet[t.petId]) byPet[t.petId] = [];
      byPet[t.petId].push(t);
    }
    // Sort within each group by time (assume t.time is 'HH:MM', missing time is last)
    for (const petId in byPet) {
      byPet[petId].sort((a, b) => {
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (!a.time && b.time) return 1;
        if (a.time && !b.time) return -1;
        return 0;
      });
    }
    return byPet;
  }, [tasks, todayStr]);

  // Handler to mark task as done/pending
  const handleToggleTask = (task) => {
    updateTask(task.id, {
      status: task.status === "done" ? "pending" : "done",
    });
  };

  // Handler for add (demo only)
  const handleAddTask = (petId) => {
    // This is a simple direct-logic for demo. To replace with modal/form.
    const desc = window.prompt("Enter new task for this pet:");
    if (!desc) return;
    addTask({
      id: String(Date.now()) + Math.random(),
      petId,
      desc,
      date: todayStr,
      status: "pending",
    });
  };

  // Handler for edit (demo only)
  const handleEditTask = (task) => {
    // Simplest version: just edit text/desc
    const desc = window.prompt("Edit task description:", task.desc);
    if (!desc) return;
    updateTask(task.id, { desc });
  };

  // For focus management
  const getPetLabelId = (petId) => `pet-section-title-${petId}`;

  return (
    <section
      style={{
        padding: "28px 0",
        color: "var(--text-color)"
      }}
      aria-label="Daily Task Dashboard"
    >
      <h2 style={{ margin: 0, marginBottom: 14, fontWeight: 600 }}>Daily Task Dashboard</h2>

      {/* Reminders for today */}
      {reminders?.filter((r) => !r.dismissed).map(reminder =>
        <Reminder key={reminder.id} reminder={reminder} onDismiss={onDismissReminder} />
      )}

      <div style={{
        display: "flex",
        gap: "44px",
        marginTop: 10,
        alignItems: "flex-start",
        flexWrap: "wrap",
        background: "var(--kavia-dark)"
      }}>
        <div style={{ flex: 3, minWidth: 290, maxWidth: 570 }}>
          {pets.length === 0 && (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              color: "var(--text-secondary)",
              fontStyle: "italic", padding: 36, borderRadius: 20, border: "1px dashed var(--border-color)"
            }}>
              No pets yet. Add a pet to get started!
            </div>
          )}
          {pets.map((pet) => (
            <section
              key={pet.id}
              aria-labelledby={getPetLabelId(pet.id)}
              style={{
                marginBottom: 32,
                background: "rgba(32,32,40,0.6)",
                borderRadius: 14,
                padding: "14px 18px",
                boxShadow: "0 1px 8px 0 rgba(0,0,0,0.06)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 8
              }}>
                <span
                  id={getPetLabelId(pet.id)}
                  style={{
                    fontWeight: 700,
                    fontSize: 18, letterSpacing: 0.2,
                    display: "inline-block"
                  }}>
                  {/* Pet's name, with animal emoji if provided */}
                  {pet.photo
                    ? <img src={pet.photo} alt="" aria-hidden="true" style={{ width: 28, height: 28, marginRight: 7, borderRadius: "100%" }}/>
                    : <span role="img" aria-label="pet" style={{ marginRight: 7 }}>🐾</span>
                  }
                  {pet.name || "Unnamed Pet"}
                </span>
                <QuickActionButton
                  title="Add task"
                  icon={<span aria-hidden="true">＋</span>}
                  onClick={() => handleAddTask(pet.id)}
                  ariaLabel={`Add task for ${pet.name || "pet"}`}
                />
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 0,
                  listStyle: "none"
                }}
                aria-labelledby={getPetLabelId(pet.id)}
              >
                {(todayTasksByPet[pet.id] || []).length === 0 && (
                  <li style={{
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                    fontSize: 14,
                    margin: "9px 0 5px 0"
                  }}>
                    No tasks scheduled for today.
                  </li>
                )}
                {(todayTasksByPet[pet.id] || []).map((task) => (
                  <li
                    key={task.id}
                    tabIndex={0}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      outline: "none"
                    }}
                    aria-label={`Task: ${task.desc}${task.status === "done" ? ", completed" : ""}${task.time ? ", at " + task.time : ""}`}
                    onKeyDown={(e) => {
                      // Space/Enter marks as done
                      if ([" ", "Enter"].includes(e.key)) handleToggleTask(task);
                    }}
                  >
                    <QuickActionButton
                      title={task.status === "done" ? "Mark as pending" : "Mark as done"}
                      icon={task.status === "done" ? <span aria-hidden="true">✔️</span> : <span aria-hidden="true">○</span>}
                      onClick={() => handleToggleTask(task)}
                      ariaLabel={`Mark as ${task.status === "done" ? "pending" : "done"}: ${task.desc}`}
                    />
                    <span
                      style={{
                        textDecoration: task.status === "done" ? "line-through" : "none",
                        opacity: task.status === "done" ? 0.75 : 1,
                        color: task.status === "done" ? "var(--text-secondary)" : "#fff",
                        fontSize: 16,
                        marginLeft: 9, marginRight: 7,
                        flex: 1
                      }}
                    >
                      {task.time &&
                        <span style={{
                          display: "inline-block", fontWeight: 600, fontSize: 14,
                          color: "#d8b68f", background: "rgba(255,152,0,0.14)",
                          borderRadius: 6, padding: "1px 10px 1px 6px",
                          marginRight: 8
                        }}>
                          <span aria-hidden="true" role="img" style={{ marginRight: 3 }}>⏰</span>
                          {task.time}
                        </span>
                      }
                      {task.desc}
                    </span>
                    <QuickActionButton
                      title="Edit task"
                      icon={<span aria-hidden="true" role="img">✎</span>}
                      onClick={() => handleEditTask(task)}
                      ariaLabel={`Edit task: ${task.desc}`}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {showHealthLog &&
          <div style={{ flex: 2, minWidth: 210, marginTop: 10 }}>
            <HealthLog />
          </div>
        }
      </div>
    </section>
  );
}

export default DailyTaskDashboard;
