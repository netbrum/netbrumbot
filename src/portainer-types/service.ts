
export type Labels = { [key: string]: any };

export interface Service {
  CreatedAt: string
  Endpoint: Endpoint
  ID: string
  PreviousSpec: PreviousSpec
  Spec: Spec
  UpdatedAt: string
  Version: Version
}

export interface Endpoint {
  Ports: Port[]
  Spec: Spec
  VirtualIPs: VirtualIp[]
}

export interface Port {
  Protocol: string
  PublishMode: string
  PublishedPort: number
  TargetPort: number
}


export interface VirtualIp {
  Addr: string
  NetworkID: string
}

export interface PreviousSpec {
  EndpointSpec: EndpointSpec
  Labels: Labels
  Mode: Mode
  Name: string
  TaskTemplate: TaskTemplate
}

export interface EndpointSpec {
  Mode: string
  Ports: Port[]
}

export interface Mode {
  Replicated: Replicated
}

export interface Replicated {
  Replicas: number
}

export interface TaskTemplate {
  ContainerSpec: ContainerSpec
  ForceUpdate: number
  Networks: Network[]
  Placement: Placement
  Resources: Resources
  Runtime: string
}

export interface ContainerSpec {
  Args: string[]
  Image: string
  Isolation: string
  Labels: Labels
  Mounts: Mount[]
  Privileges: Privileges
}

export interface Mount {
  Source: string
  Target: string
  Type: string
  VolumeOptions: VolumeOptions
}

export interface VolumeOptions {
  Labels: Labels
}

export interface Privileges {
  CredentialSpec: any
  NoNewPrivileges: boolean
  SELinuxContext: any
}

export interface Network {
  Aliases: string[]
  Target: string
}

export interface Placement {
  Constraints: string[]
  Platforms: Platform[]
}

export interface Platform {
  Architecture?: string
  OS: string
}

export interface Resources { }

export interface Spec {
  EndpointSpec: EndpointSpec
  Labels: Labels
  Mode: Mode
  Ports: Port[]
  Name: string
  TaskTemplate: TaskTemplate
}

export interface EndpointSpec {
  Mode: string
  Ports: Port[]
}

export interface ContainerSpec2 {
  Args: string[]
  Image: string
  Isolation: string
  Labels: Labels
  Mounts: Mount[]
  Privileges: Privileges
}

export interface Version {
  Index: number
}
