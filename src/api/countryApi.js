import { request } from "./httpClient.js";

// Builds "?pageNumber=1&pageSize=5&search=ind&activeOnly=true" (empty values are skipped).
function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== false) {
      query.set(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export const countryApi = {
  /** Returns { items, pageNumber, pageSize, totalCount, totalPages, hasPreviousPage, hasNextPage } */
  getPaged: ({ pageNumber = 1, pageSize = 5, search = "", activeOnly = false } = {}) =>
    request(`/Country${toQueryString({ pageNumber, pageSize, search: search.trim(), activeOnly })}`),

  getById: (id) => request(`/Country/${id}`),

  create: (country) => request("/Country", { method: "POST", body: country }),

  update: (id, country) => request(`/Country/${id}`, { method: "PUT", body: country }),

  remove: (id) => request(`/Country/${id}`, { method: "DELETE" }),
};
