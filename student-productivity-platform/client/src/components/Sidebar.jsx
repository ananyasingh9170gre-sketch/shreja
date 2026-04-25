import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/" },
  { label: "Notes", to: "/notes" },
  { label: "Exam Prep", to: "/exam" },
  { label: "Placement", to: "/placement" },
  { label: "Notifications", to: "/notifications" }
];

const Sidebar = () => (
  <aside className="border-r border-slate-800 bg-slate-900/60 p-4 backdrop-blur md:min-h-screen">
    <h1 className="mb-6 text-xl font-bold text-brand-100">StudySphere</h1>
    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm ${isActive ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-slate-800"}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
