import React from "react";
import PetProfile from "./PetProfile";

// PUBLIC_INTERFACE
/**
 * SidebarTabs lists all pet profiles and provides tab navigation.
 * @param {Object} props - { pets, activePetId, onSelect, reminders, onOpenReminders }
 */
function SidebarTabs({ pets, activePetId, onSelect, onAdd, reminders = [], onOpenReminders }) {
  const activeReminders = reminders.filter((r) => !r.dismissed);
  return (
    <aside
      style={{
        minWidth: 220,
        background: "var(--background-mid)",
        padding: "22px 10px",
        borderRight: "1px solid var(--border-color)",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      <div style={{ marginBottom: 23, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Your Pets</span>
        {/* Reminders badge trigger */}
        <button
          style={{
            background: "none",
            border: "none",
            padding: "3px 1.5px 3px 5px",
            cursor: "pointer",
            position: "relative",
            outline: "none"
          }}
          aria-label={`Show reminders & notifications (${activeReminders.length} pending)`}
          onClick={onOpenReminders}
          tabIndex={0}
        >
          <span role="img" aria-label="Reminders" style={{ fontSize: "1.67em", verticalAlign: "middle" }}>🔔</span>
          {activeReminders.length > 0 && (
            <span className="reminder-badge" tabIndex={-1} aria-label={`${activeReminders.length} pending reminders`}>
              {activeReminders.length}
            </span>
          )}
        </button>
      </div>
      {pets.map((pet) => (
        <PetProfile
          key={pet.id}
          pet={pet}
          isActive={pet.id === activePetId}
          onSelect={onSelect}
        />
      ))}
      <button
        className="btn"
        style={{ marginTop: 22, width: "100%" }}
        onClick={onAdd}
      >
        + Add Pet
      </button>
    </aside>
  );
}

export default SidebarTabs;
