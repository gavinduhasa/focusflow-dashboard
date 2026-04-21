import { useEffect, useMemo, useState } from "react";
import "../styles/GoalsPage.css";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../api/goalApi";

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal",
    deadline: "",
    progress: 0,
  });

  const [editGoalId, setEditGoalId] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals", err);
      }
    };

    fetchGoals();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Personal",
      deadline: "",
      progress: 0,
    });
    setEditGoalId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const getGoalStatus = (progress) => {
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Completed";
    return "In Progress";
  };

  const getSmartMessage = (progress) => {
    if (progress === 100) return "🎉 Goal completed!";
    if (progress >= 80) return "🔥 Almost there!";
    if (progress >= 50) return "🚀 Great progress!";
    if (progress > 0) return "⚡ Keep going!";
    return "🌱 Ready to start!";
  };

  const getDeadlineState = (deadline, progress) => {
    if (!deadline || progress === 100) return "normal";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(deadline);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "urgent";
    return "normal";
  };

  const handleAddOrUpdateGoal = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Goal title is required");
      return;
    }

    if (!formData.description.trim()) {
      alert("Goal description is required");
      return;
    }

    try {
      if (editGoalId) {
        const existingGoal = goals.find((goal) => goal.id === editGoalId);

        const updatedGoal = await updateGoal(editGoalId, {
          ...existingGoal,
          ...formData,
          progress: Number(formData.progress),
        });

        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.id === editGoalId
              ? {
                  ...updatedGoal,
                  category: formData.category,
                }
              : goal
          )
        );

        resetForm();
        return;
      }

      const createdGoal = await createGoal({
        ...formData,
        progress: Number(formData.progress),
      });

      setGoals((prevGoals) => [
        {
          ...createdGoal,
          category: formData.category,
        },
        ...prevGoals,
      ]);

      resetForm();
    } catch (err) {
      console.error("Failed to save goal", err);
      alert("Failed to save goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (!confirmDelete) return;

    try {
      await deleteGoal(id);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));

      if (editGoalId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Failed to delete goal", err);
      alert("Failed to delete goal");
    }
  };

  const handleEditGoal = (goal) => {
    setEditGoalId(goal.id);
    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      category: goal.category || "Personal",
      deadline: goal.deadline || "",
      progress: Number(goal.progress) || 0,
    });
  };

  const handleQuickProgress = async (goal, action) => {
    let updatedProgress = Number(goal.progress) || 0;

    if (action === "increase") {
      updatedProgress = Math.min(updatedProgress + 10, 100);
    } else if (action === "decrease") {
      updatedProgress = Math.max(updatedProgress - 10, 0);
    }

    try {
      const updatedGoal = await updateGoal(goal.id, {
        ...goal,
        progress: updatedProgress,
      });

      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === goal.id
            ? {
                ...updatedGoal,
                category: goal.category || "Other",
              }
            : g
        )
      );

      if (editGoalId === goal.id) {
        setFormData((prev) => ({
          ...prev,
          progress: updatedProgress,
        }));
      }
    } catch (err) {
      console.error("Failed to update goal progress", err);
      alert("Failed to update goal progress");
    }
  };

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const status = getGoalStatus(Number(goal.progress) || 0);

      const matchesSearch =
        (goal.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (goal.description || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? status === "Completed"
          : statusFilter === "in-progress"
          ? status === "In Progress"
          : status === "Not Started";

      const matchesCategory =
        categoryFilter === "all" ? true : goal.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [goals, searchTerm, statusFilter, categoryFilter]);

  const totalGoals = goals.length;
  const completedGoals = goals.filter(
    (goal) => Number(goal.progress) === 100
  ).length;
  const completionRate =
    totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  return (
    <div className="goals-page">
      <div className="goals-header">
        <h1>Goals</h1>
        <p>Track long-term progress and stay focused on what matters most.</p>
      </div>

      <div className="goals-stats">
        <div className="goals-stat-card">
          <h3>Total Goals</h3>
          <h2>{totalGoals}</h2>
        </div>

        <div className="goals-stat-card">
          <h3>Completed Goals</h3>
          <h2>{completedGoals}</h2>
        </div>

        <div className="goals-stat-card">
          <h3>Completion Rate</h3>
          <h2>{completionRate}%</h2>
        </div>
      </div>

      <div className="goals-main">
        <div className="goals-form-card">
          <h2>{editGoalId ? "Update Goal" : "Add New Goal"}</h2>

          <form onSubmit={handleAddOrUpdateGoal}>
            <input
              type="text"
              name="title"
              placeholder="Goal title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Goal description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Personal">Personal</option>
              <option value="Career">Career</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />

            <div className="progress-input-group">
              <label htmlFor="progress">
                Progress: <span>{formData.progress}%</span>
              </label>

              <input
                id="progress"
                type="range"
                name="progress"
                min="0"
                max="100"
                step="1"
                value={formData.progress}
                onChange={handleChange}
                className="goal-progress-slider"
              />
            </div>

            <button type="submit">
              {editGoalId ? "Update Goal" : "+ Add Goal"}
            </button>
          </form>
        </div>

        <div className="goals-list-card">
          <div className="goals-filters">
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Career">Career</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="goals-list">
            {filteredGoals.length === 0 ? (
              <p className="no-goals-text">No goals found.</p>
            ) : (
              filteredGoals.map((goal, index) => {
                const progress = Number(goal.progress) || 0;
                const status = getGoalStatus(progress);
                const smartMessage = getSmartMessage(progress);
                const deadlineState = getDeadlineState(goal.deadline, progress);

                return (
                  <div key={goal.id || index} className="goal-item">
                    <div className="goal-item-top">
                      <div>
                        <h3>{goal.title}</h3>
                        <p>{goal.description}</p>
                      </div>

                      <div className="goal-badges">
                        <span
                          className={`goal-category-badge ${(
                            goal.category || "Other"
                          ).toLowerCase()}`}
                        >
                          {goal.category || "Other"}
                        </span>

                        <span
                          className={`goal-status-badge ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="goal-progress-section">
                      <div className="goal-progress-info">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>

                      <div className="goal-progress-bar">
                        <div
                          className="goal-progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="goal-meta">
                      <span className={`goal-deadline ${deadlineState}`}>
                        Deadline: {goal.deadline || "No deadline"}
                      </span>
                      <span className="goal-message">{smartMessage}</span>
                    </div>

                    <div className="goal-actions">
                      <button
                        type="button"
                        className="progress-down-btn"
                        onClick={() => handleQuickProgress(goal, "decrease")}
                      >
                        -10%
                      </button>

                      <button
                        type="button"
                        className="progress-up-btn"
                        onClick={() => handleQuickProgress(goal, "increase")}
                      >
                        +10%
                      </button>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEditGoal(goal)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalsPage;