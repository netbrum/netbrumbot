declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN?: string
      GITHUB_CLIENT_ID?: string
      GITHUB_CLIENT_SECRET?: string
      PORTAINER_HOST?: string
      PORTAINER_ACCESS_TOKEN?: string
      PORTAINER_ENDPOINT_ID?: string
      PORTAINER_SWARM_ID?: string
    }
  }
}

export { }
