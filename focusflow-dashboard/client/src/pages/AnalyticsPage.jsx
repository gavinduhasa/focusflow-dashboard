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
  LineChart,
  Line,
} from "recharts";
import {
  getDashboardSummary,
  getTaskAnalytics,
  getGoalAnalytics,
} from "../api/analyticsApi";
import "../styles/AnalyticsPage.css";

function AnalyticsPage() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    pinnedNotes: 0,
    totalGoals: 0,
    completedGoals: 0,
    taskCompletionRate: 0,
    goalCompletionRate: 0,
    productivityScore: 0,
  });

  const [taskAnalytics, setTaskAnalytics] = useState({
    byStatus: [],
    byPriority: [],
    completedLast7Days: [],
  });

  const [goalAnalytics, setGoalAnalytics] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardData, taskData, goalData] = await Promise.all([
          getDashboardSummary(),
          getTaskAnalytics(),
          getGoalAnalytics(),
        ]);

        setSummary(dashboardData);
        setTaskAnalytics(taskData);
        setGoalAnalytics(goalData);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const inProgressGoals = Math.max(
      goalAnalytics.activeGoals || 0,
      0
    );

    const notStartedGoals = Math.max(
      (summary.totalGoals || 0) -
        (goalAnalytics.completedGoals || 0) -
        (goalAnalytics.activeGoals || 0),
      0
    );

    return {
      totalTasks: summary.totalTasks,
      completedTasks: summary.completedTasks,
      pendingTasks: summary.pendingTasks,
      totalNotes: summary.totalNotes,
      pinnedNotes: summary.pinnedNotes,
      totalGoals: summary.totalGoals,
      completedGoals: summary.completedGoals,
      inProgressGoals,
      notStartedGoals,
      taskCompletionRate: summary.taskCompletionRate,
      goalCompletionRate: summary.goalCompletionRate,
      productivityScore: summary.productivityScore,
      averageGoalProgress: goalAnalytics.averageProgress || 0,
    };
  }, [summary, goalAnalytics]);

  const taskChartData =
    taskAnalytics.byStatus?.length > 0
      ? taskAnalytics.byStatus.map((item) => ({
          name:
            item.status === "completed"
              ? "Completed"
              : item.status === "pending"
              ? "Pending"
              : item.status,
          value: item.count,
        }))
      : [
          { name: "Completed", value: analytics.completedTasks },
          { name: "Pending", value: analytics.pendingTasks },
        ];

  const goalChartData = [
    { name: "Completed", value: analytics.completedGoals },
    { name: "In Progress", value: analytics.inProgressGoals },
    { name: "Not Started", value: analytics.notStartedGoals },
  ];

  const priorityChartData =
    taskAnalytics.byPriority?.length > 0
      ? taskAnalytics.byPriority.map((item) => ({
          name: item.priority || "Unknown",
          value: item.count,
        }))
      : [];

  const completedTrendData =
    taskAnalytics.completedLast7Days?.length > 0
      ? taskAnalytics.completedLast7Days.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          count: item.count,
        }))
      : [];

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

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>Analytics</h1>
          <p>Loading your analytics...</p>
        </div>
      </div>
    );
  }

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
            <h2>Tasks by Priority</h2>
            <span>How your tasks are distributed</span>
          </div>

          <div className="chart-wrapper">
            {priorityChartData.length === 0 ? (
              <div className="empty-chart-state">
                No priority analytics available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={priorityChartData}>
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
            <h2>Completed Tasks Trend</h2>
            <span>Last 7 days</span>
          </div>

          <div className="chart-wrapper">
            {completedTrendData.length === 0 ? (
              <div className="empty-chart-state">
                No completed task trend available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={completedTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
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

                <div className="insight-item">
                  <span>Average Goal Progress</span>
                  <strong>{analytics.averageGoalProgress}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="card-head">
            <h2>Notes Insight</h2>
            <span>Notes analytics summary</span>
          </div>

          <div className="chart-wrapper">
            <div className="empty-chart-state">
              Notes category analytics is not available from backend yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;