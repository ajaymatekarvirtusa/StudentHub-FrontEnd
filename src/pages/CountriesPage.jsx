import { useEffect, useState } from "react";
import { useCountries } from "../hooks/useCountries.js";
import CountryForm from "../components/CountryForm.jsx";
import CountryTable from "../components/CountryTable.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Alert from "../components/Alert.jsx";

export default function CountriesPage() {
  const { page, query, loading, error, reload, goToPage, setFilters, createCountry, updateCountry, deleteCountry } =
    useCountries();

  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [searchText, setSearchText] = useState("");

  // Search 300 ms after the user stops typing, instead of on every key press.
  useEffect(() => {
    if (searchText === query.search) return undefined;
    const timer = setTimeout(() => setFilters({ search: searchText }), 300);
    return () => clearTimeout(timer);
  }, [searchText, query.search, setFilters]);

  async function handleSubmit(payload) {
    if (editing) {
      await updateCountry(editing.id, payload);
      setNotice({ type: "success", message: `Country "${payload.name}" updated.` });
      setEditing(null);
    } else {
      await createCountry(payload);
      setNotice({ type: "success", message: `Country "${payload.name}" added.` });
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteCountry(toDelete.id);
      setNotice({ type: "success", message: `Country "${toDelete.name}" deleted.` });
      if (editing?.id === toDelete.id) setEditing(null);
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  const filtered = Boolean(query.search) || query.activeOnly;

  return (
    <main className="layout">
      <section>
        <CountryForm key={editing?.id ?? "new"} country={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </section>

      <section className="card">
        <div className="section-header">
          <h2>
            Countries {!loading && <span className="muted">({page.totalCount})</span>}
          </h2>
          <button type="button" className="btn btn-small btn-secondary" onClick={reload} disabled={loading}>
            Refresh
          </button>
        </div>

        <div className="toolbar">
          <input
            type="search"
            className="input toolbar-search"
            placeholder="Search name or code..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search countries"
            maxLength={100}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={query.activeOnly}
              onChange={(e) => setFilters({ activeOnly: e.target.checked })}
            />
            Active only
          </label>
        </div>

        <Alert type={notice.type} message={notice.message} onClose={() => setNotice({ type: "", message: "" })} />
        <Alert message={error} />

        <CountryTable
          countries={page.items}
          loading={loading}
          selectedId={editing?.id}
          onEdit={(c) => {
            setNotice({ type: "", message: "" });
            setEditing(c);
          }}
          onDelete={setToDelete}
          emptyText={filtered ? "No countries match your search." : "No countries yet. Add one using the form."}
        />

        <Pagination page={page} onPageChange={goToPage} disabled={loading} />
      </section>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete country"
        message={toDelete ? `Delete "${toDelete.name}"? This cannot be undone from the UI.` : ""}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </main>
  );
}
