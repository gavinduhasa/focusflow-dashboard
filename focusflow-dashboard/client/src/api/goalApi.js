import api from "./axios";

const normalizeGoal = (goal) => {
    const targetValue = Number(goal.target_value) || 100;
    const currentValue = Number(goal.current_value) || 0;

    const progress =
        targetValue > 0
            ? Math.min(100, Math.max(0, Math.round((currentValue / targetValue) * 100)))
            : 0;

    return {
        id: goal.id,
        title: goal.title || "",
        description: goal.description || "",
        category: goal.category || "Other",
        deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
        progress,
        targetValue,
        currentValue,
        unit: goal.unit || "%",
        status: goal.status || "active",
        createdAt: goal.created_at || "",
        updatedAt: goal.updated_at || "",
    };
};

export const getGoals = async () => {
    const response = await api.get("/goals");
    const goals = response.data.goals || [];
    return goals.map(normalizeGoal);
};

export const createGoal = async (goalData) => {
    const targetValue = 100;
    const currentValue = Math.round((goalData.progress / 100) * targetValue);

    const response = await api.post("/goals", {
        title: goalData.title,
        description: goalData.description,
        target_value: targetValue,
        current_value: currentValue,
        unit: "%",
        deadline: goalData.deadline || null,
        status:
            goalData.progress === 100
                ? "completed"
                : goalData.progress > 0
                    ? "active"
                    : "active",
    });

    return normalizeGoal(response.data.goal);
};

export const updateGoal = async (id, goalData) => {
    const targetValue = goalData.targetValue || 100;
    const currentValue =
        goalData.currentValue ?? Math.round(((goalData.progress || 0) / 100) * targetValue);

    const response = await api.patch(`/goals/${id}`, {
        title: goalData.title,
        description: goalData.description,
        target_value: targetValue,
        current_value: currentValue,
        unit: goalData.unit || "%",
        deadline: goalData.deadline || null,
        status:
            (goalData.progress || 0) === 100
                ? "completed"
                : (goalData.progress || 0) > 0
                    ? "active"
                    : "active",
    });

    return normalizeGoal(response.data.goal);
};

export const deleteGoal = async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
};