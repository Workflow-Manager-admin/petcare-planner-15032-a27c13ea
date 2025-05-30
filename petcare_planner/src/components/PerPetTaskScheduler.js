import React, { useState, useMemo } from "react";
import RecurringTasks from "./RecurringTasks";
import { useTasks } from "../contexts/TaskContext";
import { usePets } from "../contexts/PetContext";

/**
 * PerPetTaskScheduler
 * Provides per-pet scheduling UI to add/edit/delete recurring care tasks like feeding, walking, medications.
 * Allows selecting recurrence pattern, time, and manages state. Tasks are displayed per selected pet.
 * @param {Object} props
 *  - activePetId: string, selected pet's id
 */
 // PUBLIC_INTERFACE
function PerPetTaskScheduler({ activePetId }) {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { pets } = usePets();

  // List of available care tasks for quick-add (could be extended)
  const standardDescriptions = [
    "Feeding",
    "Morning Walk",
    "Evening Walk",
    "Medication"
  ];

  // Only show tasks for the active pet
  const petTasks = useMemo(
    () => tasks.filter((t) => t.petId === activePetId),
    [tasks, activePetId]
  );

  // Create new recurring task handler
  const handleCreate = (formVals) => {
    addTask({
      id: String(Date.now()) + Math.random(),
      petId: activePetId,
      ...formVals,
      status: "pending",
    });
  };

  // Edit recurring task handler
  const handleEdit = (taskId, formVals) => {
    updateTask(taskId, { ...formVals });
  };

  // Remove recurring task handler
  const handleDelete = (taskId) => {
    if (window.confirm("Delete this care task?")) deleteTask(taskId);
  };

  // Toggle status (done/pending) for demo or UX
  const handleToggle = (taskId) => {
    const t = petTasks.find((task) => task.id === taskId);
    if (!t) return;
    updateTask(taskId, { status: t.status === "done" ? "pending" : "done" });
  };

  // For showing selected pet's name
  const pet = pets.find((p) => p.id === activePetId);

  return (
    <section
      style={{
        background: "var(--background-mid,#232533)",
        padding: "18px 14px 22px",
        borderRadius: 12,
        marginBottom: 16,
        border: "1px solid var(--border-color)",
        boxShadow: "0 2px 16px 0 rgba(24,38,56,0.09)",
        color: "var(--text-color)",
        maxWidth: 450,
      }}
      aria-label={
        pet
          ? `Schedule recurring care tasks for ${pet.name}`
          : "Schedule recurring care tasks"
      }
      tabIndex={0}
    >
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
        Task Scheduler{" "}
        {pet && (
          <span style={{ color: "var(--kavia-orange)", fontSize: 15 }}>
            for {pet.name}
          </span>
        )}
      </div>
      <RecurringTasks
        tasks={petTasks}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
      <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
        You may add or edit care routines like feeding, walking, and medication times for {pet?.name ?? "your pet"}. Only the selected pet's tasks are shown and edited here.
      </div>
    </section>
  );
}

export default PerPetTaskScheduler;
