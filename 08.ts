#!/usr/bin/env ts-node

import { takeWhile } from "lodash";
import { all, any, identity, loadFromFile } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("08-input.txt");
  const heights: number[][] = parseHeights(lines);
  console.log(`Part 1: ${partOne(heights)}`);
  console.log(`Part 2: ${partTwo(heights)}`);
}

function partOne(heights: number[][]): number {
  return heights
    .flatMap((row, y) => row.map((height, x) => isVisible(x, y, heights)))
    .filter((x) => !!x).length;
}

function partTwo(heights: number[][]): number {
  const scores = heights.flatMap((row, y) =>
    row.map((height, x) => scenicScore(x, y, heights))
  );
  return Math.max(...scores);
}

function scenicScore(x: number, y: number, heights: number[][]): number {
  return [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
    .map((d) => {
      const trees = treesInDirection(x, y, heights, d);
      const visibleTrees = takeWhile(trees, (t) => t < heights[y][x]).length;
      // If all trees are visible, just use that number
      // If we stopped partway due to a taller tree, add one to include that
      // last taller tree in the count
      return visibleTrees === trees.length ? visibleTrees : visibleTrees + 1;
    })
    .reduce((a, b) => a * b);
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
