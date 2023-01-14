    export interface SeededResponse {
    seed: string;
    account: string;
    }
    
    export interface AccountExistsResponse {
    account: string;
    exists: boolean;
    }
    
    export interface PoolCreateResponse {
    owner: string;
    poolID: number;
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

    export interface PoolRequest {
    poolID: number;
    account: string;
    voted: string[];
    positiveVotes: number;
    peerID: string;
    }

    export interface Pool {
    poolID: number;
    owner: string;
    poolName: string;
    parent: string;
    participants: string[];
    }

    export interface ManifestMetadata {
    job: ManifestJob;
    }

    export interface ManifestJob {
    work: string;
    engine: string;
    uri: string;
    }