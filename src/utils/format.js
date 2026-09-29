export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
