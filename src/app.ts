import { Probot } from "probot";
import { getCommand } from "./command.js";
import { getResponse } from "./response.js";
import { PortainerClient } from "./portainer.js";
import type { Endpoints } from "@octokit/types";

export type PullRequest = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"];

export const BOT_MENTION = "@netbrum ";

export default (app: Probot) => {
  const portainer = new PortainerClient();

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

    const checkSuitePr = context.payload.check_suite.pull_requests[0];

    if (!checkSuitePr) return;

    const pr = await context.octokit.pulls.get({
      ...context.issue(),
      pull_number: checkSuitePr.number
    });

    const [host, port] = await portainer.setupPreview(pr as PullRequest, context.payload.repository);

    context.octokit.issues.createComment(context.issue({
      issue_number: pr.data.number,
      body: getResponse("PREVIEW").replace("%(host)", `[${host}:${port}](http://${host}:${port})`)
    }))
  });
};
