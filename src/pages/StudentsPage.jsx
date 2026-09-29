import { useState } from "react";
import { useStudents } from "../hooks/useStudents.js";
import StudentForm from "../components/StudentForm.jsx";
import StudentTable from "../components/StudentTable.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Alert from "../components/Alert.jsx";

export default function StudentsPage() {
  const { students, loading, error, reload, createStudent, updateStudent, deleteStudent } = useStudents();

  const [editing, setEditing] = useState(null); // student being edited, or null for "Add"
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  async function handleSubmit(payload) {
    if (editing) {
      await updateStudent(editing.id, payload);
      setNotice({ type: "success", message: `Student "${payload.name}" updated.` });
      setEditing(null);
    } else {
      await createStudent(payload);
      setNotice({ type: "success", message: `Student "${payload.name}" added.` });
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteStudent(toDelete.id);
      setNotice({ type: "success", message: `Student "${toDelete.name}" deleted.` });
      if (editing?.id === toDelete.id) setEditing(null);
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return (
    <>
      <main className="layout">
        <section>
          <StudentForm
            key={editing?.id ?? "new"}
            student={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </section>

        <section className="card">
          <div className="section-header">
            <h2>Students {!loading && <span className="muted">({students.length})</span>}</h2>
            <button type="button" className="btn btn-small btn-secondary" onClick={reload} disabled={loading}>
              Refresh
            </button>
          </div>

          <Alert
            type={notice.type}
            message={notice.message}
            onClose={() => setNotice({ type: "", message: "" })}
          />
          <Alert message={error} />

          <StudentTable
            students={students}
            loading={loading}
            selectedId={editing?.id}
            onEdit={(s) => {
              setNotice({ type: "", message: "" });
              setEditing(s);
            }}
            onDelete={setToDelete}
          />
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete student"
        message={toDelete ? `Delete "${toDelete.name}"? This cannot be undone from the UI.` : ""}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
