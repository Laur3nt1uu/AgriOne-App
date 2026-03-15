/**
 * Utility for merging class names
 * Simple implementation without external dependencies
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === "string" && x.trim())
    .join(" ");
}
