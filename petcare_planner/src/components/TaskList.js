import React from "react";

// PUBLIC_INTERFACE
/**
 * TaskList displays scheduled care tasks for a pet or all pets.
 * @param {Object} props - { tasks: Array, onToggleStatus: func }
 */
function TaskList({ tasks = [], onToggleStatus }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 14px 0" }}>Today's Tasks</h3>
      {tasks.length === 0 && (
        <div style={{ color: "var(--text-secondary)" }}>No tasks scheduled.</div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: 12,
              borderRadius: 8,
              background:
                task.status === "done"
                  ? "rgba(76,175,80,0.18)"
                  : task.status === "missed"
                  ? "rgba(255,152,0,0.15)"
                  : "var(--background-card)",
              border:
                task.status === "missed"
                  ? "1px solid var(--accent)"
                  : task.status === "done"
                  ? "1px solid var(--primary)"
                  : "1px solid var(--border-color)",
              color:
                task.status === "missed"
                  ? "var(--accent)"
                  : task.status === "done"
                  ? "var(--primary)"
                  : "var(--text-color)",
              padding: "10px 14px",
              opacity: task.status === "done" ? 0.65 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>
              {task.description}{" "}
              <span style={{ color: "var(--text-secondary)", fontSize: "0.93em" }}>
                ({task.time})
              </span>
            </span>
            <button
              className="btn"
              style={{
                background:
                  task.status === "done"
                    ? "var(--background-mid)"
                    : "var(--primary)",
                color: task.status === "done" ? "var(--text-secondary)" : "#fff",
                fontSize: 12,
                padding: "4px 10px",
                minWidth: 88
              }}
              onClick={() => onToggleStatus && onToggleStatus(task.id)}
            >
              {task.status === "done" ? "Mark Pending" : "Mark Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
