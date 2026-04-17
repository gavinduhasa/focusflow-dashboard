const pool = require("../db/db");

const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalTasksQuery = pool.query(
            `SELECT COUNT(*)::int AS total_tasks
       FROM tasks
       WHERE user_id = $1`,
            [userId]
        );

        const completedTasksQuery = pool.query(
            `SELECT COUNT(*)::int AS completed_tasks
       FROM tasks
       WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );

        const pendingTasksQuery = pool.query(
            `SELECT COUNT(*)::int AS pending_tasks
       FROM tasks
       WHERE user_id = $1 AND status != 'completed'`,
            [userId]
        );

        const overdueTasksQuery = pool.query(
            `SELECT COUNT(*)::int AS overdue_tasks
       FROM tasks
       WHERE user_id = $1
         AND due_date IS NOT NULL
         AND due_date < NOW()
         AND status != 'completed'`,
            [userId]
        );

        const totalNotesQuery = pool.query(
            `SELECT COUNT(*)::int AS total_notes
       FROM notes
       WHERE user_id = $1`,
            [userId]
        );

        const totalGoalsQuery = pool.query(
            `SELECT COUNT(*)::int AS total_goals
       FROM goals
       WHERE user_id = $1`,
            [userId]
        );

        const completedGoalsQuery = pool.query(
            `SELECT COUNT(*)::int AS completed_goals
       FROM goals
       WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );

        const [
            totalTasksResult,
            completedTasksResult,
            pendingTasksResult,
            overdueTasksResult,
            totalNotesResult,
            totalGoalsResult,
            completedGoalsResult,
        ] = await Promise.all([
            totalTasksQuery,
            completedTasksQuery,
            pendingTasksQuery,
            overdueTasksQuery,
            totalNotesQuery,
            totalGoalsQuery,
            completedGoalsQuery,
        ]);

        const totalTasks = totalTasksResult.rows[0].total_tasks;
        const completedTasks = completedTasksResult.rows[0].completed_tasks;
        const pendingTasks = pendingTasksResult.rows[0].pending_tasks;
        const overdueTasks = overdueTasksResult.rows[0].overdue_tasks;
        const totalNotes = totalNotesResult.rows[0].total_notes;
        const totalGoals = totalGoalsResult.rows[0].total_goals;
        const completedGoals = completedGoalsResult.rows[0].completed_goals;

        const completionRate =
            totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.status(200).json({
            success: true,
            analytics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks,
                totalNotes,
                totalGoals,
                completedGoals,
                completionRate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard analytics",
            error: error.message,
        });
    }
};

const getTaskAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const byStatus = await pool.query(
            `SELECT status, COUNT(*)::int AS count
       FROM tasks
       WHERE user_id = $1
       GROUP BY status
       ORDER BY status`,
            [userId]
        );

        const byPriority = await pool.query(
            `SELECT priority, COUNT(*)::int AS count
       FROM tasks
       WHERE user_id = $1
       GROUP BY priority
       ORDER BY priority`,
            [userId]
        );

        const completedLast7Days = await pool.query(
            `SELECT DATE(updated_at) AS date, COUNT(*)::int AS count
       FROM tasks
       WHERE user_id = $1
         AND status = 'completed'
         AND updated_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(updated_at)
       ORDER BY DATE(updated_at)`,
            [userId]
        );

        res.status(200).json({
            success: true,
            analytics: {
                byStatus: byStatus.rows,
                byPriority: byPriority.rows,
                completedLast7Days: completedLast7Days.rows,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task analytics",
            error: error.message,
        });
    }
};

const getGoalAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalGoalsResult = await pool.query(
            `SELECT COUNT(*)::int AS total_goals
       FROM goals
       WHERE user_id = $1`,
            [userId]
        );

        const activeGoalsResult = await pool.query(
            `SELECT COUNT(*)::int AS active_goals
       FROM goals
       WHERE user_id = $1 AND status = 'active'`,
            [userId]
        );

        const completedGoalsResult = await pool.query(
            `SELECT COUNT(*)::int AS completed_goals
       FROM goals
       WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );

        const averageProgressResult = await pool.query(
            `SELECT COALESCE(AVG(
          CASE
            WHEN target_value > 0
            THEN (current_value::decimal / target_value) * 100
            ELSE 0
          END
        ), 0)::numeric(10,2) AS average_progress
       FROM goals
       WHERE user_id = $1`,
            [userId]
        );

        res.status(200).json({
            success: true,
            analytics: {
                totalGoals: totalGoalsResult.rows[0].total_goals,
                activeGoals: activeGoalsResult.rows[0].active_goals,
                completedGoals: completedGoalsResult.rows[0].completed_goals,
                averageProgress: Number(averageProgressResult.rows[0].average_progress),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch goal analytics",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardAnalytics,
    getTaskAnalytics,
    getGoalAnalytics,
};