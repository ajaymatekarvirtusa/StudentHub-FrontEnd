import { useState } from "react";
import FormField from "./FormField.jsx";
import Alert from "./Alert.jsx";
import { validateStudent } from "../utils/validateStudent.js";
import { todayIso } from "../utils/format.js";

const EMPTY = { name: "", dob: "", mobileNo: "" };

// Used for both Add and Edit. Pass `student` to edit, leave it empty to add.
// The parent gives this component a `key` so it resets when a different student is chosen.
export default function StudentForm({ student, onSubmit, onCancel }) {
  const isEdit = Boolean(student);
  const [values, setValues] = useState(
    isEdit
      ? {
          name: student.name ?? "",
          dob: student.dob ?? "",
          mobileNo: student.mobileNo ?? "",
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const clientErrors = validateStudent(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    const payload = {
      name: values.name.trim(),
      dob: values.dob || null,
      mobileNo: values.mobileNo || null,
    };

    setSaving(true);
    try {
      await onSubmit(payload);
      if (!isEdit) setValues(EMPTY);
    } catch (err) {
      // Show server-side validation errors next to the right fields.
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0)
        setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card student-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? `Edit student #${student.id}` : "Add student"}</h2>

      <Alert message={formError} onClose={() => setFormError("")} />

      <FormField
        label="Name"
        name="name"
        required
        maxLength={150}
        value={values.name}
        error={errors.name}
        onChange={handleChange}
        placeholder="e.g. Ajay Matekar"
        autoComplete="off"
      />
      <FormField
        label="Date of birth"
        name="dob"
        type="date"
        max={todayIso()}
        value={values.dob}
        error={errors.dob}
        onChange={handleChange}
      />
      <FormField
        label="Mobile number"
        name="mobileNo"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={values.mobileNo}
        error={errors.mobileNo}
        onChange={handleChange}
        placeholder="10 digits"
      />

      <div className="form-actions">
        {isEdit && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Add student"}
        </button>
      </div>
    </form>
  );
}
