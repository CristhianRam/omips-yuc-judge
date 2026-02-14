export function compareOutput(a: string, b: string): boolean {
  return a.replace(/\s+/g, "") === b.replace(/\s+/g, "")
}
