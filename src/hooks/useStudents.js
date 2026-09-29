import { useCallback, useEffect, useState } from "react";
import { studentApi } from "../api/studentApi.js";

// Loads the student list and exposes create / update / delete.
// Every change reloads the list so the table always matches the database.
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await studentApi.getAll();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load. State is only set after the request finishes (not synchronously),
  // and ignored if the component unmounted in the meantime.
  useEffect(() => {
    let cancelled = false;
    studentApi
      .getAll()
      .then((data) => !cancelled && setStudents(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const createStudent = useCallback(
    async (student) => {
      await studentApi.create(student);
      await load();
    },
    [load],
  );

  const updateStudent = useCallback(
    async (id, student) => {
      await studentApi.update(id, student);
      await load();
    },
    [load],
  );

  const deleteStudent = useCallback(
    async (id) => {
      await studentApi.remove(id);
      await load();
    },
    [load],
  );

  return { students, loading, error, reload: load, createStudent, updateStudent, deleteStudent };
}
