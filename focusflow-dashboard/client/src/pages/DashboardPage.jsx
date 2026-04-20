import { useEffect, useMemo, useState } from "react";
import { getSummary } from "../api/analyticsApi";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    pinnedNotes: 0,
    totalGoals: 0,
    completedGoals: 0,
    productivityScore: 0,
    taskCompletionRate: 0,
    goalCompletionRate: 0,
  });

  const [settings, setSettings] = useState({
    displayName: "",
    theme: "light",
  });

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const data = await getSummary();

  //       setSummary({
  //         totalTasks: data.totalTasks || 0,
  //         completedTasks: data.completedTasks || 0,
  //         pendingTasks: data.pendingTasks || 0,
  //         totalNotes: data.totalNotes || 0,
  //         pinnedNotes: data.pinnedNotes || 0,
  //         totalGoals: data.totalGoals || 0,
  //         completedGoals: data.completedGoals || 0,
  //         productivityScore: data.productivityScore || 0,
  //         taskCompletionRate: data.taskCompletionRate || 0,
  //         goalCompletionRate: data.goalCompletionRate || 0,
  //       });

  //       const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  //       const savedSettings =
  //         JSON.parse(localStorage.getItem("focusflow_settings")) || {};

  //       setSettings((prev) => ({
  //         ...prev,
  //         ...savedSettings,
  //         displayName:
  //           savedSettings.displayName ||
  //           savedUser.displayName ||
  //           savedUser.name ||
  //           "",
  //       }));
  //     } catch (err) {
  //       console.error("Failed to load dashboard summary", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const data = await getSummary();
      setSummary(data);

      const savedUser = JSON.parse(localStorage.getItem("user")) || {};
      const savedSettings =
        JSON.parse(localStorage.getItem("focusflow_settings")) || {};

      setSettings((prev) => ({
        ...prev,
        ...savedSettings,
        displayName:
          savedSettings.displayName ||
          savedUser.displayName ||
          savedUser.name ||
          "",
      }));
    } catch (err) {
      console.error("Failed to load dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const dashboardData = useMemo(() => {
    return {
      totalTasks: summary.totalTasks,
      completedTasks: summary.completedTasks,
      pendingTasks: summary.pendingTasks,
      totalNotes: summary.totalNotes,
      pinnedNotesCount: summary.pinnedNotes,
      totalGoals: summary.totalGoals,
      completedGoals: summary.completedGoals,
      activeGoals: Math.max(summary.totalGoals - summary.completedGoals, 0),
      taskCompletionRate: summary.taskCompletionRate,
      goalCompletionRate: summary.goalCompletionRate,
      productivityScore: summary.productivityScore,
    };
  }, [summary]);

  const productivityLevel =
    dashboardData.productivityScore >= 75
      ? "Excellent Momentum"
      : dashboardData.productivityScore >= 45
      ? "Good Progress"
      : "Needs More Focus";

  const productivityMessage =
    dashboardData.productivityScore >= 75
      ? "You’re doing great. Your consistency is building real momentum."
      : dashboardData.productivityScore >= 45
      ? "You are on the right track. A few completed priorities will boost your day."
      : "Start with one important task today and build momentum step by step.";

  const displayName = settings.displayName?.trim() || "there";

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <span className="dashboard-badge">FocusFlow Workspace</span>
            <h1>Loading dashboard...</h1>
            <p>Please wait while we load your productivity overview.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-badge">FocusFlow Workspace</span>
          <h1>
            {getGreeting()}, {displayName} 👋
          </h1>
          <p>
            Here’s your productivity overview. Track your work, goals, and ideas
            from one place.
          </p>
        </div>

        <div className="dashboard-score-card">
          <span className="score-label">Productivity Score</span>
          <h2>{dashboardData.productivityScore}%</h2>
          <p>{productivityLevel}</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div>
            <span>Total Tasks</span>
            <h3>{dashboardData.totalTasks}</h3>
          </div>
          <p>{dashboardData.completedTasks} completed</p>
        </div>

        <div className="dashboard-stat-card">
          <div>
            <span>Pending Tasks</span>
            <h3>{dashboardData.pendingTasks}</h3>
          </div>
          <p>Keep moving forward</p>
        </div>

        <div className="dashboard-stat-card">
          <div>
            <span>Total Notes</span>
            <h3>{dashboardData.totalNotes}</h3>
          </div>
          <p>{dashboardData.pinnedNotesCount} pinned notes</p>
        </div>

        <div className="dashboard-stat-card">
          <div>
            <span>Total Goals</span>
            <h3>{dashboardData.totalGoals}</h3>
          </div>
          <p>{dashboardData.completedGoals} completed</p>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-card wide-card">
          <div className="card-header">
            <div>
              <h2>Today’s Focus</h2>
              <p>Your most important productivity snapshot</p>
            </div>
          </div>

          <div className="focus-grid">
            <div className="focus-box">
              <span>Task Completion</span>
              <strong>{dashboardData.taskCompletionRate}%</strong>
              <div className="progress-bar">
                <div
                  className="progress-fill blue-fill"
                  style={{ width: `${dashboardData.taskCompletionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="focus-box">
              <span>Goal Completion</span>
              <strong>{dashboardData.goalCompletionRate}%</strong>
              <div className="progress-bar">
                <div
                  className="progress-fill purple-fill"
                  style={{ width: `${dashboardData.goalCompletionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="focus-box insight-box">
              <span>Smart Insight</span>
              <strong>{productivityLevel}</strong>
              <p>{productivityMessage}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Quick Summary</h2>
              <p>Your real-time app overview</p>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span>Completed Tasks</span>
              <strong>{dashboardData.completedTasks}</strong>
            </div>

            <div className="summary-item">
              <span>Active Goals</span>
              <strong>{dashboardData.activeGoals}</strong>
            </div>

            <div className="summary-item">
              <span>Pinned Notes</span>
              <strong>{dashboardData.pinnedNotesCount}</strong>
            </div>

            <div className="summary-item">
              <span>Focus Status</span>
              <strong>{productivityLevel}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;