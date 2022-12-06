#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const input: string[] = await loadFromFile("06-input.txt");
  console.log(`Part 1: ${partOne(input[0])}`);
  console.log(`Part 2: ${partTwo(input[0])}`);
}

function partOne(input: string): number {
  return uniqueSignalIndex(input, 4);
}

function partTwo(input: string): number {
  return uniqueSignalIndex(input, 14);
}

function uniqueSignalIndex(input: string, windowSize: number): number {
  const windows = windowsOfOverlappingElements(input.split(""), windowSize);
  const firstUniqueWindowIndex = windows.findIndex((window) =>
    containsUniqueElements(window)
  );
  return firstUniqueWindowIndex + windowSize;
}

function windowsOfOverlappingElements<A>(xs: A[], n: number): A[][] {
  let windows: A[][] = [];
  for (let i = 0; i < xs.length - n; i++) {
    windows.push(xs.slice(i, i + n));
  }
  return windows;
}

function containsUniqueElements<A>(xs: A[]): boolean {
  const set = new Set<A>(xs);
  return set.size === xs.length;
}

main();
