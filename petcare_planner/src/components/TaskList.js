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
              borderRadius: 6,
              background: task.status === "done"
                ? "#263522"
                : task.status === "missed"
                ? "#452200"
                : "#242730",
              color: task.status === "missed"
                ? "#FF9800"
                : "var(--text-color)",
              padding: "10px 12px",
              opacity: task.status === "done" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>{task.description} <span style={{ color: "#888", fontSize: "0.93em" }}>({task.time})</span></span>
            <button
              className="btn"
              style={{
                background: task.status === "done"
                  ? "var(--kavia-orange)"
                  : "var(--kavia-dark)",
                fontSize: 12,
                padding: "4px 10px"
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
