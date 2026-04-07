import { useEffect, useState } from "react";
import "../styles/NotesPage.css";

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Work",
    pinned: false,
  });

  const [editNoteId, setEditNoteId] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("focusflow_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focusflow_notes", JSON.stringify(notes));
  }, [notes]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "Work",
      pinned: false,
    });
    setEditNoteId(null);
  };

  const handleAddOrUpdateNote = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Note title is required");
      return;
    }

    if (!formData.content.trim()) {
      alert("Note content is required");
      return;
    }

    if (editNoteId) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editNoteId
            ? {
                ...note,
                title: formData.title,
                content: formData.content,
                category: formData.category,
                pinned: formData.pinned,
              }
            : note
        )
      );
      resetForm();
      return;
    }

    const newNote = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      pinned: formData.pinned,
      createdAt: new Date().toISOString(),
    };

    setNotes((prevNotes) => [newNote, ...prevNotes]);
    resetForm();
  };

  const handleDeleteNote = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

    if (editNoteId === id) {
      resetForm();
    }
  };

  const handleEditNote = (note) => {
    setEditNoteId(note.id);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      pinned: note.pinned,
    });
  };

  const handleTogglePin = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ? true : note.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const totalNotes = notes.length;
  const pinnedNotes = notes.filter((note) => note.pinned).length;
  const categoriesCount = new Set(notes.map((note) => note.category)).size;

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Notes</h1>
        <p>Capture ideas, organize thoughts, and keep everything in one place.</p>
      </div>

      <div className="notes-stats">
        <div className="notes-stat-card">
          <h3>Total Notes</h3>
          <h2>{totalNotes}</h2>
        </div>

        <div className="notes-stat-card">
          <h3>Pinned Notes</h3>
          <h2>{pinnedNotes}</h2>
        </div>

        <div className="notes-stat-card">
          <h3>Categories</h3>
          <h2>{categoriesCount}</h2>
        </div>
      </div>

      <div className="notes-main">
        <div className="notes-form-card">
          <h2>{editNoteId ? "Update Note" : "Add New Note"}</h2>

          <form onSubmit={handleAddOrUpdateNote}>
            <input
              type="text"
              name="title"
              placeholder="Note title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="content"
              placeholder="Write your note here..."
              rows="8"
              value={formData.content}
              onChange={handleChange}
            ></textarea>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Ideas">Ideas</option>
              <option value="Other">Other</option>
            </select>

            <label className="pin-checkbox">
              <input
                type="checkbox"
                name="pinned"
                checked={formData.pinned}
                onChange={handleChange}
              />
              Pin this note
            </label>

            <button type="submit">
              {editNoteId ? "Update Note" : "+ Add Note"}
            </button>
          </form>
        </div>

        <div className="notes-list-card">
          <div className="notes-filters">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Ideas">Ideas</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="notes-grid">
            {filteredNotes.length === 0 ? (
              <p className="no-notes-text">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-item ${note.pinned ? "pinned-note" : ""}`}
                >
                  <div className="note-top">
                    <h3>{note.title}</h3>
                    <div className="note-badges">
                      {note.pinned && <span className="pinned-badge">Pinned</span>}
                      <span className={`category-badge ${note.category.toLowerCase()}`}>
                        {note.category}
                      </span>
                    </div>
                  </div>

                  <p className="note-content">{note.content}</p>

                  <div className="note-actions">
                    <button
                      className="pin-btn"
                      onClick={() => handleTogglePin(note.id)}
                    >
                      {note.pinned ? "Unpin" : "Pin"}
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEditNote(note)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
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

export default NotesPage;