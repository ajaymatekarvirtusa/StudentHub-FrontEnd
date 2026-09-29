// Reusable pager: "Showing 6–10 of 12"  « Prev  1 2 3  Next »
export default function Pagination({ page, onPageChange, disabled }) {
  const { pageNumber, pageSize, totalCount, totalPages, hasPreviousPage, hasNextPage } = page;
  if (totalCount === 0) return null;

  const first = (pageNumber - 1) * pageSize + 1;
  const last = Math.min(pageNumber * pageSize, totalCount);

  // Show at most 5 page buttons around the current page.
  const start = Math.max(1, Math.min(pageNumber - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="muted">
        Showing {first}–{last} of {totalCount}
      </span>
      <div className="pagination-buttons">
        <button type="button" className="btn btn-small btn-secondary" disabled={disabled || !hasPreviousPage}
          onClick={() => onPageChange(pageNumber - 1)} aria-label="Previous page">
          « Prev
        </button>
        {pages.map((p) => (
          <button key={p} type="button" disabled={disabled && p !== pageNumber}
            className={p === pageNumber ? "btn btn-small btn-primary page-current" : "btn btn-small btn-secondary"}
            aria-current={p === pageNumber ? "page" : undefined}
            onClick={() => p !== pageNumber && onPageChange(p)}>
            {p}
          </button>
        ))}
        <button type="button" className="btn btn-small btn-secondary" disabled={disabled || !hasNextPage}
          onClick={() => onPageChange(pageNumber + 1)} aria-label="Next page">
          Next »
        </button>
      </div>
    </nav>
  );
}
