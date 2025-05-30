import React from "react";
import PetProfile from "./PetProfile";

/**
 * PetProfiles - Lists and manages profiles for multiple pets; triggers context CRUD actions.
 * @param {Object} props
 *  - pets: Array of pet profile objects
 *  - activePetId: currently selected petId
 *  - onSelect: function to select active pet
 *  - onAdd: function to trigger add pet flow
 *  - onEdit: function to edit a pet
 *  - onDelete: function to delete a pet
 */
 // PUBLIC_INTERFACE
function PetProfiles({ pets = [], activePetId, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>Your Pets</div>
      {pets.map((pet) => (
        <div key={pet.id} style={{ position: "relative" }}>
          <PetProfile
            pet={pet}
            isActive={pet.id === activePetId}
            onSelect={onSelect}
          />
          {/* Edit/Delete controls placeholder */}
          <div style={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 4 }}>
            <button
              className="btn"
              style={{ padding: "2px 8px", fontSize: 12, background: "#31343b" }}
              onClick={() => onEdit?.(pet.id)}
            >Edit</button>
            <button
              className="btn"
              style={{ padding: "2px 8px", fontSize: 12, background: "#4B1F1F" }}
              onClick={() => onDelete?.(pet.id)}
            >Delete</button>
          </div>
        </div>
      ))}
      <button className="btn" style={{ marginTop: 16, width: "100%" }} onClick={onAdd}>
        + Add Pet
      </button>
    </div>
  );
}

export default PetProfiles;
