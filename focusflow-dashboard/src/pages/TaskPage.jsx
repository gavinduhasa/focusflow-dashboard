import { useEffect, useState } from "react";
import "../styles/TaskPage.css";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
  });

  const [editTaskId, setEditTaskId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("focusflow_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("focusflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdateTask = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }

    if (editTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? {
                ...task,
                ...formData,
              }
            : task
        )
      );
      setEditTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      category: "Work",
      dueDate: "",
    });
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    if (editTaskId === id) {
      setEditTaskId(null);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        category: "Work",
        dueDate: "",
      });
    }
  };

  const handleToggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
    });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "completed"
        ? task.completed
        : !task.completed;

    const matchesPriority =
      priorityFilter === "all" ? true : task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="task-page">
      <div className="task-header">
        <h1>Tasks</h1>
        <p>Manage your work and stay productive.</p>
      </div>

      <div className="task-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <h2>{totalTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <h2>{completedTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <h2>{pendingTasks}</h2>
        </div>
      </div>

      <div className="task-main">
        <div className="task-form-card">
          <h2>{editTaskId ? "Update Task" : "Add New Task"}</h2>

          <form onSubmit={handleAddOrUpdateTask}>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Task description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

            <button type="submit">
              {editTaskId ? "Update Task" : "+ Add Task"}
            </button>
          </form>
        </div>

        <div className="task-list-card">
          <div className="task-filters">
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
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="no-task-text">No tasks found.</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <div className="task-item-top">
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description added."}</p>
                    </div>

                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="task-meta">
                    <span>Category: {task.category}</span>
                    <span>
                      Due: {task.dueDate ? task.dueDate : "No due date"}
                    </span>
                    <span>Status: {task.completed ? "Completed" : "Pending"}</span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="complete-btn"
                      onClick={() => handleToggleComplete(task.id)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;