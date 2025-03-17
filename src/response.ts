import fs from "fs"
import { Command } from "./command.js";
import path from "path";

export const RESPONSES = {
  HELP: "help.md",
  UNKNOWN: "unknown.md",
  PREVIEW: "preview.md",
  PREVIEW_SETUP_ERROR: "preview-setup-error.md",
  PREVIEW_DELETE_ERROR: "preview-delete-error.md"
} as const;

export type ResponseKey = keyof typeof RESPONSES;

function getResponseFilePath(key: ResponseKey) {
  const dirname = import.meta.dirname;
  return path.join(dirname, "/../responses/", RESPONSES[key]);
}

export function getResponse(key: ResponseKey | Command): string {
  const file = getResponseFilePath(key.toString() as ResponseKey);
  return fs.readFileSync(file, "utf8");
}
