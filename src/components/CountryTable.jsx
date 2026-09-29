import { formatDate } from "../utils/format.js";

export default function CountryTable({ countries, loading, selectedId, onEdit, onDelete, emptyText }) {
  if (loading && countries.length === 0) return <p className="muted">Loading countries...</p>;
  if (countries.length === 0) return <p className="muted">{emptyText}</p>;

  return (
    <div className={loading ? "table-wrap is-loading" : "table-wrap"}>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Code</th>
            <th>Status</th>
            <th>Created</th>
            <th>Created by</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.id} className={c.id === selectedId ? "row-selected" : undefined}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td><code>{c.code}</code></td>
              <td>
                <span className={c.isActive ? "status status-active" : "status status-inactive"}>
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{formatDate(c.createdDate)}</td>
              <td>{c.createdBy || "—"}</td>
              <td className="actions-col">
                <button type="button" className="btn btn-small btn-secondary" onClick={() => onEdit(c)}>Edit</button>
                <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(c)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
