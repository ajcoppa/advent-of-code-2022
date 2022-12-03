#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const sacks: string[] = await loadFromFile("03-input.txt");
  console.log(`Part 1: ${partOne(sacks)}`);
}

function partOne(sacks: string[]): number {
  const splitSacks: string[][] = sacks.map(splitSack);
  const commonItems: string[] = splitSacks.map(findCommonItem);
  return sum(commonItems.map(calculatePriority));
}

function splitSack(sack: string): string[] {
  const midpoint: number = Math.floor(sack.length / 2);
  return [sack.substring(0, midpoint), sack.substring(midpoint)];
}

function findCommonItem(sacks: string[]): string {
  const charSet: Set<string> = new Set();
  for (let i = 0; i < sacks[0].length; i++) {
    charSet.add(sacks[0].charAt(i));
  }

  let commonCharacter: string = "";
  for (let i = 0; i < sacks[1].length; i++) {
    const c = sacks[1].charAt(i);
    if (charSet.has(c)) {
      return c;
    }
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
