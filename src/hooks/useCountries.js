import { useCallback, useEffect, useState } from "react";
import { countryApi } from "../api/countryApi.js";

export const PAGE_SIZE = 5;

const EMPTY_PAGE = {
  items: [],
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

// Server-side paging: the API returns one page at a time (5 rows by default).
export function useCountries() {
  const [query, setQuery] = useState({ pageNumber: 1, pageSize: PAGE_SIZE, search: "", activeOnly: false });
  const [page, setPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Reload whenever the page, filters or reloadKey change.
  useEffect(() => {
    let cancelled = false;
    countryApi
      .getPaged(query)
      .then((data) => {
        if (cancelled) return;
        // If the last row of a page was deleted, step back to the previous page.
        if (data.items.length === 0 && data.pageNumber > 1 && data.totalCount > 0) {
          setQuery((q) => ({ ...q, pageNumber: Math.max(1, data.totalPages) }));
          return;
        }
        setPage(data);
        setError("");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const goToPage = useCallback((pageNumber) => {
    setLoading(true);
    setQuery((q) => ({ ...q, pageNumber }));
  }, []);

  // Changing a filter always starts again from page 1.
  const setFilters = useCallback((filters) => {
    setLoading(true);
    setQuery((q) => ({ ...q, ...filters, pageNumber: 1 }));
  }, []);

  const createCountry = useCallback(
    async (country) => {
      await countryApi.create(country);
      reload();
    },
    [reload],
  );

  const updateCountry = useCallback(
    async (id, country) => {
      await countryApi.update(id, country);
      reload();
    },
    [reload],
  );

  const deleteCountry = useCallback(
    async (id) => {
      await countryApi.remove(id);
      reload();
    },
    [reload],
  );

  return { page, query, loading, error, reload, goToPage, setFilters, createCountry, updateCountry, deleteCountry };
}
