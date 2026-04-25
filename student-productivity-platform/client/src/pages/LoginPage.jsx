import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Login</h1>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <input className="input" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn w-full" type="submit">
          Sign In
        </button>
        <p className="text-sm text-slate-400">
          New user? <Link className="text-brand-100" to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
