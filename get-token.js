import { App } from "octokit";
import open from "open";
import { readEnvOptions } from "./lib/helpers/read-env-options.js";

const { secret, clientId, clientSecret, appId, privateKey } = readEnvOptions();

const app = new App({
  appId,
  privateKey,
  oauth: {
    clientId,
    clientSecret,
  },
  webhooks: { secret },
});

const { authentication } = await app.oauth.createToken({
  async onVerification(verification) {
    open(verification.verification_uri);
    console.log("Enter code: %s", verification.user_code);
  },
});

console.log("Token: %s", authentication.token);
