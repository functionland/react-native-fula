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
