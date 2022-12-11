#!/usr/bin/env ts-node

import { identity, loadFromFile, repeat } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("09-input.txt");
  const instructions: Direction[] = parseInstructions(lines);
  console.log(`Part 1: ${partOne(instructions)}`);
}

function partOne(instructions: Direction[]): number {
  const defaultSize = 500;
  const grid: boolean[][] = repeat(false, defaultSize).map((_) =>
    repeat(false, defaultSize)
  );

  let state = {
    head: {
      x: Math.floor(defaultSize / 2),
      y: Math.floor(defaultSize / 2) - 1,
    },
    tail: {
      x: Math.floor(defaultSize / 2),
      y: Math.floor(defaultSize / 2) - 1,
    },
    grid,
    instructions,
  };

  // Move head first without moving tail
  state = tick(state, false);

  while (state.instructions.length > 0) {
    state = tick(state);
  }

  return state.grid.flatMap((row) => row.filter((x) => !!x)).length;
}

function tick(state: SystemState, shouldMoveTail: boolean = true): SystemState {
  let newHead = applyModifiers(
    state.head,
    directionPositionModifiers(state.instructions[0])
  );
  const newTail = shouldMoveTail ? moveTail(newHead, state.tail) : state.tail;
  state.grid[newTail.y][newTail.x] = true;

  return {
    head: newHead,
    tail: newTail,
    grid: state.grid,
    instructions: state.instructions.slice(1),
  };
}

function moveTail(head: Coord, tail: Coord): Coord {
  if (isTouching(head, tail)) {
    return tail;
  }

  const newY = tail.y + clamp(head.y - tail.y);
  const newX = tail.x + clamp(head.x - tail.x);
  return {
    x: newX,
    y: newY,
  };
}

function parseInstructions(lines: string[]): Direction[] {
  return lines.flatMap((line) => {
    const splitLine = line.split(" ");
    const n = parseInt(splitLine[1], 10);
    const d = parseDirection(splitLine[0]);
    return repeat(d, n);
  });
}

function parseDirection(c: string): Direction {
  switch (c) {
    case "U":
      return Direction.Up;
    case "R":
      return Direction.Right;
    case "D":
      return Direction.Down;
    case "L":
      return Direction.Left;
    default:
      console.error(`Couldn't parse direction ${c}`);
      process.exit(1);
  }
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

function applyModifiers(c: Coord, m: Modifiers): Coord {
  return {
    x: m.x(c.x),
    y: m.y(c.y),
  };
}

function clamp(n: number): number {
  if (n < 0) {
    return -1;
  } else if (n === 0) {
    return 0;
  } else {
    return 1;
  }
}

function isTouching(head: Coord, tail: Coord): boolean {
  const xDiff = head.x - tail.x;
  const yDiff = head.y - tail.y;
  return xDiff <= 1 && xDiff >= -1 && yDiff <= 1 && yDiff >= -1;
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

type Coord = {
  x: number;
  y: number;
};

type SystemState = {
  head: Coord;
  tail: Coord;
  grid: boolean[][];
  instructions: Direction[];
};

main();
