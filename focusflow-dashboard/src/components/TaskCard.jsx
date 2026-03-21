import React from "react";

const TaskCard = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-top">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description added."}</p>
        </div>

        <div className="task-badges">
          <span className={`badge priority ${task.priority.toLowerCase()}`}>
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
          <button onClick={() => onToggle(task.id)}>
            {task.completed ? "Undo" : "Complete"}
          </button>
          <button className="delete-btn" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;