import React, { useEffect, useMemo, useState } from "react";
import "../styles/TaskPage.css";

const TasksPage = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("focusflow_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("focusflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    setTaskData({
      title: "",
      description: "",
      priority: "Medium",
      category: "Work",
      dueDate: "",
    });
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Completed"
          ? task.completed
          : !task.completed;

      const matchesPriority =
        priorityFilter === "All" ? true : task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <p>Manage your work and stay productive.</p>
      </div>

      <div className="task-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>
      </div>

      <div className="tasks-grid">
        <div className="task-form-card">
          <h2>Add New Task</h2>

          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Task description"
              value={taskData.description}
              onChange={handleChange}
              rows="4"
            />

            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              name="category"
              value={taskData.category}
              onChange={handleChange}
            >
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
            />

            <button type="submit">+ Add Task</button>
          </form>
        </div>

        <div className="task-list-card">
          <div className="task-controls">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <div className="task-top">
                    <div className="task-content">
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description added."}</p>
                    </div>

                    <div className="task-badges">
                      <span
                        className={`badge priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                      <span className="badge category">{task.category}</span>
                    </div>
                  </div>

                  <div className="task-bottom">
                    <div className="task-meta">
                      <span>Due: {task.dueDate || "No date"}</span>
                      <span>
                        Status: {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button onClick={() => toggleTaskStatus(task.id)}>
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;