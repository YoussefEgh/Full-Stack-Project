import React, { useState } from "react";

function SettingsContainer() {
  const [username, setUsername] = useState("Username");
  const [profilePic, setProfilePic] = useState(null);
  const [unit, setUnit] = useState("lb");
  const [details, setDetails] = useState({ sex: "", weight: "", height: "" });
  const [saving, setSaving] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      alert("Settings saved successfully!");
      setSaving(false);
    }, 1000);
  };

  const handleExport = () => {
    // Replace this with API endpoint for exporting
    alert("Workout data exported successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("This will permanently delete all your data. Continue?")) {
      // Replace this with DELETE API call
      alert("All data deleted.");
    }
  };

  return (
    <div
      className="Settings"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#222",
        color: "#fff",
        padding: "40px",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Settings</h1>

      {/* --- PROFILE MANAGEMENT --- */}
      <section style={sectionStyle}>
        <h2 style={sectionHeader}>Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "#444",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "👤"
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
            </label>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          </div>
        </div>
      </section>

      {/* --- PERSONAL DETAILS --- */}
      <section style={sectionStyle}>
        <h2 style={sectionHeader}>Personal Details</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <label>
            Sex:
            <select
              name="sex"
              value={details.sex}
              onChange={handleDetailChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Weight ({unit}):
            <input
              type="number"
              name="weight"
              value={details.weight}
              onChange={handleDetailChange}
              style={inputStyle}
            />
          </label>
          <label>
            Height (cm):
            <input
              type="number"
              name="height"
              value={details.height}
              onChange={handleDetailChange}
              style={inputStyle}
            />
          </label>
        </div>
      </section>

      {/* --- UNITS --- */}
      <section style={sectionStyle}>
        <h2 style={sectionHeader}>Units</h2>
        <div>
          <label>
            <input
              type="radio"
              name="unit"
              value="kg"
              checked={unit === "kg"}
              onChange={() => setUnit("kg")}
            />{" "}
            Kilograms
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="unit"
              value="lb"
              checked={unit === "lb"}
              onChange={() => setUnit("lb")}
            />{" "}
            Pounds
          </label>
        </div>
      </section>

      {/* --- DATA MANAGEMENT --- */}
      <section style={sectionStyle}>
        <h2 style={sectionHeader}>Data Management</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={handleExport} style={buttonStyle("#3498db")}>
            Export Data
          </button>
          <button onClick={handleDelete} style={buttonStyle("#e74c3c")}>
            Delete All Data
          </button>
        </div>
      </section>

      {/* --- SAVE BUTTON --- */}
      <div style={{ marginTop: "40px" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={buttonStyle("#2ecc71")}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

const sectionStyle = {
  marginBottom: "30px",
  background: "#333",
  padding: "20px",
  borderRadius: "8px",
};

const sectionHeader = {
  marginBottom: "15px",
  color: "#1abc9c",
};

const inputStyle = {
  marginLeft: "10px",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #555",
  backgroundColor: "#111",
  color: "#fff",
};

const buttonStyle = (color) => ({
  background: color,
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background 0.3s",
});

export default SettingsContainer;