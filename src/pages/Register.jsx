import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/FormElements";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Register — Shree Munnalal</title></Helmet>
      <div className="container-app py-12 max-w-sm">
        <h1 className="text-2xl mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Mobile Number" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" loading={submitting} className="w-full">
            Register
          </Button>
        </form>
        <p className="text-center text-sm text-brown/60 mt-4">
          Already have an account? <Link to="/login" className="text-maroon font-medium">Login</Link>
        </p>
      </div>
    </>
  );
}
