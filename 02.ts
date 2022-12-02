#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const rounds: string[] = await loadFromFile("02-input.txt");
  console.log(`Part 1: ${partOne(rounds)}`);
}

function partOne(rounds: string[]): number {
  const scores: number[] = rounds.map(scoreRound);
  return sum(scores);
}

function scoreRound(round: string): number {
  const choices: Choice[] = round.split(" ").map(parseChoice);
  const theirChoice = choices[0];
  const myChoice = choices[1];
  return scoreChoice(myChoice) + scoreGame(theirChoice, myChoice);
}

function parseChoice(str: string): Choice {
  if (str === "X" || str === "A") {
    return Choice.Rock;
  } else if (str === "Y" || str === "B") {
    return Choice.Paper;
  } else if (str === "Z" || str === "C") {
    return Choice.Scissors;
  }

  console.error(`Error – unhandled input: ${str}`);
  process.exit(1);
}

function scoreChoice(choice: Choice) {
  if (choice === Choice.Rock) {
    return 1;
  } else if (choice === Choice.Paper) {
    return 2;
  } else if (choice === Choice.Scissors) {
    return 3;
  } else {
    return 0;
  }
}

function scoreGame(theirChoice: Choice, myChoice: Choice): number {
  if (theirChoice === myChoice) {
    return 3;
  } else if (
    (myChoice === Choice.Rock && theirChoice === Choice.Scissors) ||
    (myChoice === Choice.Paper && theirChoice === Choice.Rock) ||
    (myChoice === Choice.Scissors && theirChoice === Choice.Paper)
  ) {
    return 6;
  } else {
    return 0;
  }
}

enum Choice {
  Rock,
  Paper,
  Scissors,
}

main();
