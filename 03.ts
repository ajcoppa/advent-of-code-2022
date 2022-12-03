#!/usr/bin/env ts-node

import _ from "lodash";
import { pipe } from "@arrows/composition";
import { loadFromFile, sum } from "./lib";

async function main() {
  const sacks: string[] = await loadFromFile("03-input.txt");
  console.log(`Part 1: ${partOne(sacks)}`);
  console.log(`Part 2: ${partTwo(sacks)}`);
}

function partOne(sacks: string[]): number {
  return sum(sacks.map(pipe(splitSack, findCommonItem, calculatePriority)));
}

function partTwo(sacks: string[]): number {
  const splitSacks = _.chunk(sacks, 3);
  return sum(splitSacks.map(pipe(findCommonItem, calculatePriority)));
}

function splitSack(sack: string): string[] {
  const midpoint: number = Math.floor(sack.length / 2);
  return [sack.substring(0, midpoint), sack.substring(midpoint)];
}

function findCommonItem(sacks: string[]): string {
  const charSets: Set<string>[] = sacks.map((s) => new Set(s));

  const intersection: Set<string> = new Set(
    sacks[0]
      .split("")
      .filter((c) => charSets.slice(1).every((set) => set.has(c)))
  );

  if (intersection.size > 0) {
    return intersection.values().next().value;
  }

  console.error("Found no matching character in sacks");
  process.exit(1);
}

function calculatePriority(s: string) {
  const code = s.charCodeAt(0); // 96 is charCode for a
  if (code > 96) {
    // lowercase letters
    return code - 96;
  } else {
    // uppercase letters
    return code - 38;
  }
}

main();
