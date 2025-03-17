import { Probot } from "probot";
import { Command, getCommand } from "./command.js";
import { getResponse } from "./response.js";
import { PortainerClient } from "./portainer.js";
import { PullRequest, SimplifiedObject, BaseWebhookEvent } from "./probot-types.js";

export const BOT_MENTION = "@netbrum ";

export default (app: Probot) => {
  const portainer = new PortainerClient();

  const createSetupPreview = async (pullRequest: PullRequest, context: BaseWebhookEvent<"check_suite" | "issue_comment"> & SimplifiedObject) => {
    try {
      const [host, port] = await portainer.setupPreview(pullRequest as PullRequest, context.payload.repository);

      await context.octokit.issues.createComment(context.issue({
        issue_number: pullRequest.data.number,
        body: getResponse("PREVIEW").replace("$HOST", `[${host}:${port}](http://${host}:${port})`)
      }))
    } catch (error) {
      if (!(error instanceof Error)) return;

      await context.octokit.issues.createComment(context.issue({
        issue_number: pullRequest.data.number,
        body: getResponse("PREVIEW_SETUP_ERROR").replace("$ERROR", error.message)
      }))
    }
  }

  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    const isPullRequest = context.payload.issue.pull_request;

    if (context.isBot || !isPullRequest || !comment.startsWith(BOT_MENTION)) return;

    const command = getCommand(comment);

    const pullRequest = await context.octokit.pulls.get({
      ...context.issue(),
      pull_number: context.payload.issue.number
    });

    switch (command) {
      case Command.RETRY: {
        await createSetupPreview(pullRequest as PullRequest, context);
        break;
      }
      default:
        await context.octokit.issues.createComment(context.issue({ body: getResponse(command) }));
        break;
    }
  })

  app.on("check_suite.completed", async (context) => {
    if (context.payload.check_suite.conclusion !== "success") return;

    const checkSuitePullRequest = context.payload.check_suite.pull_requests[0];
    if (!checkSuitePullRequest) return;

    const pullRequest = await context.octokit.pulls.get({
      ...context.issue(),
      pull_number: checkSuitePullRequest.number
    });

    await createSetupPreview(pullRequest as PullRequest, context);
  });

  app.on("pull_request.closed", async (context) => {
    const pullRequest = context.payload.pull_request;

    try {
      await portainer.deletePreview(pullRequest.node_id);
    } catch (error) {
      if (!(error instanceof Error)) return;

      await context.octokit.issues.createComment(context.issue({
        issue_number: pullRequest.number,
        body: getResponse("PREVIEW_DELETE_ERROR").replace("$ERROR", error.message)
      }))
    }
  });
};
