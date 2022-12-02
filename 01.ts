#!/usr/bin/env ts-node

import fs from "fs/promises";
import { sum } from "./lib";

async function main() {
  const text: string = await fs.readFile("01-input.txt", {
    encoding: "utf-8",
  });
  const inventoryStrings: string[] = text.trim().split("\n\n");
  const inventories: number[][] = inventoryStrings.map(parseInventory);
  console.log(`Part 1: ${partOne(inventories)}`);
  console.log(`Part 2: ${partTwo(inventories)}`);
}

function partOne(inventories: number[][]): number {
  const sums: number[] = inventories.map(sum);
  return Math.max(...sums);
}

function partTwo(inventories: number[][]): number {
  const sums: number[] = inventories.map(sum);
  const topThreeSums: number[] = sums.sort((a, b) => b - a).slice(0, 3);
  return sum(topThreeSums);
}

function parseInventory(inventory: string): number[] {
  return inventory.split("\n").map((n) => parseInt(n, 10));
}

main();
