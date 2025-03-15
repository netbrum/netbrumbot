import fs from "fs"
import { BOT_MENTION } from "./app.js";
import { capitalize } from "./helpers/capitalize.js";

export enum Command {
  Help,
  Unknown
}

export function getCommand(comment: string): Command {
  const c = capitalize(comment.replace(BOT_MENTION, "")) as keyof typeof Command;
  return Command[c] ?? Command.Unknown;
}

const getResponseFilePath = (command: Command) => {
  const dirname = import.meta.dirname;

  switch (command) {
    case Command.Help:
      return dirname + "/../responses/help.md";
    case Command.Unknown:
      return dirname + "/../responses/unknown.md"
  }
}

export function getResponse(command: Command): string {
  const file = getResponseFilePath(command);
  return fs.readFileSync(file, "utf8")
}
