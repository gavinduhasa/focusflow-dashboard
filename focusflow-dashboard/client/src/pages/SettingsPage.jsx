import { useEffect, useState } from "react";
import "../styles/SettingsPage.css";
import {
  getSettings,
  updateSettings,
  initSettings,
} from "../api/settingsApi";

const defaultSettings = {
  displayName: "",
  theme: "light",
  language: "en",
  notifications: true,
  emailUpdates: false,
  timezone: "Asia/Colombo",
  defaultTaskCategory: "Work",
  defaultNoteCategory: "Work",
  defaultGoalCategory: "Personal",
};

function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");

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

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await initSettings();
        const backendSettings = await getSettings();

        const localSettings =
          JSON.parse(localStorage.getItem("focusflow_settings")) || {};
        const savedUser = JSON.parse(localStorage.getItem("user")) || {};

        const mergedSettings = {
          ...defaultSettings,
          ...backendSettings,
          ...localSettings,
          displayName:
            localSettings.displayName ||
            savedUser.displayName ||
            savedUser.name ||
            "",
        };

        setSettings(mergedSettings);
        applyTheme(mergedSettings.theme);
      } catch (err) {
        console.error("Failed to load settings", err);

        const localSettings =
          JSON.parse(localStorage.getItem("focusflow_settings")) || {};
        const fallbackSettings = { ...defaultSettings, ...localSettings };

        setSettings(fallbackSettings);
        applyTheme(fallbackSettings.theme);
      }
    };

    loadSettings();
  }, []);

  const saveLocalOnlySettings = (updatedSettings) => {
    const localOnlyData = {
      displayName: updatedSettings.displayName,
      defaultTaskCategory: updatedSettings.defaultTaskCategory,
      defaultNoteCategory: updatedSettings.defaultNoteCategory,
      defaultGoalCategory: updatedSettings.defaultGoalCategory,
    };

    localStorage.setItem("focusflow_settings", JSON.stringify(localOnlyData));

    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...savedUser,
        displayName: updatedSettings.displayName,
      })
    );
  };

  const saveBackendSettings = async (updatedSettings) => {
    const backendUpdated = await updateSettings(updatedSettings);

    return {
      ...updatedSettings,
      ...backendUpdated,
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThemeChange = async (theme) => {
    try {
      const updatedSettings = {
        ...settings,
        theme,
      };

      const merged = await saveBackendSettings(updatedSettings);
      setSettings(merged);
      applyTheme(theme);
      saveLocalOnlySettings(merged);
      showSavedMessage("Theme updated successfully");
    } catch (err) {
      console.error("Failed to update theme", err);
      showSavedMessage("Failed to update theme");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const merged = await saveBackendSettings(settings);
      setSettings(merged);
      saveLocalOnlySettings(merged);
      showSavedMessage("Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings", err);
      showSavedMessage("Failed to save settings");
    }
  };

  const handleExportData = () => {
    const allData = {
      settings:
        JSON.parse(localStorage.getItem("focusflow_settings")) || {},
      user: JSON.parse(localStorage.getItem("user")) || {},
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

  const handleResetSettings = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!confirmReset) return;

    try {
      const resetValues = {
        ...defaultSettings,
      };

      const merged = await saveBackendSettings(resetValues);
      setSettings(merged);
      saveLocalOnlySettings(resetValues);
      applyTheme(defaultSettings.theme);

      showSavedMessage("Settings reset successfully");
    } catch (err) {
      console.error("Failed to reset settings", err);
      showSavedMessage("Failed to reset settings");
    }
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
              type="button"
              className={`theme-option ${
                settings.theme === "light" ? "active-theme" : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              ☀️ Light Mode
            </button>

            <button
              type="button"
              className={`theme-option ${
                settings.theme === "dark" ? "active-theme" : ""
              }`}
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
            <h2>Preferences</h2>
            <p>Backend-connected app preferences</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label>Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
              </select>
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <input
                type="text"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              />
            </div>

            <label className="pin-checkbox">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              Enable notifications
            </label>

            <label className="pin-checkbox">
              <input
                type="checkbox"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleChange}
              />
              Enable email updates
            </label>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-head">
            <h2>Data Management</h2>
            <p>Backup and manage your app data</p>
          </div>

          <div className="data-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={handleExportData}
            >
              Export Data
            </button>

            <button
              type="button"
              className="warning-btn"
              onClick={handleResetSettings}
            >
              Reset Settings
            </button>

            <button
              type="button"
              className="danger-btn"
              onClick={handleClearAllData}
            >
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