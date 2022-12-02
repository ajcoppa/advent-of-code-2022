#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const rounds: string[] = await loadFromFile("02-input.txt");
  console.log(`Part 1: ${partOne(rounds)}`);
  console.log(`Part 2: ${partTwo(rounds)}`);
}

function partOne(rounds: string[]): number {
  const scores: number[] = rounds.map(scoreRoundOne);
  return sum(scores);
}

function partTwo(rounds: string[]): number {
  const scores: number[] = rounds.map(scoreRoundTwo);
  return sum(scores);
}

function scoreRoundOne(round: string): number {
  const choices: Choice[] = round.split(" ").map(parseChoice);
  const theirChoice = choices[0];
  const myChoice = choices[1];
  return scoreChoice(myChoice) + scoreGame(theirChoice, myChoice);
}

function scoreRoundTwo(round: string): number {
  const splitStr = round.split(" ");
  const theirChoice: Choice = parseChoice(splitStr[0]);
  const myGoal: Goal = parseGoal(splitStr[1]);
  const myChoice: Choice = figureOutMyChoice(theirChoice, myGoal);
  return scoreChoice(myChoice) + scoreGame(theirChoice, myChoice);
}

function figureOutMyChoice(theirChoice: Choice, myGoal: Goal): Choice {
  if (myGoal === Goal.Draw) {
    return theirChoice;
  } else if (
    (theirChoice === Choice.Rock && myGoal === Goal.Win) ||
    (theirChoice === Choice.Scissors && myGoal === Goal.Loss)
  ) {
    return Choice.Paper;
  } else if (
    (theirChoice === Choice.Rock && myGoal === Goal.Loss) ||
    (theirChoice === Choice.Paper && myGoal === Goal.Win)
  ) {
    return Choice.Scissors;
  } else {
    return Choice.Rock;
  }
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

function parseGoal(str: string): Goal {
  if (str === "X") {
    return Goal.Loss;
  } else if (str === "Y") {
    return Goal.Draw;
  } else {
    return Goal.Win;
  }
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

enum Goal {
  Win,
  Loss,
  Draw,
}

main();
