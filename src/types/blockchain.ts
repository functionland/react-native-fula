export interface SeededResponse {
  seed: string;
  account: string;
}

export interface AccountExistsResponse {
  account: string;
  exists: boolean;
}

export interface AccountFundResponse {
  from: string;
  to: string;
  amount: string;
}

export interface PoolCreateResponse {
  owner: string;
  poolID: number;
}

export interface GetAccountResponse {
  account: string;
}

export interface AssetsBalanceResponse {
  amount: string;
}

export interface TransferToFulaResponse {
  msg: string;
  description: string;
}

export interface PoolJoinResponse {
  account: string;
  poolID: number;
}

export interface PoolCancelJoinResponse {
  account: string;
  poolID: number;
}

export interface PoolRequestsResponse {
  poolRequests: PoolRequest[];
}

export interface PoolListResponse {
  pools: Pool[];
}

export interface PoolVoteResponse {
  account: string;
  poolID: number;
}

export interface PoolLeaveResponse {
  account: string;
  poolID: number;
}

export interface ManifestUploadResponse {
  uploader: string;
  storage: string[];
  manifestMetadata: ManifestMetadata;
  poolID: number;
}

export interface ManifestBatchUploadResponse {
  storer: string;
  cid: string[];
  pool_id: number;
}

export interface PoolRequest {
  poolID: number;
  account: string;
  voted: string[];
  positiveVotes: number;
  peerID: string;
}

export interface PoolUsers {
  poolID: number;
  account: string;
  requestPoolId: string;
  peerID: string;
}

export interface Pool {
  poolID: number;
  creator: string;
  poolName: string;
  parent: string;
  participants: string[];
  region: string;
}

export interface ManifestMetadata {
  job: ManifestJob;
}

export interface ManifestJob {
  work: string;
  engine: string;
  uri: string;
}
export interface BloxFreeSpaceResponse {
  size: number;
  avail: number;
  used: number;
  used_percentage: number;
}
