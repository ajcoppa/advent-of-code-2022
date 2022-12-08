#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const session: string[] = await loadFromFile("07-input.txt");
  console.log(`Part 1: ${partOne(session)}`);
}

function partOne(session: string[]): number {
  const unparsedCommands: string[] = session.join("\n").split("$ ").slice(1);
  const commands = unparsedCommands.map(parseCommand);
  const endState = runSession(commands);

  let relevantSize = 0;
  endState.tree.forEach((_, directory) => {
    const sizeOfThisDir = size(directory, endState.tree);
    if (sizeOfThisDir <= 100000) {
      relevantSize += sizeOfThisDir;
    }
  });
  return relevantSize;
}

function runSession(commands: Command[]): SystemState {
  let state: SystemState = {
    workingDirectory: [],
    tree: new Map(),
  };
  commands.forEach((command) => {
    state = runCommand(state, command);
  });
  return state;
}

function runCommand(state: SystemState, command: Command): SystemState {
  let newState = { ...state };
  if (command.kind === "cd") {
    if (command.directory === "..") {
      newState.workingDirectory = state.workingDirectory.slice(0, -1);
    } else {
      newState.workingDirectory.push(command.directory);
    }
  } else if (command.kind === "ls") {
    newState.tree.set(state.workingDirectory.join(""), command.files);
  }

  return newState;
}

function size(filePath: string, tree: FileTree) {
  if (!tree.has(filePath)) {
    console.error(`Couldn't find filepath ${filePath} in tree`);
    process.exit(1);
  }

  let totalSize = 0;
  tree.forEach((files, path) => {
    if (path.startsWith(filePath)) {
      const allFileSize = sum(files.map((f) => f.size));
      totalSize += allFileSize;
    }
  });
  return totalSize;
}

function parseCommand(command: string): Command {
  const splitCommand = command.split("\n");
  // First word of first line is the command name
  const firstLine = splitCommand[0].split(" ");
  const commandName = firstLine[0];
  if (commandName === "ls") {
    return {
      kind: "ls",
      files: splitCommand
        .slice(1)
        .filter((f) => f !== "")
        .map(parseFile),
    };
  } else if (commandName === "cd") {
    return {
      kind: "cd",
      directory: firstLine[1],
    };
  } else {
    console.error(`Couldn't parse command ${command}`);
    process.exit(1);
  }
}

function parseFile(file: string): File {
  const splitString = file.split(" ");
  return {
    name: splitString[1],
    size: splitString[0] !== "dir" ? parseInt(splitString[0], 10) : 0,
  };
}

type SystemState = {
  workingDirectory: string[];
  tree: FileTree;
};

type File = {
  name: string;
  size: number;
};

type FileTree = Map<string, File[]>;

interface LS {
  kind: "ls";
  files: File[];
}

interface CD {
  kind: "cd";
  directory: string;
}

type Command = LS | CD;

main();
