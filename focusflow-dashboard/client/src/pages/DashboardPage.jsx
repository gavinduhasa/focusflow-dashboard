import { useEffect, useMemo, useState } from "react";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [settings, setSettings] = useState({
    displayName: "",
    theme: "light",
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("focusflow_tasks")) || [];
    const savedNotes = JSON.parse(localStorage.getItem("focusflow_notes")) || [];
    const savedGoals = JSON.parse(localStorage.getItem("focusflow_goals")) || [];
    const savedSettings =
      JSON.parse(localStorage.getItem("focusflow_settings")) || {};

    setTasks(savedTasks);
    setNotes(savedNotes);
    setGoals(savedGoals);
    setSettings((prev) => ({ ...prev, ...savedSettings }));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysLeft = (dateString) => {
    if (!dateString) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDeadlineLabel = (dateString) => {
    const daysLeft = getDaysLeft(dateString);

    if (daysLeft === null) return "No deadline";
    if (daysLeft < 0) return "Overdue";
    if (daysLeft === 0) return "Due today";
    if (daysLeft === 1) return "Due tomorrow";
    return `${daysLeft} days left`;
  };

  const getDeadlineClass = (dateString) => {
    const daysLeft = getDaysLeft(dateString);

    if (daysLeft === null) return "normal";
    if (daysLeft < 0) return "overdue";
    if (daysLeft <= 2) return "urgent";
    return "normal";
  };

  const dashboardData = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;

    const totalNotes = notes.length;
    const pinnedNotes = notes.filter((note) => note.pinned);
    const recentNotes = [...notes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);

    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.progress === 100).length;
    const activeGoals = goals.filter(
      (goal) => goal.progress > 0 && goal.progress < 100
    );

    const upcomingTasks = [...tasks]
      .filter((task) => !task.completed && task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const topGoals = [...goals]
      .filter((goal) => goal.progress < 100)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 4);

    const taskCompletionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const goalCompletionRate =
      totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

    const noteActivityRate =
      totalNotes === 0 ? 0 : Math.round((pinnedNotes.length / totalNotes) * 100);

    const productivityScore = Math.round(
      taskCompletionRate * 0.45 + goalCompletionRate * 0.4 + noteActivityRate * 0.15
    );

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalNotes,
      pinnedNotes,
      recentNotes,
      totalGoals,
      completedGoals,
      activeGoals,
      upcomingTasks,
      topGoals,
      taskCompletionRate,
      goalCompletionRate,
      productivityScore,
    };
  }, [tasks, notes, goals]);

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
          <p>{dashboardData.pinnedNotes.length} pinned notes</p>
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
              <h2>Upcoming Tasks</h2>
              <p>What needs attention next</p>
            </div>
          </div>

          <div className="dashboard-list">
            {dashboardData.upcomingTasks.length === 0 ? (
              <div className="empty-state">No upcoming tasks yet.</div>
            ) : (
              dashboardData.upcomingTasks.map((task) => (
                <div key={task.id} className="list-item">
                  <div className="list-item-content">
                    <h4>{task.title}</h4>
                    <p>{task.category}</p>
                  </div>

                  <div className="list-item-meta">
                    <span className={`deadline-badge ${getDeadlineClass(task.dueDate)}`}>
                      {getDeadlineLabel(task.dueDate)}
                    </span>
                    <small>{formatDate(task.dueDate)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Pinned & Recent Notes</h2>
              <p>Quick access to important ideas</p>
            </div>
          </div>

          <div className="notes-preview-list">
            {(dashboardData.pinnedNotes.length > 0
              ? dashboardData.pinnedNotes.slice(0, 3)
              : dashboardData.recentNotes
            ).length === 0 ? (
              <div className="empty-state">No notes available yet.</div>
            ) : (
              (dashboardData.pinnedNotes.length > 0
                ? dashboardData.pinnedNotes.slice(0, 3)
                : dashboardData.recentNotes
              ).map((note) => (
                <div key={note.id} className="note-preview-card">
                  <div className="note-preview-top">
                    <h4>{note.title}</h4>
                    <span className={`note-category ${note.category?.toLowerCase() || "other"}`}>
                      {note.category || "Other"}
                    </span>
                  </div>
                  <p>
                    {note.content?.length > 110
                      ? `${note.content.slice(0, 110)}...`
                      : note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card wide-card">
          <div className="card-header">
            <div>
              <h2>Goal Progress</h2>
              <p>Your active goals and progress status</p>
            </div>
          </div>

          <div className="goals-progress-list">
            {dashboardData.topGoals.length === 0 ? (
              <div className="empty-state">No active goals yet.</div>
            ) : (
              dashboardData.topGoals.map((goal) => (
                <div key={goal.id} className="goal-progress-item">
                  <div className="goal-progress-head">
                    <div>
                      <h4>{goal.title}</h4>
                      <p>{goal.category}</p>
                    </div>
                    <strong>{goal.progress}%</strong>
                  </div>

                  <div className="progress-bar large-progress">
                    <div
                      className="progress-fill gradient-fill"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>

                  <div className="goal-progress-footer">
                    <span className={`deadline-badge ${getDeadlineClass(goal.deadline)}`}>
                      {getDeadlineLabel(goal.deadline)}
                    </span>
                    <small>{goal.deadline ? formatDate(goal.deadline) : "No deadline"}</small>
                  </div>
                </div>
              ))
            )}
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
              <strong>{dashboardData.activeGoals.length}</strong>
            </div>

            <div className="summary-item">
              <span>Pinned Notes</span>
              <strong>{dashboardData.pinnedNotes.length}</strong>
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