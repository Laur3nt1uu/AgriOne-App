export function cn(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === "string" && x.trim())
    .join(" ");
}
