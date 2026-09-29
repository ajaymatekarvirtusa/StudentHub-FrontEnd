import { useState } from "react";
import FormField from "./FormField.jsx";
import Alert from "./Alert.jsx";
import { validateCountry } from "../utils/validateCountry.js";

const EMPTY = { name: "", code: "", isActive: true };

// Add and Edit. The parent passes a `key` so the form resets when another country is picked.
export default function CountryForm({ country, onSubmit, onCancel }) {
  const isEdit = Boolean(country);
  const [values, setValues] = useState(
    isEdit ? { name: country.name ?? "", code: country.code ?? "", isActive: country.isActive } : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : name === "code" ? value.toUpperCase() : value;
    setValues((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const clientErrors = validateCountry(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({ name: values.name.trim(), code: values.code.trim().toUpperCase(), isActive: values.isActive });
      if (!isEdit) setValues(EMPTY);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) setErrors(err.fieldErrors);
      setFormError(err.message); // e.g. 409 "A country named 'India' already exists."
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? `Edit country #${country.id}` : "Add country"}</h2>

      <Alert message={formError} onClose={() => setFormError("")} />

      <FormField label="Country name" name="name" required maxLength={100} value={values.name}
        error={errors.name} onChange={handleChange} placeholder="e.g. India" autoComplete="off" />
      <FormField label="Country code" name="code" required maxLength={3} value={values.code}
        error={errors.code} onChange={handleChange} placeholder="IN or IND" autoComplete="off" />

      <label className="checkbox">
        <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} />
        Active
      </label>

      <div className="form-actions">
        {isEdit && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Add country"}
        </button>
      </div>
    </form>
  );
}
