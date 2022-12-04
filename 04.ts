#!/usr/bin/env ts-node

import _, { range } from "lodash";
import { pipe } from "@arrows/composition";
import { loadFromFile, sum } from "./lib";

async function main() {
  const assignments: string[] = await loadFromFile("04-input.txt");
  console.log(`Part 1: ${partOne(assignments)}`);
}

function partOne(assignments: string[]): number {
  return assignments
    .map(pipe(parseAssignmentLine, eitherFullyContains))
    .filter((x) => !!x).length;
}

function parseAssignmentLine(assignment: string): Range[] {
  return assignment.split(",").map(parseRange);
}

function parseRange(range: string): Range {
  const splitRange = range.split("-");
  if (splitRange.length !== 2) {
    console.error(`Range failed to parse properly: ${range}`);
    process.exit(1);
  }
  return {
    a: parseInt(splitRange[0], 10),
    b: parseInt(splitRange[1], 10),
  };
}

function eitherFullyContains(ranges: Range[]): boolean {
  return (
    fullyContains(ranges[0], ranges[1]) || fullyContains(ranges[1], ranges[0])
  );
}

function fullyContains(rangeOne: Range, rangeTwo: Range): boolean {
  return rangeOne.a <= rangeTwo.a && rangeOne.b >= rangeTwo.b;
}

type Range = {
  a: number;
  b: number;
};

main();
