import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotesPage from "./pages/NotesPage";
import ExamTrackerPage from "./pages/ExamTrackerPage";
import PlacementPage from "./pages/PlacementPage";
import NotificationsPage from "./pages/NotificationsPage";

const ProtectedShell = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-6">
        <Header />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
};

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/"
      element={
        <ProtectedShell>
          <DashboardPage />
        </ProtectedShell>
      }
    />
    <Route
      path="/notes"
      element={
        <ProtectedShell>
          <NotesPage />
        </ProtectedShell>
      }
    />
    <Route
      path="/exam"
      element={
        <ProtectedShell>
          <ExamTrackerPage />
        </ProtectedShell>
      }
    />
    <Route
      path="/placement"
      element={
        <ProtectedShell>
          <PlacementPage />
        </ProtectedShell>
      }
    />
    <Route
      path="/notifications"
      element={
        <ProtectedShell>
          <NotificationsPage />
        </ProtectedShell>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
