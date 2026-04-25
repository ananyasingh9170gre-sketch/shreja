import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Welcome back, {user?.name}</h2>
        <p className="text-sm text-slate-400">Track exams, placements, and shared notes in one place.</p>
      </div>
      <button className="btn-secondary" onClick={logout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
