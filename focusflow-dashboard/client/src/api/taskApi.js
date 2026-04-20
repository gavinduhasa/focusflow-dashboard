import api from "./axios";

const normalizeTask = (task) => ({
    id: task.id,
    userId: task.user_id,
    title: task.title,
    description: task.description || "",
    status: task.status || "pending",
    priority: task.priority || "Medium",
    category: task.category || "Work",
    dueDate: task.due_date || "",
    createdAt: task.created_at,
    updatedAt: task.updated_at,
});

// Get all tasks
export const getTasks = async () => {
    const response = await api.get("/tasks");
    const tasks = response.data.tasks || [];
    return tasks.map(normalizeTask);
};

// Create new task
export const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return normalizeTask(response.data.task);
};

// Update task
export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return normalizeTask(response.data.task);
};

// Delete task
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};