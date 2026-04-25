import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { autoConnect: false });

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });

  const fetchNotifications = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    socket.connect();
    socket.emit("join-user-room", user.id);

    const onNew = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new-notification", onNew);

    return () => {
      socket.off("new-notification", onNew);
      socket.disconnect();
    };
  }, [user?.id]);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const createReminder = async (e) => {
    e.preventDefault();
    await api.post("/notifications", form);
    setForm({ title: "", message: "" });
  };

  return (
    <div className="space-y-4">
      <form className="card grid gap-2 md:grid-cols-3" onSubmit={createReminder}>
        <input className="input" placeholder="Reminder title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Reminder message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn" type="submit">Create Reminder</button>
      </form>

      <div className="space-y-2">
        {notifications.map((item) => (
          <div key={item._id} className="card flex items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-slate-300">{item.message}</p>
              <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            {!item.read ? (
              <button className="btn-secondary" onClick={() => markRead(item._id)}>Mark Read</button>
            ) : (
              <span className="text-xs text-brand-100">Read</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
