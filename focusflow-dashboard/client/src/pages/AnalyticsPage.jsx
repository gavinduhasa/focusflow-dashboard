import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import "../styles/AnalyticsPage.css";

function AnalyticsPage() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("focusflow_tasks")) || [];
    const savedNotes = JSON.parse(localStorage.getItem("focusflow_notes")) || [];
    const savedGoals = JSON.parse(localStorage.getItem("focusflow_goals")) || [];

    setTasks(savedTasks);
    setNotes(savedNotes);
    setGoals(savedGoals);
  }, []);

  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const totalNotes = notes.length;
    const pinnedNotes = notes.filter((note) => note.pinned).length;

    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.progress === 100).length;
    const inProgressGoals = goals.filter(
      (goal) => goal.progress > 0 && goal.progress < 100
    ).length;
    const notStartedGoals = goals.filter((goal) => goal.progress === 0).length;

    const taskCompletionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const goalCompletionRate =
      totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

    const pinnedRate =
      totalNotes === 0 ? 0 : Math.round((pinnedNotes / totalNotes) * 100);

    const productivityScore = Math.round(
      taskCompletionRate * 0.45 + goalCompletionRate * 0.4 + pinnedRate * 0.15
    );

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalNotes,
      pinnedNotes,
      totalGoals,
      completedGoals,
      inProgressGoals,
      notStartedGoals,
      taskCompletionRate,
      goalCompletionRate,
      productivityScore,
    };
  }, [tasks, notes, goals]);

  const taskChartData = [
    { name: "Completed", value: analytics.completedTasks },
    { name: "Pending", value: analytics.pendingTasks },
  ];

  const goalChartData = [
    { name: "Completed", value: analytics.completedGoals },
    { name: "In Progress", value: analytics.inProgressGoals },
    { name: "Not Started", value: analytics.notStartedGoals },
  ];

  const noteCategoryMap = notes.reduce((acc, note) => {
    const category = note.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const notesCategoryData = Object.keys(noteCategoryMap).map((category) => ({
    name: category,
    value: noteCategoryMap[category],
  }));

  const productivityLevel =
    analytics.productivityScore >= 70
      ? "Excellent Momentum"
      : analytics.productivityScore >= 40
      ? "Good Progress"
      : "Needs Focus";

  const productivityMessage =
    analytics.productivityScore >= 70
      ? "You’re building strong consistency. Keep your momentum going."
      : analytics.productivityScore >= 40
      ? "You’re making progress. A little more consistency will lift your results."
      : "This is a good time to refocus and complete a few important items first.";

  const PIE_COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p>Understand your productivity with real-time insights from FocusFlow.</p>
      </div>

      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <h3>Total Tasks</h3>
          <h2>{analytics.totalTasks}</h2>
          <p>{analytics.taskCompletionRate}% completion rate</p>
        </div>

        <div className="analytics-stat-card">
          <h3>Total Notes</h3>
          <h2>{analytics.totalNotes}</h2>
          <p>{analytics.pinnedNotes} pinned notes</p>
        </div>

        <div className="analytics-stat-card">
          <h3>Total Goals</h3>
          <h2>{analytics.totalGoals}</h2>
          <p>{analytics.goalCompletionRate}% completion rate</p>
        </div>

        <div className="analytics-stat-card highlight-card">
          <h3>Productivity Score</h3>
          <h2>{analytics.productivityScore}%</h2>
          <p>{productivityLevel}</p>
        </div>
      </div>

      <div className="analytics-main-grid">
        <div className="analytics-chart-card">
          <div className="card-head">
            <h2>Task Overview</h2>
            <span>Completed vs Pending</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="card-head">
            <h2>Goal Status</h2>
            <span>Progress distribution</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {goalChartData.map((entry, index) => (
                    <Cell
                      key={`goal-cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card wide-card">
          <div className="card-head">
            <h2>Notes by Category</h2>
            <span>How your notes are organized</span>
          </div>

          <div className="chart-wrapper">
            {notesCategoryData.length === 0 ? (
              <div className="empty-chart-state">
                No notes data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={notesCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="analytics-chart-card wide-card">
          <div className="card-head">
            <h2>Performance Insight</h2>
            <span>Smart summary</span>
          </div>

          <div className="insight-panel">
            <div className="score-ring">
              <div className="score-ring-inner">
                <strong>{analytics.productivityScore}%</strong>
                <span>{productivityLevel}</span>
              </div>
            </div>

            <div className="insight-content">
              <h3>Your productivity snapshot</h3>
              <p>{productivityMessage}</p>

              <div className="insight-points">
                <div className="insight-item">
                  <span>Completed Tasks</span>
                  <strong>{analytics.completedTasks}</strong>
                </div>

                <div className="insight-item">
                  <span>Pending Tasks</span>
                  <strong>{analytics.pendingTasks}</strong>
                </div>

                <div className="insight-item">
                  <span>Completed Goals</span>
                  <strong>{analytics.completedGoals}</strong>
                </div>

                <div className="insight-item">
                  <span>Pinned Notes</span>
                  <strong>{analytics.pinnedNotes}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;