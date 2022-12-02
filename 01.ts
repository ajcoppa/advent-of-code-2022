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
}

function partOne(inventories: number[][]): number {
  const sums: number[] = inventories.map(sum);
  return Math.max(...sums);
}

function parseInventory(inventory: string): number[] {
  return inventory.split("\n").map((n) => parseInt(n, 10));
}

main();
