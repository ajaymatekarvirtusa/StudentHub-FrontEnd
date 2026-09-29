import { useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import FormField from "../components/FormField.jsx";
import Alert from "../components/Alert.jsx";

export default function LoginPage() {
  const { login, sessionMessage } = useAuth();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const clientErrors = {};
    if (!values.username.trim()) clientErrors.username = "Username is required.";
    if (!values.password) clientErrors.password = "Password is required.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setBusy(true);
    try {
      await login(values.username.trim(), values.password);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1>StudentHub</h1>
        <p className="muted">Sign in to manage students.</p>

        <Alert type="info" message={!error ? sessionMessage : ""} />
        <Alert message={error} onClose={() => setError("")} />

        <FormField
          label="Username"
          name="username"
          required
          autoComplete="username"
          value={values.username}
          error={errors.username}
          onChange={handleChange}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
