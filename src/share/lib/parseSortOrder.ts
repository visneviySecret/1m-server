export function parseSortOrder(value: unknown): "asc" | "desc" {
  return value === "desc" ? "desc" : "asc";
}
