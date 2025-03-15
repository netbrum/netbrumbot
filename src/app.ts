import { Probot } from "probot";
import { getCommand, getResponse } from "./command.js";

export const BOT_MENTION = "@netbrum ";

export default (app: Probot) => {
  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    const isPr = context.payload.issue.pull_request;

    if (context.isBot || !isPr || !comment.startsWith(BOT_MENTION)) return;

    const command = getCommand(comment);
    const response = context.issue({ body: getResponse(command) });

    return context.octokit.issues.createComment(response);
  })
};
