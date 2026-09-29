import { formatDate } from "../utils/format.js";

export default function StudentTable({ students, loading, selectedId, onEdit, onDelete }) {
  if (loading) return <p className="muted">Loading students...</p>;
  if (students.length === 0) return <p className="muted">No students yet. Add one using the form.</p>;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Date of birth</th>
            <th>Mobile</th>
            <th>Created</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className={s.id === selectedId ? "row-selected" : undefined}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{formatDate(s.dob)}</td>
              <td>{s.mobileNo || "—"}</td>
              <td>{formatDate(s.createdDate)}</td>
              <td className="actions-col">
                <button type="button" className="btn btn-small btn-secondary" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(s)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
