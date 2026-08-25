import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/FormElements";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      if (user.role === "ADMIN" || user.role === "STAFF") {
        navigate("/admin/dashboard");
      } else {
        // If the user was redirected here from a protected page (e.g. checkout),
        // send them back to where they came from instead of always going home.
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Login — Shree Munnalal</title></Helmet>
      <div className="container-app py-12 max-w-sm">
        <h1 className="text-2xl mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Input
            label="Mobile Number"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" loading={submitting} className="w-full">
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-brown/60 mt-4">
          Don't have an account? <Link to="/register" className="text-maroon font-medium">Register</Link>
        </p>
      </div>
    </>
  );
}