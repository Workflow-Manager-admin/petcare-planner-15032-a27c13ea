import React from "react";
import PetProfile from "./PetProfile";

// PUBLIC_INTERFACE
/**
 * SidebarTabs lists all pet profiles and provides tab navigation.
 * @param {Object} props - { pets, activePetId, onSelect }
 */
function SidebarTabs({ pets, activePetId, onSelect, onAdd }) {
  return (
    <aside
      style={{
        minWidth: 220,
        background: "#181b22",
        padding: "22px 10px",
        borderRight: "1px solid var(--border-color)",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      <div style={{ marginBottom: 26, fontWeight: "bold" }}>Your Pets</div>
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
