import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TaskPage";
import NotesPage from "./pages/NotesPage";
import GoalsPage from "./pages/GoalsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  if (!isLoggedIn) {
  return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
}

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "tasks":
        return <TasksPage />;
      case "notes":
        return <NotesPage />;
      case "goals":
        return <GoalsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">FocusFlow</h2>

        <nav className="sidebar-nav">
          <p
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            🏠 Dashboard
          </p>

          <p
            className={activePage === "tasks" ? "active" : ""}
            onClick={() => setActivePage("tasks")}
          >
            ✅ Tasks
          </p>

          <p
            className={activePage === "notes" ? "active" : ""}
            onClick={() => setActivePage("notes")}
          >
            📝 Notes
          </p>

          <p
            className={activePage === "goals" ? "active" : ""}
            onClick={() => setActivePage("goals")}
          >
            🎯 Goals
          </p>

          <p
            className={activePage === "analytics" ? "active" : ""}
            onClick={() => setActivePage("analytics")}
          >
            📊 Analytics
          </p>

          <p
            className={activePage === "settings" ? "active" : ""}
            onClick={() => setActivePage("settings")}
          >
            ⚙️ Settings
          </p>
        </nav>

        <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
          Logout
        </button>
      </aside>

      <main className="main">
        <div className="main-content">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;