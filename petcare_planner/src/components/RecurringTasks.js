import React, { useState, useRef, useEffect } from "react";

/**
 * Modal overlay component for accessibility (traps focus, closes on Esc, styled for dark theme).
 */
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      const focusableEls = dialogRef.current.querySelectorAll(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length > 0) focusableEls[0].focus();

      // trap focus
      const handler = (e) => {
        if (!dialogRef.current.contains(document.activeElement)) {
          focusableEls[0].focus();
        }
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      className="modal-overlay"
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99, background: "rgba(15,17,21,0.92)"
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        style={{
          background: "var(--background-mid, #222429)",
          color: "var(--text-color,#fff)",
          borderRadius: 13,
          boxShadow: "0 4px 22px 0 rgba(10,20,40,0.24)",
          minWidth: 320, maxWidth: 390, width: "96vw",
          padding: "24px 18px",
          outline: "none",
          position: "relative"
        }}
        tabIndex={0}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute", right: 13, top: 13, background: "none",
            color: "var(--text-secondary)", border: "none", fontSize: 22, cursor: "pointer"
          }}
        >×</button>
        <div style={{fontWeight: 700, marginBottom: 14, fontSize: 19}}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function recurrenceOptions() {
  return [
    { value: "daily", label: "Every day" },
    { value: "everyNDays", label: "Every N days" },
    { value: "weekly", label: "Weekly (choose days)" },
  ];
}
const daysOfWeekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * RecurringTaskForm - a modal form for creating or editing a recurring task
 */
