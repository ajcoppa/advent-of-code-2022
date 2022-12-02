import fs from "fs/promises";

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

export async function loadFromFile(
  path: string,
  filterEmpty: boolean = true
): Promise<string[]> {
  const text = await fs.readFile(path, { encoding: "utf-8" });
  const lines = text.split("\n");
  return filterEmpty ? lines.filter((l) => l.length > 0) : lines;
}
