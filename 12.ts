#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";
import { Coord, getAdjacentCoords } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("12-input.txt");
  const map: Map = parseMap(lines);
  console.log(`Part 1: ${partOne(map)}`);
}

function partOne(map: Map): number {
  return dijkstraDistance(map);
}

function dijkstraDistance(map: Map): number {
  let queue: QueueEntry[] = [{ coord: map.start, distance: 0 }];
  const visited: Set<string> = new Set();
  while (queue.length > 0) {
    const { coord, distance } = queue.shift()!;
    if (visited.has(JSON.stringify(coord))) {
      continue;
    }

    visited.add(JSON.stringify(coord));
    if (coord.x === map.end.x && coord.y === map.end.y) {
      return distance;
    }
    const adjCoords = getAdjacentCoords(map.heights, coord).filter((adjCoord) =>
      noMoreThanOneHigher(
        map.heights[adjCoord.y][adjCoord.x],
        map.heights[coord.y][coord.x]
      )
    );
    queue = queue.concat(
      adjCoords.map((adjCoord) => ({
        coord: adjCoord,
        distance: distance + 1,
      }))
    );
  }
  console.error("Finished without finding end");
  process.exit(1);
}

function parseMap(lines: string[]): Map {
  let start: Coord = { x: 0, y: 0 },
    end: Coord = { x: 0, y: 0 };
  const heights = lines.map((line, yIndex) => {
    return line.split("").map((c, xIndex) => {
      if (c === "S") {
        start = { x: xIndex, y: yIndex };
        return 0;
      } else if (c === "E") {
        end = { x: xIndex, y: yIndex };
        return 25;
      } else {
        return c.charCodeAt(0) - "a".charCodeAt(0);
      }
    });
  });
  return {
    start,
    end,
    heights,
  };
}

function mapToString(map: Map): string {
  const heightsMapped = map.heights.map((row, yIndex) => {
    return row.map((n, xIndex) => {
      if (xIndex === map.start.x && yIndex === map.start.y) {
        return "S";
      } else if (xIndex === map.end.x && yIndex === map.end.y) {
        return "E";
      } else {
        return String.fromCharCode(n + "a".charCodeAt(0));
      }
    });
  });
  return heightsMapped.map((row) => row.join("")).join("\n");
}

function noMoreThanOneHigher(a: number, b: number): boolean {
  return a <= b + 1;
}

type Map = {
  start: Coord;
  end: Coord;
  heights: number[][];
};

type QueueEntry = {
  coord: Coord;
  distance: number;
};

main();
