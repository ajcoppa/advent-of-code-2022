#!/usr/bin/env ts-node

import { all, any, identity, loadFromFile } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("08-input.txt");
  const heights: number[][] = parseHeights(lines);
  console.log(`Part 1: ${partOne(heights)}`);
}

function partOne(heights: number[][]): number {
  return heights
    .flatMap((row, y) => row.map((height, x) => isVisible(x, y, heights)))
    .filter((x) => !!x).length;
}

function isVisible(x: number, y: number, heights: number[][]): boolean {
  return any(
    [Direction.Up, Direction.Right, Direction.Down, Direction.Left].map((d) =>
      isVisibleFromDirection(x, y, heights, d)
    )
  );
}

function isVisibleFromDirection(
  x: number,
  y: number,
  heights: number[][],
  direction: Direction
): boolean {
  const mainTreeHeight = heights[y][x];

  return all(
    treesInDirection(x, y, heights, direction).map(
      (height) => height < mainTreeHeight
    )
  );
}

function treesInDirection(
  x: number,
  y: number,
  heights: number[][],
  direction: Direction
): number[] {
  const modifiers = directionPositionModifiers(direction);

  let trees: number[] = [];
  const xMax = heights[0].length - 1;
  const yMax = heights.length - 1;
  let xToCheck = modifiers.x(x);
  let yToCheck = modifiers.y(y);

  while (inBounds(xToCheck, yToCheck, xMax, yMax)) {
    trees.push(heights[yToCheck][xToCheck]);

    xToCheck = modifiers.x(xToCheck);
    yToCheck = modifiers.y(yToCheck);
  }
  return trees;
}

function inBounds(x: number, y: number, xMax: number, yMax: number): boolean {
  return x >= 0 && x <= xMax && y >= 0 && y <= yMax;
}

function parseHeights(lines: string[]): number[][] {
  return lines.map((line) => line.split("").map((s) => parseInt(s, 10)));
}

function directionPositionModifiers(direction: Direction): Modifiers {
  switch (direction) {
    case Direction.Up:
      return { x: identity, y: (n) => n - 1 };
    case Direction.Right:
      return { x: (n) => n + 1, y: identity };
    case Direction.Down:
      return { x: identity, y: (n) => n + 1 };
    case Direction.Left:
      return { x: (n) => n - 1, y: identity };
  }
}

interface Modifiers {
  x: (n: number) => number;
  y: (n: number) => number;
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

main();
