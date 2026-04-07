import { useEffect, useState } from "react";
import "../styles/SettingsPage.css";

const defaultSettings = {
  displayName: "",
  theme: "light",
  defaultTaskCategory: "Work",
  defaultNoteCategory: "Work",
  defaultGoalCategory: "Personal",
};

function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("focusflow_settings");

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({ ...defaultSettings, ...parsedSettings });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focusflow_settings", JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  const applyTheme = (theme) => {
    const body = document.body;

    body.classList.remove("focusflow-light", "focusflow-dark");
    body.classList.add(theme === "dark" ? "focusflow-dark" : "focusflow-light");
  };

  const showSavedMessage = (message) => {
    setSavedMessage(message);
    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));
    showSavedMessage("Theme updated successfully");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showSavedMessage("Settings saved successfully");
  };

  const handleExportData = () => {
    const allData = {
      settings: JSON.parse(localStorage.getItem("focusflow_settings")) || {},
      tasks: JSON.parse(localStorage.getItem("focusflow_tasks")) || [],
      notes: JSON.parse(localStorage.getItem("focusflow_notes")) || [],
      goals: JSON.parse(localStorage.getItem("focusflow_goals")) || [],
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "focusflow-backup.json";
    link.click();
    URL.revokeObjectURL(url);

    showSavedMessage("Data exported successfully");
  };

  const handleClearAllData = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all app data? This action cannot be undone."
    );

    if (!confirmClear) return;

    localStorage.removeItem("focusflow_tasks");
    localStorage.removeItem("focusflow_notes");
    localStorage.removeItem("focusflow_goals");

    showSavedMessage("All app data cleared");
  };

  const handleResetSettings = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!confirmReset) return;

    setSettings(defaultSettings);
    localStorage.setItem("focusflow_settings", JSON.stringify(defaultSettings));
    applyTheme(defaultSettings.theme);

    showSavedMessage("Settings reset successfully");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your FocusFlow experience and manage your app preferences.</p>
      </div>

      {savedMessage && <div className="settings-alert">{savedMessage}</div>}

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-head">
            <h2>Profile Settings</h2>
            <p>Personalize your workspace</p>
          </div>

          <form onSubmit={handleSaveProfile} className="settings-form">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                placeholder="Enter your name"
                value={settings.displayName}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="primary-btn">
              Save Profile
            </button>
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-head">
            <h2>Appearance</h2>
            <p>Choose your preferred theme</p>
          </div>

          <div className="theme-options">
            <button
              className={`theme-option ${settings.theme === "light" ? "active-theme" : ""}`}
              onClick={() => handleThemeChange("light")}
            >
              ☀️ Light Mode
            </button>

            <button
              className={`theme-option ${settings.theme === "dark" ? "active-theme" : ""}`}
              onClick={() => handleThemeChange("dark")}
            >
              🌙 Dark Mode
            </button>
          </div>

          <div className="theme-preview">
            <div className="preview-box preview-light">
              <span>Light Preview</span>
            </div>
            <div className="preview-box preview-dark">
              <span>Dark Preview</span>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-head">
            <h2>Default Categories</h2>
            <p>Set your default values for quick creation</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label>Default Task Category</label>
              <select
                name="defaultTaskCategory"
                value={settings.defaultTaskCategory}
                onChange={handleChange}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Note Category</label>
              <select
                name="defaultNoteCategory"
                value={settings.defaultNoteCategory}
                onChange={handleChange}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Ideas">Ideas</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Goal Category</label>
              <select
                name="defaultGoalCategory"
                value={settings.defaultGoalCategory}
                onChange={handleChange}
              >
                <option value="Personal">Personal</option>
                <option value="Career">Career</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-head">
            <h2>Data Management</h2>
            <p>Backup and manage your app data</p>
          </div>

          <div className="data-actions">
            <button className="primary-btn" onClick={handleExportData}>
              Export Data
            </button>

            <button className="warning-btn" onClick={handleResetSettings}>
              Reset Settings
            </button>

            <button className="danger-btn" onClick={handleClearAllData}>
              Clear All Data
            </button>
          </div>
        </div>

        <div className="settings-card full-width-card">
          <div className="settings-card-head">
            <h2>About FocusFlow</h2>
            <p>Professional productivity dashboard</p>
          </div>

          <div className="about-content">
            <div className="about-item">
              <span>App Name</span>
              <strong>FocusFlow</strong>
            </div>

            <div className="about-item">
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div className="about-item">
              <span>Purpose</span>
              <strong>Tasks, Notes, Goals, Analytics, and Productivity</strong>
            </div>

            <div className="about-item">
              <span>Built For</span>
              <strong>Modern personal productivity and focus management</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;