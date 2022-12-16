export type Coord = {
  x: number;
  y: number;
};

export function getAdjacentCoords<A>(
  map: A[][],
  coord: Coord,
  includeDiagonals: boolean = false
): Coord[] {
  const yMax = map.length;
  const xMax = map[0].length;
  const modifications = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];

  if (includeDiagonals) {
    modifications.push(
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 }
    );
  }
  const allAdjacentCoords = modifications.map((mod) => ({
    x: coord.x + mod.x,
    y: coord.y + mod.y,
  }));
  return allAdjacentCoords.filter((adjCoord) =>
    inBounds(adjCoord.x, adjCoord.y, xMax, yMax)
  );
}

export function inBounds(
  x: number,
  y: number,
  xMax: number,
  yMax: number
): boolean {
  return x >= 0 && x < xMax && y >= 0 && y < yMax;
}
