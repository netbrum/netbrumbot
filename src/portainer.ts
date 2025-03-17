import { PullRequest } from "./app.js";
import { readEnvOptions } from "./helpers/read-env-options.js";
import { CreateStack, Stack, Service } from "./portainer-types/index.js";
import type { Repository } from "@octokit/webhooks-types"


type Method = "GET" | "POST" | "DELETE";

export class PortainerClient {
  token: string
  host: string
  endpointId: number
  swarmId: string

  constructor() {
    const { portainerAccessToken, portainerHost, portainerEndpontId, portainerSwarmId } = readEnvOptions();

    if (!portainerAccessToken || !portainerHost || !portainerEndpontId || !portainerSwarmId) {
      throw new Error("Missing portainer environment variables");
    }

    this.token = portainerAccessToken;
    this.host = portainerHost;
    this.endpointId = portainerEndpontId;
    this.swarmId = portainerSwarmId;
  }

  async request(method: Method, endpoint: string, body?: object): Promise<Response> {
    const response = await fetch(`${this.host}/api${endpoint}`, {
      method,
      headers: {
        "X-API-Key": this.token
      },
      body: JSON.stringify(body)
    });

    return response;
  }

  async getEndpointIp(): Promise<string> {
    const response = await this.request("GET", `/endpoints/${this.endpointId}`);
    return (await response.json()).PublicURL;
  }

  async getStacks(): Promise<Stack[]> {
    // The EndpointID filter parameter seemingly does not work with swarm stacks..?
    // https://github.com/portainer/portainer/blob/e1f9b69cd562538e46ce2d7d5a4a32851007f37e/api/http/handler/stacks/stack_list.go#L126-L135
    //
    // We just filter it ourselves.
    const response = await this.request("GET", "/stacks");
    const stacks: Stack[] = await response.json();

    return stacks.filter((stack) => stack.EndpointId == this.endpointId);
  }

  async deleteStack(stackId: number): Promise<boolean> {
    const response = await this.request("DELETE", `/stacks/${stackId}?endpointId=${this.endpointId}`);
    return response.ok;
  }

  async createStack(pullRequest: PullRequest, repository: Repository): Promise<CreateStack> {
    const response = await this.request("POST", `/stacks/create/swarm/repository?endpointId=${this.endpointId}`, {
      fromAppTemplate: false,
      name: pullRequest.data.node_id,
      repositoryAuthentication: false,
      repositoryReferenceName: "refs/heads/main",
      repositoryURL: repository.html_url,
      composeFile: "testing.yml",
      tlsskipVerify: false,
      swarmID: this.swarmId
    });

    return await response.json();
  }

  async getStackServices(prNodeId: string): Promise<Service[]> {
    const response = await this.request("GET", `/endpoints/${this.endpointId}/docker/services`);
    const services: Service[] = await response.json();

    return services.filter((service) => {
      return service.Spec.Labels["com.docker.stack.namespace"] === prNodeId
    });
  }

  /**
  * Closes all stacks matching the pull request node id.
  */
  async closePreview(prNodeId: string): Promise<void> {
    const stacks = (await this.getStacks()).filter((stack) => stack.Name === prNodeId);

    for (const stack of stacks) {
      const success = await this.deleteStack(stack.Id);

      if (!success) {
        throw new Error(`Error deleting stack ${stack.Name} (ID: ${stack.Id})`)
      }
    }
  }

  /**
  * Returns the host and port for the newly created stack.
  */
  async setupPreview(pullRequest: PullRequest, repository: Repository): Promise<[string, number]> {
    await this.closePreview(pullRequest.data.node_id);

    // Portainer does not like deleting and creating a stack with
    // the same name immediately.
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const createStack = await this.createStack(pullRequest, repository);
    const stackServices = await this.getStackServices(createStack.Name);

    if (stackServices.length === 0) {
      throw new Error(`No services found for stack ${createStack.Name} (ID: ${createStack.Id})`);
    }

    const host = await this.getEndpointIp();
    const ports = stackServices[0].Endpoint.Ports;

    if (ports.length === 0) {
      throw new Error(`No ports found for service ${stackServices[0].Spec.Name} (ID: ${stackServices[0].ID})`);
    }

    return [host, ports[0].PublishedPort];
  }
}
