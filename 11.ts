#!/usr/bin/env ts-node

import fs from "fs/promises";
import _ from "lodash";

async function main() {
  const text = await fs.readFile("11-input.txt", { encoding: "utf-8" });
  const monkeyStrings = text.split("\n\n");
  const monkeys: Monkey[] = parseMonkeys(monkeyStrings);
  const partTwoMonkeys = parseMonkeys(monkeyStrings);
  console.log(`Part 1: ${partOne(monkeys)}`);
  console.log(`Part 2: ${partTwo(partTwoMonkeys)}`);
}

function partOne(monkeys: Monkey[]): BigInt {
  let round = 1;
  while (round <= 20) {
    monkeys = runRound(monkeys);
    round++;
  }
  const topTwo = monkeys
    .sort((a, b) => bigIntSort(a.inspections, b.inspections))
    .slice(0, 2);
  return topTwo[0].inspections * topTwo[1].inspections;
}

function partTwo(monkeys: Monkey[]): BigInt {
  let round = 1;
  while (round <= 10000) {
    monkeys = runRound(monkeys, false);
    round++;
  }
  const topTwo = monkeys
    .sort((a, b) => bigIntSort(a.inspections, b.inspections))
    .slice(0, 2);
  return topTwo[0].inspections * topTwo[1].inspections;
}

function runRound(monkeys: Monkey[], divideByThree: boolean = true): Monkey[] {
  const lcm = bigIntProduct(monkeys.map((m) => m.testDivisor));
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      const newValue: bigint = divideByThree
        ? BigInt(Math.floor(Number(BigInt.asIntN(64, monkey.f(item))) / 3))
        : monkey.f(item) % lcm;
      const whereToThrow =
        newValue % monkey.testDivisor === BigInt(0)
          ? monkey.trueMonkeyIndex
          : monkey.falseMonkeyIndex;
      monkeys[whereToThrow].items.push(newValue);
      monkey.inspections++;
    });
    monkey.items = [];
  });
  return monkeys;
}

function parseMonkeys(monkeys: string[]): Monkey[] {
  return monkeys.map(parseMonkey);
}

function parseMonkey(monkey: string): Monkey {
  const itemMatches = monkey.match(/Starting items: ([^\n]+)/);
  if (!itemMatches) {
    console.error(`Error parsing items for monkey: ${monkey}`);
    process.exit(1);
  }
  const items = itemMatches[1].split(",").map((s) => BigInt(parseInt(s, 10)));

  const fMatches = monkey.match(/Operation: new = old ([^\n]+)/);
  if (!fMatches) {
    console.error(`Error parsing f for monkey: ${monkey}`);
    process.exit(1);
  }
  const splitF = fMatches[1].split(" ");
  const opString = splitF[0];
  const operandString = splitF[1];
  const f = operation(opString, operandString);

  const divisorMatches = monkey.match(/Test: divisible by ([^\n]+)/);
  if (!divisorMatches) {
    console.error(`Error parsing div for monkey: ${monkey}`);
    process.exit(1);
  }
  const divisor = BigInt(parseInt(divisorMatches[1], 10));

  const trueMonkeyMatches = monkey.match(/If true: throw to monkey ([^\n]+)/);
  if (!trueMonkeyMatches) {
    console.error(`Error parsing true monkey for monkey: ${monkey}`);
    process.exit(1);
  }
  const trueMonkeyIndex = parseInt(trueMonkeyMatches[1], 10);

  const falseMonkeyMatches = monkey.match(/If false: throw to monkey ([^\n]+)/);
  if (!falseMonkeyMatches) {
    console.error(`Error parsing false monkey for monkey: ${monkey}`);
    process.exit(1);
  }
  const falseMonkeyIndex = parseInt(falseMonkeyMatches[1], 10);

  return {
    items,
    f,
    testDivisor: divisor,
    trueMonkeyIndex,
    falseMonkeyIndex,
    inspections: BigInt(0),
  };
}

function operation(o: string, operandStr: string): (n: bigint) => bigint {
  if (operandStr === "old") {
    if (o === "*") {
      return (n) => n * n;
    } else if (o === "+") {
      return (n) => n + n;
    }
  }
  const operand = BigInt(parseInt(operandStr, 10));
  if (o === "*") {
    return (n) => n * operand;
  } else if (o === "+") {
    return (n) => n + operand;
  }

  console.error(`Error parsing operation ${o} ${operandStr}`);
  process.exit(1);
}

function bigIntSort(a: BigInt, b: BigInt): number {
  return b > a ? 1 : b === a ? 0 : -1;
}

function bigIntProduct(xs: bigint[]): bigint {
  return xs.reduce((a, b) => a * b, BigInt(1));
}

type Monkey = {
  items: bigint[];
  f: (n: bigint) => bigint;
  testDivisor: bigint;
  trueMonkeyIndex: number;
  falseMonkeyIndex: number;
  inspections: bigint;
};

main();
