#!/usr/bin/env ts-node

import { chunk } from "lodash";
import { loadFromFile, repeat, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("10-input.txt");
  const instructions: Instruction[] = parseInstructions(lines);
  console.log(`Part 1: ${partOne(instructions)}`);
  console.log(`Part 2: \n${partTwo(instructions)}`);
}

function partOne(instructions: Instruction[]): number {
  let state: SystemState = {
    x: 1,
    cycle: 1,
    pixels: repeat(false, 240),
  };
  let remainingInstructions = convertInstructionsToSingleCycle(instructions);
  let valuesAtInterestingStates: number[] = [];
  while (remainingInstructions.length > 0) {
    state = runInstruction(state, remainingInstructions[0]);

    if (isInterestingState(state)) {
      valuesAtInterestingStates.push(state.x * state.cycle);
    }
    remainingInstructions = remainingInstructions.slice(1);
  }
  return sum(valuesAtInterestingStates);
}

function partTwo(instructions: Instruction[]): string {
  let state: SystemState = {
    x: 1,
    cycle: 1,
    pixels: repeat(false, 240),
  };
  let remainingInstructions = convertInstructionsToSingleCycle(instructions);
  while (remainingInstructions.length > 0) {
    state = runInstruction(state, remainingInstructions[0]);
    remainingInstructions = remainingInstructions.slice(1);
  }
  return pixelsString(state.pixels);
}

function runInstruction(
  state: SystemState,
  instruction: Instruction
): SystemState {
  const currentPixel = state.cycle - 1;
  const shouldDraw = [-1, 0, 1].includes(state.x - (currentPixel % 40));
  state.pixels[currentPixel] = shouldDraw;
  if (instruction.kind === "noop") {
    return {
      x: state.x,
      cycle: state.cycle + 1,
      pixels: state.pixels,
    };
  } else {
    return {
      x: state.x + instruction.n,
      cycle: state.cycle + 1,
      pixels: state.pixels,
    };
  }
}

function isInterestingState(state: SystemState): boolean {
  return (state.cycle + 20) % 40 === 0;
}

function parseInstructions(lines: string[]): Instruction[] {
  return lines.map((line) => {
    const splitLine = line.split(" ");
    if (splitLine[0] === "noop") {
      return {
        kind: "noop",
      };
    } else {
      return {
        kind: "addx",
        n: parseInt(splitLine[1], 10),
      };
    }
  });
}

function convertInstructionsToSingleCycle(
  instructions: Instruction[]
): Instruction[] {
  return instructions.flatMap((instruction) =>
    instruction.kind === "noop"
      ? // No-ops stay the same
        [instruction]
      : // Addx instructions take 2 cycles, so run a no-op, then add
        [{ kind: "noop" }, instruction]
  );
}

function pixelsString(pixels: boolean[]): string {
  let pixelsStr: string[] = pixels.map((p) => (p ? "#" : "."));
  return chunk(pixelsStr, 40)
    .map((cs) => cs.join(""))
    .join("\n");
}

interface Noop {
  kind: "noop";
}

interface Addx {
  kind: "addx";
  n: number;
}

type Instruction = Noop | Addx;

type SystemState = {
  x: number;
  cycle: number;
  pixels: boolean[];
};

main();
