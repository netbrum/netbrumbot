import { BOT_MENTION } from "./app.js";

export enum Command {
  HELP = "HELP",
  RETRY = "RETRY",
  UNKNOWN = "UNKNOWN"
}

export function getCommand(comment: string): Command {
  const c = comment.replace(BOT_MENTION, "").toUpperCase() as keyof typeof Command;
  return Command[c] ?? Command.UNKNOWN;
}
