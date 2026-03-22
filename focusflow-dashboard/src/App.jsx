import { useState } from "react";
import "./App.css";
import TasksPage from "./pages/TaskPage";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <h1>Dashboard Page</h1>;
      case "tasks":
        return <TasksPage />;
      case "notes":
        return <h1>Notes Page</h1>;
      case "goals":
        return <h1>Goals Page</h1>;
      case "analytics":
        return <h1>Analytics Page</h1>;
      case "settings":
        return <h1>Settings Page</h1>;
      default:
        return <h1>Dashboard Page</h1>;
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
      </aside>

      <main className="main">
        <div className="main-content">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;