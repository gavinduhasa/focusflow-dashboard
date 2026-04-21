import api from "./axios";

export const getDashboardSummary = async () => {
    const response = await api.get("/analytics/dashboard");
    const analytics = response.data.analytics || {};

    const totalTasks = analytics.totalTasks || 0;
    const completedTasks = analytics.completedTasks || 0;
    const pendingTasks = analytics.pendingTasks || 0;
    const totalNotes = analytics.totalNotes || 0;
    const pinnedNotes = analytics.pinnedNotes || 0;
    const totalGoals = analytics.totalGoals || 0;
    const completedGoals = analytics.completedGoals || 0;

    const taskCompletionRate = analytics.completionRate || 0;
    const goalCompletionRate =
        totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const pinnedRate =
        totalNotes > 0 ? Math.round((pinnedNotes / totalNotes) * 100) : 0;

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
        taskCompletionRate,
        goalCompletionRate,
        productivityScore,
    };
};

export const getTaskAnalytics = async () => {
    const response = await api.get("/analytics/tasks");
    return response.data.analytics || {
        byStatus: [],
        byPriority: [],
        completedLast7Days: [],
    };
};

export const getGoalAnalytics = async () => {
    const response = await api.get("/analytics/goals");
    return response.data.analytics || {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        averageProgress: 0,
    };
};