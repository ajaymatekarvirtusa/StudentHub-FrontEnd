import { request } from "./httpClient.js";

// Id of the logged-in admin used for CreatedBy / ModifiedBy.
// The API does not return a numeric user id yet, so we use 1.
const CURRENT_USER_ID = 1;

export const studentApi = {
  getAll: () => request("/Student"),

  getById: (id) => request(`/Student/${id}`),

  create: (student) =>
    request("/Student", {
      method: "POST",
      body: { ...student, createdBy: CURRENT_USER_ID },
    }),

  update: (id, student) =>
    request(`/Student/${id}`, {
      method: "PUT",
      body: { ...student, id, modifiedBy: CURRENT_USER_ID },
    }),

  remove: (id) =>
    request(`/Student/${id}?modifiedBy=${CURRENT_USER_ID}`, { method: "DELETE" }),
};
