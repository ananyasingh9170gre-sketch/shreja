import { useEffect, useState } from "react";
import api from "../api/client";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filters, setFilters] = useState({ search: "", subject: "" });
  const [upload, setUpload] = useState({ title: "", subject: "", description: "", file: null });

  const fetchNotes = async () => {
    const { data } = await api.get("/notes", { params: filters });
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", upload.title);
    formData.append("subject", upload.subject);
    formData.append("description", upload.description);
    formData.append("file", upload.file);
    await api.post("/notes", formData);
    setUpload({ title: "", subject: "", description: "", file: null });
    fetchNotes();
  };

  const toggleLike = async (id) => {
    await api.patch(`/notes/${id}/like`);
    fetchNotes();
  };

  const addComment = async (id, text) => {
    if (!text) return;
    await api.post(`/notes/${id}/comments`, { text });
    fetchNotes();
  };

  return (
    <div className="space-y-4">
      <form className="card grid gap-3 md:grid-cols-2" onSubmit={handleUpload}>
        <h3 className="md:col-span-2 text-lg font-semibold">Upload Notes</h3>
        <input className="input" placeholder="Title" value={upload.title} onChange={(e) => setUpload({ ...upload, title: e.target.value })} required />
        <input className="input" placeholder="Subject" value={upload.subject} onChange={(e) => setUpload({ ...upload, subject: e.target.value })} required />
        <input className="input md:col-span-2" placeholder="Description" value={upload.description} onChange={(e) => setUpload({ ...upload, description: e.target.value })} />
        <input className="input md:col-span-2" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setUpload({ ...upload, file: e.target.files[0] })} required />
        <button className="btn md:col-span-2" type="submit">Upload</button>
      </form>

      <div className="card grid gap-3 md:grid-cols-3">
        <input className="input" placeholder="Search notes" onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input className="input" placeholder="Filter by subject" onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
        <button className="btn-secondary" onClick={fetchNotes}>Apply Filters</button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note._id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold">{note.title}</h4>
                <p className="text-sm text-slate-400">{note.subject} | Uploaded by {note.uploadedBy?.name}</p>
                <p className="mt-1 text-sm text-slate-300">{note.description}</p>
              </div>
              <a className="btn-secondary" href={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}${note.publicFilePath}`} target="_blank" rel="noreferrer">View File</a>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button className="btn-secondary" onClick={() => toggleLike(note._id)}>Like ({note.likes.length})</button>
            </div>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const text = e.target.comment.value;
                addComment(note._id, text);
                e.target.reset();
              }}
            >
              <input name="comment" className="input" placeholder="Add comment" />
              <button className="btn" type="submit">Post</button>
            </form>

            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              {note.comments?.map((c) => (
                <li key={c._id}>{c.user?.name || "User"}: {c.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
