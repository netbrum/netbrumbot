// const HOST = "http://192.168.20.100:9000"
// const ENDPOINT_ID = 1;

type Method = "GET" | "POST" | "DELETE";

export class PortainerClient {
  token: string
  host: string
  endpointId: number
  swarmId: string

  constructor(token: string, host: string, endpointId: number, swarmId: string) {
    this.token = token;
    this.host = host;
    this.endpointId = endpointId;
    this.swarmId = swarmId;
  }

  static async getToken(host: string, username: string, password: string): Promise<string> {
    const response = await fetch(`${host}/api/auth`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });

    const { jwt } = await response.json();

    return jwt;
  }

  async request(method: Method, endpoint: string, body?: object): Promise<Response> {
    const response = await fetch(`${this.host}/api${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(body)
    });

    return response;
  }

  async getStacks(): Promise<any[]> {
    // The EndpointID filter parameter seemingly does not work with swarm stacks..?
    // https://github.com/portainer/portainer/blob/e1f9b69cd562538e46ce2d7d5a4a32851007f37e/api/http/handler/stacks/stack_list.go#L126-L135
    //
    // We just filter it ourselves.
    const response = await this.request("GET", "/stacks");
    const stacks: any[] = await response.json();

    return stacks.filter((stack) => stack.EndpointId === this.endpointId);
  }

  async deleteStack(stackId: number): Promise<boolean> {
    const response = await this.request("DELETE", `stacks/${stackId}?endpointId=${this.endpointId}`);
    return response.ok;
  }

  async createStack(prNodeId: string) {
    const response = await this.request("POST", `/stacks/create/swarm/repository?endpointId=${this.endpointId}`, {
      fromAppTemplate: false,
      name: prNodeId,
      repositoryAuthentication: false,
      repositoryReferenceName: "refs/heads/main",
      repositoryURL: "https://github.com/netbrum/netbrumbot",
      composeFile: "docker-compose.yml",
      tlsskipVerify: false,
      swarmID: this.swarmId
    });

    console.log(response);

    const body = await response.json();

    console.log(body);
  }
}
