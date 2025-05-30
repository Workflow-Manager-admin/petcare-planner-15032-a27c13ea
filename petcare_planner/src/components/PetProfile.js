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
        padding: "13px 11px",
        marginBottom: "9px",
        background: isActive ? "var(--primary)" : "var(--background-mid)",
        color: isActive ? "#fff" : "var(--text-color)",
        borderRadius: "9px",
        cursor: "pointer",
        border: isActive ? "2px solid var(--primary)" : "1.5px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: isActive ? "0 4px 18px 0 rgba(76,175,80,0.10)" : undefined,
        transition: "box-shadow 0.14s, background 0.14s, border 0.14s"
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "#282C33",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: isActive ? "2.5px solid var(--accent)" : "2px solid var(--primary)",
          marginRight: 7,
          boxShadow: isActive ? "0 0 8px 2px var(--primary)" : undefined
        }}
      >
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={`${pet.name}'s avatar`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 19, color: "#fff" }}>{pet.name?.charAt(0)?.toUpperCase() ?? ""}</span>
        )}
      </div>
      <div>
        <div style={{ fontWeight: "600", fontSize: "1.09rem" }}>{pet.name}</div>
        <div style={{ fontSize: "0.95rem", color: isActive ? "#eee4" : "var(--text-secondary)" }}>
          {pet.species || ""}{pet.breed ? `, ${pet.breed}` : ""}
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
