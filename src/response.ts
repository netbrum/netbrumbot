import fs from "fs"
import { Command } from "./command.js";

export const RESPONSES = {
  HELP: "../responses/help.md",
  UNKNOWN: "../responses/unknown.md",
  PREVIEW: "../responses/preview.md",
  PREVIEW_SETUP_ERROR: "../responses/preview-setup-error.md",
  PREVIEW_DELETE_ERROR: "../responses/preview-delete-error.md"
} as const;

export type ResponseKey = keyof typeof RESPONSES;

function getResponseFilePath(key: ResponseKey) {
  const dirname = import.meta.dirname;
  return `${dirname}/${RESPONSES[key]}}`;
}

export function getResponse(key: ResponseKey | Command): string {
  const file = getResponseFilePath(key.toString() as ResponseKey);
  return fs.readFileSync(file, "utf8");
}
