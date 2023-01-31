import Fula from '../interfaces/fulaNativeModule';
import type * as BType from '../types/blockchain';

/*
createAccount: This function takes a seed argument, which is used to create an account. The seed must start with "/". The function returns a promise of an object that contains the seed and the account that was created.
*/
export const createAccount = async (
  seed: string, //seed that is used to create the account. It must start with "/"
): Promise<BType.SeededResponse> => {
  console.log(
    'createAccount in react-native started',
    seed
  );
  try {
    const res = await Fula.createAccount(seed);
    let jsonRes = JSON.parse(res) as BType.SeededResponse;
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

/*
checkAccountExists: This function takes an account argument, and returns a promise of an object that contains the account and a boolean exists flag. If exists is true, it means the account exists, otherwise, the account does not exist
*/
export const checkAccountExists = async (
  account: string,
): Promise<BType.AccountExistsResponse> => {
  console.log(
    'checkAccountExists in react-native started',
    account
  );
  try {
    const res = await Fula.checkAccountExists(account);
    const jsonRes = JSON.parse(res) as BType.AccountExistsResponse;
    return jsonRes;
  } catch (error) {
    throw error
  }
};

/*
createPool: This function takes two arguments: seed and poolName. The seed is used to identify the account that is creating the pool, and the poolName is the name of the pool being created. The function returns a promise of an object that contains the owner of the pool and the poolID of the created pool.
*/
export const createPool = async (seed: string, poolName: string): Promise<BType.PoolCreateResponse> => {
  console.log(
  'createPool in react-native started',
  seed,
  poolName
  );
  try {
    const res = await Fula.createPool(seed, poolName);
    const jsonRes = JSON.parse(res) as BType.PoolCreateResponse;
    return jsonRes;
  } catch (error) {
    throw error;
  }
};
  
/*
listPools: This function takes no arguments and returns a promise of an object that contains a list of pools. Each pool in the list contains the poolID, owner, poolName, parent, and participants of the pool
*/
export const listPools = async (): Promise<BType.Pool[]> => {
  console.log(
  'listPools in react-native started'
  );
  try {
    const res = await Fula.listPools();
    let jsonRes = JSON.parse(res) as BType.PoolListResponse;
    return jsonRes?.pools;
  } catch (error) {
    throw error
  }
};

/*
joinPool: This function takes two arguments: seed and poolID. The seed is used to identify the account that is joining the pool, and the poolID is the ID of the pool the account is joining. The function returns a promise of an object that contains the account joining the pool and the poolID of the joined pool.
*/

export const joinPool = async (seed: string, poolID: number): Promise<BType.PoolJoinResponse> => {
  console.log(
  'joinPool in react-native started',
  seed,
  poolID
  );
  try {
    const res = await Fula.joinPool(seed, poolID);
    const jsonRes: BType.PoolJoinResponse = JSON.parse(res);
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

/*
leavePool: This function takes two arguments: seed and poolID. The seed is used to identify the account that is leaving the pool, and the poolID is the ID of the pool the account is leaving. The function returns a promise of an object that contains the `
*/

export const leavePool = async (seed: string, poolID: number): Promise<BType.PoolLeaveResponse> => {
  console.log(
  'leavePool in react-native started',
  seed,
  poolID
  );
  try {
    let res = await Fula.leavePool(seed, poolID);
    let jsonRes: BType.PoolLeaveResponse = JSON.parse(res);
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

export const cancelPoolJoin = async (seed: string, poolID: number): Promise<BType.PoolCancelJoinResponse> => {
  console.log(
    'cancelPoolJoin in react-native started',
    seed,
    poolID
  );
  try {
    let res = await Fula.cancelPoolJoin(seed, poolID);
    let jsonRes = JSON.parse(res) as BType.PoolCancelJoinResponse;
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

export const listPoolJoinRequests = async (poolID: number): Promise<BType.PoolRequestsResponse> => {
  console.log(
    'listPoolJoinRequests in react-native started',
    poolID
  );
  try {
    const res = await Fula.listPoolJoinRequests(poolID);
    const jsonRes = JSON.parse(res) as BType.PoolRequestsResponse;
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

/*
seed is used to authorize the request.
poolID is the ID of the pool in which the account is requesting to join.
account is the account that is requesting to join the pool.
accept is a boolean value that indicates whether to accept or reject the join request.
It returns a promise of BType.PoolVoteResponse which includes the account and poolID
*/
export const votePoolJoinRequest = async (seed: string, poolID: number, account: string, accept: boolean): Promise<BType.PoolVoteResponse> => {
  console.log(
    'votePoolJoinRequest in react-native started',
    seed,
    poolID,
    account,
    accept
  );
  try {
    let res = await Fula.votePoolJoinRequest(seed, poolID, account, accept);
    let jsonRes = JSON.parse(res) as BType.PoolVoteResponse;
    return jsonRes;
  } catch (error) {
    throw error
  }
};
/*
It takes four arguments:

seed is used to authorize the request.
poolID is the ID of the pool in which the replication request is made.
replicationFactor is the number of copies of the content to be stored.
cid is the content identifier of the content to be replicated.
It returns a promise of BType.ManifestUploadResponse which includes the uploader, storage, ManifestMetadata, and poolID
*/
export const newReplicationRequest = async (seed: string, poolID: number, replicationFactor: number, cid: string): Promise<BType.ManifestUploadResponse> => {
  console.log(
  'newReplicationRequest in react-native started',
  seed,
  poolID,
  replicationFactor,
  cid
  );
  try {
    const res = await Fula.newReplicationRequest(seed, poolID, replicationFactor, cid);
    const jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

/*
It takes four arguments:

seed is used to authorize the request.
poolID is the ID of the pool in which the replication request is made.
uploader is the account of the user making the request
cid is the content identifier of the content to be stored.
It returns a promise of BType.ManifestUploadResponse which includes the uploader, storage, ManifestMetadata, and poolID
*/
export const newStoreRequest = async (seed: string, poolID: number, uploader: string, cid: string): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'newStoreRequest in react-native started',
    seed,
    poolID,
    uploader,
    cid
  );
  try {
    const res = await Fula.newStoreRequest(seed, poolID, uploader, cid);
    const jsonRes = JSON.parse(res) as BType.ManifestUploadResponse;
    return jsonRes;
  } catch (error) {
    throw error
  }
};


/*
It takes one argument:

poolID is the ID of the pool for which the replication requests are listed
It returns a promise of BType.ManifestUploadResponse[] which is an array of the replication requests, including the uploader, storage, ManifestMetadata, and poolID
*/
export const listAvailableReplicationRequests = async (poolID: number): Promise<BType.ManifestUploadResponse[]> => {
  console.log(
    'listAvailableReplicationRequests in react-native started',
    poolID
  );
  try {
    const res = await Fula.listAvailableReplicationRequests(poolID);
    const jsonRes = JSON.parse(res) as  BType.ManifestUploadResponse[];
    return jsonRes;
  } catch (error) {
    throw error
  }
};

/*
It takes three arguments:

seed is the seed of the account that is removing the replication request
poolID is the ID of the pool for which the replication request is being removed
cid is the content ID of the replication request being removed
It returns a promise of BType.ManifestUploadResponse which is the removed replication request, including the uploader, storage, ManifestMetadata, and poolID
*/
export const removeReplicationRequest = async (seed: string, poolID: number, cid: string): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeReplicationRequest in react-native started',
    seed,
    poolID,
    cid
  );
  try {
    let res = await Fula.removeReplicationRequest(seed, poolID, cid);
    let jsonRes = JSON.parse(res) as BType.ManifestUploadResponse;
    return jsonRes;
  } catch (error) {
    throw error
  }
};

/*
It takes four arguments:

seed is the seed of the account that is removing the storer
storer is the address of the storer that is being removed
poolID is the ID of the pool for which the storer is being removed
cid is the content ID of the replication request for which the storer is being removed
It returns a promise of BType.ManifestUploadResponse which is the replication request, including the uploader, storage, ManifestMetadata, and poolID after the storer has been removed.
*/
export const removeStorer = async (seed: string, storer: string, poolID: number, cid: string): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeStorer in react-native started',
    seed,
    storer,
    poolID,
    cid
  );
  try {
    const res = await Fula.removeStorer(seed, storer, poolID, cid);
    const jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
    return jsonRes;
  } catch (error) {
    throw error;
  }
};


/*
It takes four arguments:

seed is the seed of the account that is removing the stored replication
uploader is the address of the uploader that is being removed
poolID is the ID of the pool for which the stored replication is being removed
cid is the content ID of the replication request for which the stored replication is being removed
It returns a promise of BType.ManifestUploadResponse which is the replication request, including the uploader, storage, ManifestMetadata, and poolID after the stored replication has been removed.
*/
export const removeStoredReplication = async (seed: string, uploader: string, poolID: number, cid: string): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeStoredReplication in react-native started',
    seed,
    uploader,
    poolID,
    cid
  );
  try {
    let res = await Fula.removeStoredReplication(seed, uploader, poolID, cid);
    let jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
    return jsonRes;
  } catch (error) {
    throw error
  }
};
