import api from "./axios";

export const getSummary = async () => {
    const response = await api.get("/analytics/dashboard");
    const analytics = response.data.analytics || {};

    const totalTasks = analytics.totalTasks || 0;
    const completedTasks = analytics.completedTasks || 0;
    const pinnedNotes = analytics.pinnedNotes || 0;
    const pendingTasks = analytics.pendingTasks || 0;
    const totalNotes = analytics.totalNotes || 0;
    const totalGoals = analytics.totalGoals || 0;
    const completedGoals = analytics.completedGoals || 0;

    const taskCompletionRate = analytics.completionRate || 0;

    const goalCompletionRate =
        totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const productivityScore = Math.round(
        taskCompletionRate * 0.6 + goalCompletionRate * 0.4
    );

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        totalNotes,
        pinnedNotes, // ✅ FIXED
        totalGoals,
        completedGoals,
        productivityScore,
        taskCompletionRate,
        goalCompletionRate,
    };
};