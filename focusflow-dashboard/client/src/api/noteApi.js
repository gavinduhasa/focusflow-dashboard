import api from "./axios";

const normalizeNote = (note) => ({
  id: note.id,
  title: note.title || "",
  content: note.content || "",
  category: note.category || "Other",
  pinned: note.is_pinned || false,
  createdAt: note.created_at || "",
  updatedAt: note.updated_at || "",
});

export const getNotes = async () => {
  const response = await api.get("/notes");
  const notes = response.data.notes || [];
  return notes.map(normalizeNote);
};

export const createNote = async (noteData) => {
  const response = await api.post("/notes", {
    title: noteData.title,
    content: noteData.content,
    is_pinned: noteData.pinned,
  });

  return normalizeNote(response.data.note);
};

export const updateNote = async (id, noteData) => {
  const response = await api.patch(`/notes/${id}`, {
    title: noteData.title,
    content: noteData.content,
    is_pinned: noteData.pinned,
  });

  return normalizeNote(response.data.note);
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};