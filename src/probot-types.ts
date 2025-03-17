import { Context } from "probot";
import type { Endpoints } from "@octokit/types";
import type { WebhookEventName, WebhookEventMap, WebhookEvent } from "@octokit/webhooks-types"

export interface BaseWebhookEvent<TName extends WebhookEventName> {
  id: string;
  name: TName;
  payload: WebhookEventMap[TName];
}

export type SimplifiedObject = Omit<Context, keyof WebhookEvent>;

export type WebhookContext<TName extends WebhookEventName> = BaseWebhookEvent<TName> & SimplifiedObject;

export type PullRequest = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"];
