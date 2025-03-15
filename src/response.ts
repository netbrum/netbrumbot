import fs from "fs"
import { Command } from "./command.js";

export const RESPONSES = {
  HELP: "../responses/help.md",
  UNKNOWN: "../responses/unknown.md",
  PREVIEW: "../responses/preview.md"
} as const;

export type ResponseKey = keyof typeof RESPONSES;

function getResponseFilePath(key: ResponseKey) {
  const dirname = import.meta.dirname;

  const getRelativePath = () => {
    switch (key) {
      case "HELP":
        return RESPONSES.HELP;
      case "PREVIEW":
        return RESPONSES.PREVIEW;
      case "UNKNOWN":
        return RESPONSES.UNKNOWN;
    }
  }

  return `${dirname}/${getRelativePath()}`;
}

export function getResponse(key: ResponseKey | Command): string {
  const file = getResponseFilePath(key.toString() as ResponseKey);
  return fs.readFileSync(file, "utf8");
}
