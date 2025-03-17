export interface CreateStack {
  AdditionalFiles: string[]
  AutoUpdate: AutoUpdate
  EndpointId: number
  EntryPoint: string
  Env: Env[]
  Id: number
  Name: string
  Option: Option
  ResourceControl: ResourceControl
  Status: number
  SwarmId: string
  Type: number
  createdBy: string
  creationDate: number
  fromAppTemplate: boolean
  gitConfig: GitConfig
  namespace: string
  projectPath: string
  updateDate: number
  updatedBy: string
}

export interface AutoUpdate {
  forcePullImage: boolean
  forceUpdate: boolean
  interval: string
  jobID: string
  webhook: string
}

export interface Env {
  name: string
  value: string
}

export interface Option {
  prune: boolean
}

export interface ResourceControl {
  AccessLevel: number
  AdministratorsOnly: boolean
  Id: number
  OwnerId: number
  Public: boolean
  ResourceId: string
  SubResourceIds: string[]
  System: boolean
  TeamAccesses: TeamAccess[]
  Type: number
  UserAccesses: UserAccess[]
}

export interface TeamAccess {
  AccessLevel: number
  TeamId: number
}

export interface UserAccess {
  AccessLevel: number
  UserId: number
}

export interface GitConfig {
  authentication: Authentication
  configFilePath: string
  configHash: string
  referenceName: string
  tlsskipVerify: boolean
  url: string
}

export interface Authentication {
  gitCredentialID: number
  password: string
  username: string
}
