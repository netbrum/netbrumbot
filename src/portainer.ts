const HOST = "http://127.0.0.1:9000"
const ENVIRONMENT_ID = 1;

export class PortainerClient {
  token: string
  host: string
  environmentId: number

  constructor(token: string, host: string, environmentId: number) {
    this.token = token;
    this.host = host;
    this.environmentId = environmentId;
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

  async request(e: string, body?: object, headers?: HeadersInit): Promise<unknown> {
    const [method, endpoint] = e.split(" ");

    const response = await fetch(`${this.host}/api${endpoint}`, {
      method,
      headers: {
        ...headers,
        authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(body)
    });

    return response.json();
  }
}
