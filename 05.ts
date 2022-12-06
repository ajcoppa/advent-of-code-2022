#!/usr/bin/env ts-node

import fs from "fs/promises";

async function main() {
  const text: string = await fs.readFile("05-input.txt", {
    encoding: "utf-8",
  });
  const [stateString, instructionsString] = text.split("\n\n");
  console.log(`Part 1: ${partOne(stateString, instructionsString)}`);
  console.log(`Part 2: ${partTwo(stateString, instructionsString)}`);
}

function partOne(state: string, instructions: string): string {
  const beginningLayout = parseLayout(state, instructions);
  const endingLayout = runInstructions(beginningLayout, Mover.CrateMover9000);
  return endingLayout.map((row) => row.slice(-1)[0]).join("");
}

function partTwo(state: string, instructions: string): string {
  const beginningLayout = parseLayout(state, instructions);
  const endingLayout = runInstructions(beginningLayout, Mover.CrateMover9001);
  return endingLayout.map((row) => row.slice(-1)[0]).join("");
}

function parseLayout(state: string, instructions: string): Layout {
  const parsedState = parseStartingState(state);
  const parsedInstructions = instructions
    .trim()
    .split("\n")
    .map(parseInstruction);

  return {
    startingState: parsedState,
    instructions: parsedInstructions,
  };
}

function parseStartingState(state: string): Stack[] {
  const stateCharArray = state.split("\n").map((l) => l.split(""));
  const rotated = rotate90(stateCharArray);
  const crateRows = rotated
    // Drop rows starting with space
    .filter((row) => row[0] != " ")
    // Chop off starting index and remove spaces
    .map((row) => row.slice(1).filter((c) => c !== " "));
  return crateRows;
}

function parseInstruction(line: string): Instruction {
  const matches = line.match(/move (\d+) from (\d+) to (\d+)/);
  if (matches === null || matches.length !== 4) {
    console.error(`Error parsing instruction line: ${line}`);
    process.exit(1);
  }

  return {
    count: parseInt(matches[1], 10),
    from: parseInt(matches[2], 10),
    to: parseInt(matches[3], 10),
  };
}

function transpose<A>(matrix: A[][]): A[][] {
  const rowLength = matrix.length,
    columnLength = matrix[0].length;
  const grid: A[][] = [];
  for (let j = 0; j < columnLength; j++) {
    grid[j] = Array(rowLength);
  }
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      grid[j][i] = matrix[i][j];
    }
  }
  return grid;
}

function rotate90<A>(matrix: A[][]): A[][] {
  // Slice to operate on a copy instead of mutating original
  return transpose(matrix).map((row) => row.slice().reverse());
}

function runInstructions(layout: Layout, mover: Mover): Stack[] {
  let state = layout.startingState;
  layout.instructions.forEach((instruction) => {
    state = runInstruction(state, instruction, mover);
  });
  return state;
}

function runInstruction(state: Stack[], i: Instruction, mover: Mover): Stack[] {
  let newState = [...state];
  const from = i.from - 1,
    to = i.to - 1;
  const itemsToMove = newState[from].slice(-1 * i.count);
  newState[from] = newState[from].slice(0, -1 * i.count);
  newState[to] = newState[to].concat(
    mover === Mover.CrateMover9000 ? itemsToMove.reverse() : itemsToMove
  );
  return newState;
}

type Layout = {
  startingState: Stack[];
  instructions: Instruction[];
};

// Represented as char array
type Stack = string[];

type Instruction = {
  count: number;
  from: number;
  to: number;
};

enum Mover {
  CrateMover9000,
  CrateMover9001,
}

main();
