#!/usr/bin/env ts-node

import _, { range } from "lodash";
import { pipe } from "@arrows/composition";
import { loadFromFile, sum } from "./lib";

async function main() {
  const assignments: string[] = await loadFromFile("04-input.txt");
  console.log(`Part 1: ${partOne(assignments)}`);
  console.log(`Part 2: ${partTwo(assignments)}`);
}

function partOne(assignments: string[]): number {
  return assignments
    .map(pipe(parseAssignmentLine, eitherFullyContains))
    .filter((x) => !!x).length;
}

function partTwo(assignments: string[]): number {
  return assignments
    .map(pipe(parseAssignmentLine, overlapsRanges))
    .filter((x) => !!x).length;
}

function parseAssignmentLine(assignment: string): Assignment {
  const ranges = assignment.split(",").map(parseRange);
  if (ranges.length !== 2) {
    console.error(`Range failed to parse properly: ${range}`);
    process.exit(1);
  }
  return {
    one: ranges[0],
    two: ranges[1],
  };
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

function eitherFullyContains(assignment: Assignment): boolean {
  return (
    fullyContains(assignment.one, assignment.two) ||
    fullyContains(assignment.two, assignment.one)
  );
}

function fullyContains(rangeOne: Range, rangeTwo: Range): boolean {
  return rangeOne.a <= rangeTwo.a && rangeOne.b >= rangeTwo.b;
}

function overlapsRanges(assignment: Assignment): boolean {
  return overlaps(assignment.one, assignment.two);
}

function overlaps(rangeOne: Range, rangeTwo: Range): boolean {
  return (
    (rangeOne.a <= rangeTwo.b && rangeOne.b >= rangeTwo.a) ||
    (rangeTwo.a <= rangeOne.b && rangeTwo.b >= rangeOne.a)
  );
}

type Range = {
  a: number;
  b: number;
};

type Assignment = {
  one: Range;
  two: Range;
};

main();
