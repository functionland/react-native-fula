export interface wifiRemoveallResponse {
  status: boolean;
  msg: string;
}
export interface rebootResponse {
  status: boolean;
  msg: string;
}
export interface partitionResponse {
  status: boolean;
  msg: string;
}

export interface eraseBlDataResponse {
  status: boolean;
  msg: string;
}

export interface FetchContainerLogsResponse {
  status: boolean;
  msg: string;
}

export interface FindBestAndTargetInLogsResponse {
  best: string;
  target: string;
  err: string;
}

export interface GetFolderPathResponse {
  folder_path: string;
  size: string;
}

export interface GetDatastoreSizeResponse {
  size: string;
  storage_max: string;
  count: string;
  folder_path: string;
  version: string;
}

export interface PluginInfo {
  name: string;
  description: string;
  version: string;
  usage: {
    storage: string;
    compute: string;
    bandwidth: string;
    ram: string;
    gpu: string;
  };
  rewards: Array<{
    type: string;
    currency: string;
    link: string;
  }>;
  socials: Array<{
    telegram?: string;
    twitter?: string;
    email?: string;
    website?: string;
    discord?: string;
  }>;
  requiredInputs: Array<{
    name: string;
    instructions: string;
    type: string;
    default: string;
  }>;
  approved: boolean;
  installed: boolean;
}

export interface ListPluginsResponse {
  plugins: PluginInfo[];
}

export interface ListActivePluginsResponse {
  msg: string[] | string;
  status: boolean;
}

export interface InstallPluginResponse {
  status: boolean;
  msg: string;
}

export interface UninstallPluginResponse {
  status: boolean;
  msg: string;
}

export interface ShowPluginStatusResponse {
  status: string[];
}

export interface PluginParam {
  name: string;
  value: string;
}

export interface GetInstallOutputResponse {
  status: boolean;
  msg:
    | string
    | {
        [key: string]: string;
      };
}

export interface GetInstallStatusResponse {
  status: boolean;
  msg: string;
}

export interface UpdatePluginResponse {
  status: boolean;
  msg: string;
}
