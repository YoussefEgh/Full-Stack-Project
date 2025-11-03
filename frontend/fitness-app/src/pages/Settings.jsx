import React, { useState } from "react";
import { FiUser, FiCamera, FiSave, FiDownload, FiTrash2, FiSettings, FiShield } from "react-icons/fi";

function Settings() {
  const [username, setUsername] = useState("Username");
  const [email, setEmail] = useState("user@example.com");
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
    alert("Workout data exported successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("This will permanently delete all your data. Continue?")) {
      alert("All data deleted.");
    }
  };

  return (
    <>
      <style>{hideScrollbarStyle}</style>
      <div style={containerStyle}>
        <div style={innerContainerStyle}>
        <div style={headerStyle}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "600" }}>Settings</h1>
          <p style={{ margin: "8px 0 0 0", color: "#888", fontSize: "14px" }}>
            Manage your account and preferences
          </p>
        </div>

        <div style={contentWrapperStyle}>
        {/* Profile Section */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>
            <FiUser style={{ fontSize: "20px" }} />
            <h2 style={{ margin: 0, marginLeft: "10px" }}>Profile</h2>
          </div>
          
          <div style={profileSectionStyle}>
            <div style={avatarWrapperStyle}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={avatarImageStyle} />
              ) : (
                <div style={avatarPlaceholderStyle}>
                  <FiUser style={{ fontSize: "40px" }} />
                </div>
              )}
              <label className="settings-upload-button" style={uploadButtonStyle}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
                <FiCamera style={{ marginRight: "6px" }} />
                Change Photo
              </label>
            </div>

            <div style={profileFormStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="settings-input"
                  style={inputStyle}
                  placeholder="Enter your username"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="settings-input"
                  style={inputStyle}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Details Section */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>
            <FiShield style={{ fontSize: "20px" }} />
            <h2 style={{ margin: 0, marginLeft: "10px" }}>Personal Details</h2>
          </div>

          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Sex</label>
              <select
                name="sex"
                value={details.sex}
                onChange={handleDetailChange}
                className="settings-input"
                style={selectStyle}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Weight ({unit})</label>
              <input
                type="number"
                name="weight"
                value={details.weight}
                onChange={handleDetailChange}
                className="settings-input"
                style={inputStyle}
                placeholder="0"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={details.height}
                  onChange={handleDetailChange}
                  className="settings-input"
                  style={inputStyle}
                  placeholder="0"
                />
            </div>
          </div>
        </section>

        {/* Units Section */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>
            <FiSettings style={{ fontSize: "20px" }} />
            <h2 style={{ margin: 0, marginLeft: "10px" }}>Units of Measurement</h2>
          </div>

          <div style={radioGroupStyle}>
            <label className="settings-radio-label" style={radioLabelStyle}>
              <input
                type="radio"
                name="unit"
                value="kg"
                checked={unit === "kg"}
                onChange={() => setUnit("kg")}
                style={radioInputStyle}
              />
              <span>Kilograms (kg)</span>
            </label>
            <label className="settings-radio-label" style={radioLabelStyle}>
              <input
                type="radio"
                name="unit"
                value="lb"
                checked={unit === "lb"}
                onChange={() => setUnit("lb")}
                style={radioInputStyle}
              />
              <span>Pounds (lb)</span>
            </label>
          </div>
        </section>

        {/* Data Management Section */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>
            <FiDownload style={{ fontSize: "20px" }} />
            <h2 style={{ margin: 0, marginLeft: "10px" }}>Data Management</h2>
          </div>

          <div style={buttonGroupStyle}>
            <button className="settings-export-button" onClick={handleExport} style={exportButtonStyle}>
              <FiDownload style={{ marginRight: "8px" }} />
              Export Data
            </button>
            <button className="settings-delete-button" onClick={handleDelete} style={deleteButtonStyle}>
              <FiTrash2 style={{ marginRight: "8px" }} />
              Delete All Data
            </button>
          </div>
        </section>
      </div>

        {/* Save Button */}
        <div style={saveButtonWrapperStyle}>
          <button
            className="settings-save-button"
            onClick={handleSave}
            disabled={saving}
            style={saving ? { ...saveButtonStyle, opacity: 0.6 } : saveButtonStyle}
          >
            <FiSave style={{ marginRight: "8px" }} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// Styles
const containerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#0a0a0a",
  height: "100vh",
  overflowY: "auto",
  scrollbarWidth: "none", /* Firefox */
  msOverflowStyle: "none", /* IE and Edge */
};

// Add CSS to hide scrollbar in Webkit browsers (Chrome, Safari)
const hideScrollbarStyle = `
  div::-webkit-scrollbar {
    display: none;
  }
`;

const innerContainerStyle = {
  width: "60vw",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const headerStyle = {
  padding: "40px 40px 20px 40px",
  borderBottom: "1px solid #222",
};

const contentWrapperStyle = {
  padding: "30px 40px",
};

const cardStyle = {
  background: "linear-gradient(135deg, #1a1a1a 0%, #141414 100%)",
  padding: "28px",
  borderRadius: "16px",
  marginBottom: "24px",
  border: "1px solid #252525",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
  color: "#1abc9c",
  fontSize: "18px",
  fontWeight: "600",
};

const profileSectionStyle = {
  display: "flex",
  gap: "32px",
  alignItems: "flex-start",
};

const avatarWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const avatarPlaceholderStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  border: "4px solid #252525",
  boxShadow: "0 4px 12px rgba(26, 188, 156, 0.2)",
};

const avatarImageStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #252525",
  boxShadow: "0 4px 12px rgba(26, 188, 156, 0.2)",
};

const uploadButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
  transition: "all 0.2s",
};

const profileFormStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#ccc",
  fontWeight: "500",
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #333",
  backgroundColor: "#0a0a0a",
  color: "#fff",
  fontSize: "15px",
  transition: "all 0.2s",
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const radioGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  transition: "all 0.2s",
};

const radioInputStyle = {
  marginRight: "12px",
  width: "18px",
  height: "18px",
  cursor: "pointer",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const exportButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px 24px",
  background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "500",
  transition: "all 0.2s",
  boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
};

const deleteButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px 24px",
  background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "500",
  transition: "all 0.2s",
  boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)",
};

const saveButtonWrapperStyle = {
  padding: "24px 40px 40px 40px",
  borderTop: "1px solid #222",
  display: "flex",
  justifyContent: "flex-end",
};

const saveButtonStyle = {
  display: "flex",
  alignItems: "center",
  padding: "14px 32px",
  background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "all 0.2s",
  boxShadow: "0 4px 12px rgba(26, 188, 156, 0.3)",
};

export default Settings;