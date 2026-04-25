import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

const ExamTrackerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [topic, setTopic] = useState({ subject: "", title: "" });
  const [todo, setTodo] = useState({ title: "", dueDate: "" });
  const [study, setStudy] = useState({ title: "Study Session", studyMinutes: 60, studyDate: "" });

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const topicTasks = tasks.filter((t) => t.category === "topic");
  const todoTasks = tasks.filter((t) => t.category === "todo");
  const completion = useMemo(() => {
    if (!topicTasks.length) return 0;
    return Math.round((topicTasks.filter((t) => t.completed).length / topicTasks.length) * 100);
  }, [topicTasks]);

  const createTask = async (payload) => {
    await api.post("/tasks", payload);
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await api.patch(`/tasks/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold">Topic Progress ({completion}%)</h3>
        <div className="mt-2 h-2 rounded bg-slate-700">
          <div className="h-2 rounded bg-brand-500" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <form className="card space-y-2" onSubmit={(e) => { e.preventDefault(); createTask({ ...topic, category: "topic" }); setTopic({ subject: "", title: "" }); }}>
          <h4 className="font-semibold">Add Topic</h4>
          <input className="input" placeholder="Subject" value={topic.subject} onChange={(e) => setTopic({ ...topic, subject: e.target.value })} required />
          <input className="input" placeholder="Topic title" value={topic.title} onChange={(e) => setTopic({ ...topic, title: e.target.value })} required />
          <button className="btn w-full" type="submit">Save Topic</button>
        </form>

        <form className="card space-y-2" onSubmit={(e) => { e.preventDefault(); createTask({ ...todo, category: "todo" }); setTodo({ title: "", dueDate: "" }); }}>
          <h4 className="font-semibold">Add Exam To-Do</h4>
          <input className="input" placeholder="Task title" value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} required />
          <input className="input" type="date" value={todo.dueDate} onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })} />
          <button className="btn w-full" type="submit">Save To-Do</button>
        </form>

        <form className="card space-y-2" onSubmit={(e) => { e.preventDefault(); createTask({ ...study, category: "study" }); setStudy({ title: "Study Session", studyMinutes: 60, studyDate: "" }); }}>
          <h4 className="font-semibold">Daily Study Tracker</h4>
          <input className="input" type="number" min="1" value={study.studyMinutes} onChange={(e) => setStudy({ ...study, studyMinutes: Number(e.target.value) })} />
          <input className="input" type="date" value={study.studyDate} onChange={(e) => setStudy({ ...study, studyDate: e.target.value })} />
          <button className="btn w-full" type="submit">Log Study</button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h4 className="mb-2 font-semibold">Topics</h4>
          <ul className="space-y-2">
            {topicTasks.map((task) => (
              <li key={task._id} className="flex items-center justify-between gap-2 rounded bg-slate-800 p-2">
                <span>{task.subject} - {task.title}</span>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => toggleTask(task)}>{task.completed ? "Undo" : "Done"}</button>
                  <button className="btn-secondary" onClick={() => removeTask(task._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h4 className="mb-2 font-semibold">Exam To-Do List</h4>
          <ul className="space-y-2">
            {todoTasks.map((task) => (
              <li key={task._id} className="flex items-center justify-between gap-2 rounded bg-slate-800 p-2">
                <span>{task.title} {task.dueDate ? `(${new Date(task.dueDate).toLocaleDateString()})` : ""}</span>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => toggleTask(task)}>{task.completed ? "Undo" : "Done"}</button>
                  <button className="btn-secondary" onClick={() => removeTask(task._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamTrackerPage;
