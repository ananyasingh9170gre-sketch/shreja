import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Register</h1>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <input className="input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="input" onChange={(e) => setForm({ ...form, role: e.target.value })} defaultValue="student">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn w-full" type="submit">
          Create Account
        </button>
        <p className="text-sm text-slate-400">
          Already registered? <Link className="text-brand-100" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
