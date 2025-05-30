import React from "react";

/**
 * RecurringTasks - Schedules, lists, and edits recurring tasks for a specific pet.
 * @param {Object} props
 *  - tasks: Array of recurring task objects for pet
 *  - onCreate: function to create new recurring task
 *  - onEdit: function to edit a recurring task
 *  - onDelete: function to delete a recurring task
 *  - onToggle: function to mark done/pending/missed
 */
 // PUBLIC_INTERFACE
function RecurringTasks({ tasks = [], onCreate, onEdit, onDelete, onToggle }) {
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Recurring Tasks</h3>
        <button className="btn" onClick={onCreate}>+ New Task</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              marginBottom: 10,
              background: "#222429",
              borderRadius: 5,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <b>{task.description}</b>
              <span style={{ marginLeft: 10, color: "#aaa", fontSize: "0.98em" }}>
                ({task.recurrence}, {task.time})
              </span>
              <span style={{
                marginLeft: 12,
                fontStyle: "italic",
                color: task.status === "missed" ? "#FF9800" : "#8de88d"
              }}>
                {task.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn" style={{
                background: "#353780",
                color: "#fff",
                fontSize: 12
              }} onClick={() => onEdit?.(task.id)}>Edit</button>
              <button className="btn" style={{
                background: "#632828",
                color: "#fff",
                fontSize: 12
              }} onClick={() => onDelete?.(task.id)}>Delete</button>
              <button className="btn" style={{
                background: task.status === "done" ? "#ccc" : "#4CAF50",
                color: "#222",
                fontSize: 12
              }} onClick={() => onToggle?.(task.id)}>
                {task.status === "done" ? "Mark Pending" : "Mark Done"}
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 &&
          <div style={{ color: "var(--text-secondary)" }}>No recurring tasks set.</div>}
      </ul>
    </section>
  );
}

export default RecurringTasks;
