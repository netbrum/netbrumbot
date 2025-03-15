import { ApplicationFunction, Logger, Options, Probot, ProbotOctokit, Server } from "probot";
import { ServerOptions } from "probot/lib/types.js";
import { readEnvOptions } from "./helpers/read-env-options.js";
import { getLog } from "./helpers/get-log.js";

type AdditionalOptions = {
  Octokit?: typeof ProbotOctokit;
  githubToken?: string
  log?: Logger;
};

export async function run(
  appFnOrArgv: ApplicationFunction,
  additionalOptions?: AdditionalOptions,
) {
  const envOptions = readEnvOptions();

  const {
    // log options
    logLevel: level,
    logFormat,
    logLevelInString,
    logMessageKey,
    sentryDsn,

    // server options
    host,
    port,
    webhookPath,
    webhookProxy,

    // probot options
    appId,
    privateKey,
    redisConfig,
    secret,
    baseUrl,
    githubToken
  } = envOptions

  const log = getLog({
    level,
    logFormat,
    logLevelInString,
    logMessageKey,
    sentryDsn,
  });

  const probotOptions: Options = {
    appId,
    privateKey,
    redisConfig,
    secret,
    baseUrl,
    githubToken,
    log: additionalOptions?.log || log.child({ name: "probot" }),
    Octokit: additionalOptions?.Octokit || undefined
  };

  const serverOptions: ServerOptions = {
    host,
    port,
    webhookPath,
    webhookProxy,
    log: log.child({ name: "server" }),
    Probot: Probot.defaults(probotOptions),
  };


  if (!appId) {
    throw new Error(
      "App ID is missing, and is required to run in production mode. " +
      "To resolve, ensure the APP_ID environment variable is set.",
    );
  }

  if (!privateKey) {
    throw new Error(
      "Certificate is missing, and is required to run in production mode. " +
      "To resolve, ensure either the PRIVATE_KEY or PRIVATE_KEY_PATH environment variable is set and contains a valid certificate",
    );
  }

  const server = new Server(serverOptions);
  await server.load(appFnOrArgv);
  await server.start();

  return server;
}
