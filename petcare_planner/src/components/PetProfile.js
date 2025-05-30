import React from "react";

// PUBLIC_INTERFACE
/**
 * PetProfile displays a pet's profile information.
 * @param {Object} props - Props including pet profile data.
 */
function PetProfile({ pet, isActive, onSelect }) {
  return (
    <div
      className={`pet-profile${isActive ? " active" : ""}`}
      onClick={() => onSelect && onSelect(pet.id)}
      style={{
        padding: "12px",
        marginBottom: "8px",
        background: isActive ? "var(--kavia-orange)" : "var(--kavia-dark)",
        color: "var(--text-color)",
        borderRadius: "8px",
        cursor: "pointer",
        border: isActive ? "2px solid var(--kavia-orange)" : "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* Placeholder for avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#333",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={`${pet.name}'s avatar`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 18, color: "#fff" }}>{pet.name?.charAt(0)?.toUpperCase() ?? ""}</span>
        )}
      </div>
      <div>
        <div style={{ fontWeight: "600", fontSize: "1.05rem" }}>{pet.name}</div>
        <div style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
          {pet.species || ""}{pet.breed ? `, ${pet.breed}` : ""}
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