function RecurringTaskForm({
  open, onClose, onSubmit, defaultValues = {}, isEdit = false
}) {
  const [desc, setDesc] = useState(defaultValues.description || "");
  const [time, setTime] = useState(defaultValues.time || "08:00");
  const [recurrenceType, setRecurrenceType] = useState(
    defaultValues.recurrenceType || (
      defaultValues.recurrence === "everyNDays"
        ? "everyNDays"
        : defaultValues.recurrence === "weekly"
        ? "weekly"
        : "daily"
    )
  );
  const [intervalN, setIntervalN] = useState(
    typeof defaultValues.interval === "number" ? defaultValues.interval : 2
  );
  const [weeklyDays, setWeeklyDays] = useState(
    Array.isArray(defaultValues.daysOfWeek)
      ? defaultValues.daysOfWeek.slice()
      : []
  );

  // Accessibility: focus first field on open
  useEffect(() => {
    if (open) {
      setDesc(defaultValues.description || "");
      setTime(defaultValues.time || "08:00");
      setRecurrenceType(
        defaultValues.recurrenceType ||
          (defaultValues.recurrence === "everyNDays"
            ? "everyNDays"
            : defaultValues.recurrence === "weekly"
            ? "weekly"
            : "daily")
      );
      setIntervalN(
        typeof defaultValues.interval === "number"
          ? defaultValues.interval
          : 2
      );
      setWeeklyDays(
        Array.isArray(defaultValues.daysOfWeek)
          ? defaultValues.daysOfWeek.slice()
          : []
      );
    }
  }, [open, defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc || !time) {
      alert("Description and Time required");
      return;
    }
    const recurrence =
      recurrenceType === "daily"
        ? "daily"
        : recurrenceType === "everyNDays"
        ? "everyNDays"
        : "weekly";
    let newTask = {
      description: desc,
      time,
      recurrence,
      status: "pending",
      // Enhanced fields for extra patterns
      ...(recurrence === "everyNDays" ? { interval: Number(intervalN) } : {}),
      ...(recurrence === "weekly" ? { daysOfWeek: weeklyDays.slice() } : {}),
    };
    onSubmit(newTask);
    // Cleaning up state for accessibility/UX
    setDesc(""); setTime("08:00"); setRecurrenceType("daily");
    setIntervalN(2); setWeeklyDays([]);
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Recurring Task" : "New Recurring Task"}>
      <form aria-label="Recurring Task Form" onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 13, minWidth: 0}}>
        <div>
          <label htmlFor="task-desc" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Task Description</label>
          <input
            id="task-desc"
            type="text"
            value={desc}
            onChange={e=>setDesc(e.target.value)}
            required
            maxLength={64}
            style={{
              width: "100%", padding: "5px 8px", borderRadius: 6,
              border: "1px solid var(--border-color)", fontSize: 16, background: "#232533", color: "#fff"
            }}
          />
        </div>
        <div>
          <label htmlFor="task-time" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Time</label>
          <input
            id="task-time"
            type="time"
            value={time}
            onChange={e=>setTime(e.target.value)}
            required
            style={{
              width: "100%", padding: "5px 8px", borderRadius: 6,
              border: "1px solid var(--border-color)", fontSize: 16, background: "#232533", color: "#fff"
            }}
          />
        </div>
        <div>
          <label htmlFor="recurrence-type" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Recurrence</label>
          <select
            id="recurrence-type"
            value={recurrenceType}
            onChange={e=>setRecurrenceType(e.target.value)}
            required
            style={{
              width: "100%", padding: "5px 8px", borderRadius: 6,
              border: "1px solid var(--border-color)", fontSize: 16, background: "#232533", color: "#fff"
            }}
          >
            {recurrenceOptions().map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {recurrenceType === "everyNDays" && (
          <div>
            <label htmlFor="intervalN" style={{ marginRight: 6, fontWeight: 600 }}>Every</label>
            <input
              type="number"
              id="intervalN"
              min={2}
              max={30}
              value={intervalN}
              onChange={e => setIntervalN(Math.max(2, Math.min(30, Number(e.target.value) || 2)))}
              required
              style={{
                width: 56, padding: "4px 7px", borderRadius: 6,
                border: "1px solid var(--border-color)", fontSize: 14, background: "#232533", color: "#fff"
              }}
            />&nbsp;days
          </div>
        )}
        {recurrenceType === "weekly" && (
          <div>
            <span style={{ fontWeight: 600 }}>Days of the week:</span>
            <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
              {daysOfWeekLabels.map((label, idx) => (
                <button
                  type="button"
                  key={label}
                  aria-pressed={weeklyDays.includes(idx)}
                  style={{
                    background: weeklyDays.includes(idx) ? "var(--kavia-orange)" : "#232533",
                    border: "1px solid var(--border-color)",
                    color: weeklyDays.includes(idx) ? "#fff" : "#cfd6df",
                    borderRadius: 5,
                    padding: "4px 10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none"
                  }}
                  onClick={() =>
                    setWeeklyDays(
                      weeklyDays.includes(idx)
                        ? weeklyDays.filter(d => d !== idx)
                        : [...weeklyDays, idx].sort()
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{marginTop:2, display:"flex", gap:10, justifyContent:"flex-end"}}>
          <button className="btn" type="button" onClick={onClose} style={{background: "#444960"}}>Cancel</button>
          <button className="btn" type="submit" style={{background: "var(--kavia-orange)"}}>{isEdit ? "Save Changes" : "Add Task"}</button>
        </div>
      </form>
    </Modal>
  );
}

// PUBLIC_INTERFACE
function RecurringTasks({ tasks = [], onCreate, onEdit, onDelete, onToggle }) {
  // Modal state: create/edit logic
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleCreateOpen = () => {
    setEditId(null);
    setModalOpen(true);
  };

  const handleEditOpen = (taskId) => {
    setEditId(taskId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const editingTask =
    editId != null ? tasks.find((t) => t.id === editId) : undefined;

  // For accessibility, add aria/roles/focus styles.
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Recurring Tasks</h3>
        <button className="btn" onClick={handleCreateOpen} aria-label="Add recurring task">
          + New Task
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
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
              justifyContent: "space-between",
            }}
            tabIndex={0}
            aria-label={`Recurring task: ${task.description}, ${task.recurrence}, at ${task.time}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleEditOpen(task.id);
            }}
          >
            <div>
              <b>{task.description}</b>
              <span style={{ marginLeft: 10, color: "#aaa", fontSize: "0.98em" }}>
                ({task.recurrence === "everyNDays"
                  ? `Every ${task.interval || 2} days`
                  : task.recurrence === "weekly"
                  ? "Weekly: " +
                    (task.daysOfWeek
                      ? task.daysOfWeek.map((d) => daysOfWeekLabels[d]).join(", ")
                      : "")
                  : "Daily"}
                {task.time ? `, ${task.time}` : null})
              </span>
              <span
                style={{
                  marginLeft: 12,
                  fontStyle: "italic",
                  color: task.status === "missed" ? "#FF9800" : "#8de88d",
                }}
              >
                {task.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn"
                style={{
                  background: "#353780",
                  color: "#fff",
                  fontSize: 12,
                }}
                onClick={() => handleEditOpen(task.id)}
                aria-label={`Edit recurring task: ${task.description}`}
              >
                Edit
              </button>
              <button
                className="btn"
                style={{
                  background: "#632828",
                  color: "#fff",
                  fontSize: 12,
                }}
                onClick={() => onDelete?.(task.id)}
                aria-label={`Delete recurring task: ${task.description}`}
              >
                Delete
              </button>
              <button
                className="btn"
                style={{
                  background: task.status === "done" ? "#ccc" : "#4CAF50",
                  color: "#222",
                  fontSize: 12,
                }}
                onClick={() => onToggle?.(task.id)}
                aria-label={
                  task.status === "done"
                    ? `Mark as pending: ${task.description}`
                    : `Mark as done: ${task.description}`
                }
              >
                {task.status === "done" ? "Mark Pending" : "Mark Done"}
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <div style={{ color: "var(--text-secondary)" }}>
            No recurring tasks set.
          </div>
        )}
      </ul>
      {/* Modal for create/edit */}
      <RecurringTaskForm
        open={modalOpen}
        onClose={handleCloseModal}
        isEdit={!!editingTask}
        defaultValues={editingTask || {}}
        onSubmit={(formVals) => {
          if (editingTask) onEdit?.(editingTask.id, formVals);
          else onCreate?.(formVals);
          handleCloseModal();
        }}
      />
    </section>
  );
}

export default RecurringTasks;
