#!/usr/bin/env ts-node

import fs from "fs/promises";
import _ from "lodash";

async function main() {
  const text = await fs.readFile("11-input.txt", { encoding: "utf-8" });
  const monkeyStrings = text.split("\n\n");
  const monkeys: Monkey[] = parseMonkeys(monkeyStrings);
  console.log(`Part 1: ${partOne(monkeys)}`);
}

function partOne(monkeys: Monkey[]): number {
  let monkeyState = _.clone(monkeys);
  let round = 1;
  while (round <= 20) {
    monkeyState = runRound(monkeys);
    round++;
  }
  const topTwo = monkeys
    .sort((a, b) => b.inspections - a.inspections)
    .slice(0, 2);
  return topTwo[0].inspections * topTwo[1].inspections;
}

function runRound(monkeys: Monkey[]): Monkey[] {
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      const newValue = Math.floor(monkey.f(item) / 3);
      const whereToThrow = monkey.test(newValue)
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
  const items = itemMatches[1].split(",").map((s) => parseInt(s, 10));

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
  const divisor = parseInt(divisorMatches[1], 10);

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
    test: (n) => n % divisor === 0,
    trueMonkeyIndex,
    falseMonkeyIndex,
    inspections: 0,
  };
}

function operation(o: string, operandStr: string): (n: number) => number {
  if (operandStr === "old") {
    if (o === "*") {
      return (n) => n * n;
    } else if (o === "+") {
      return (n) => n + n;
    }
  }
  const operand = parseInt(operandStr, 10);
  if (o === "*") {
    return (n) => n * operand;
  } else if (o === "+") {
    return (n) => n + operand;
  }

  console.error(`Error parsing operation ${o} ${operandStr}`);
  process.exit(1);
}

type Monkey = {
  items: number[];
  f: (n: number) => number;
  test: (n: number) => boolean;
  trueMonkeyIndex: number;
  falseMonkeyIndex: number;
  inspections: number;
};

main();
