import { Probot } from "probot";
import { getCommand } from "./command.js";
import { getResponse } from "./response.js";

export const BOT_MENTION = "@netbrum ";

export default (app: Probot) => {
  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    const isPr = context.payload.issue.pull_request;

    if (context.isBot || !isPr || !comment.startsWith(BOT_MENTION)) return;

    const command = getCommand(comment);
    const response = context.issue({ body: getResponse(command) });

    context.octokit.issues.createComment(response);
  })

  app.on("check_suite.completed", async (context) => {
    if (context.payload.check_suite.conclusion !== "success") return;

    const pr = context.payload.check_suite.pull_requests[0];

    // TODO: Portainer stuff...

    context.octokit.issues.createComment(context.issue({
      issue_number: pr.number,
      body: getResponse("PREVIEW").replace("%(host)", "[127.0.0.1:3030](http://127.0.0.1:3030)")
    }))
  });
};
