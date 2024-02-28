import Fula from '../interfaces/fulaNativeModule';
import type * as BType from '../types/blockchain';
import { ApiPromise } from '@polkadot/api';
/*
createAccount: This function takes a seed argument, which is used to create an account. The seed must start with "/". The function returns a promise of an object that contains the seed and the account that was created.
*/
export const createAccount = (
  seed: string //seed that is used to create the account. It must start with "/"
): Promise<BType.SeededResponse> => {
  console.log('createAccount in react-native started', seed);
  let res1 = Fula.createAccount(seed)
    .then((res) => {
      try {
        let jsonRes: BType.SeededResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
checkAccountExists: This function takes an account argument, and returns a promise of an object that contains the account and a boolean exists flag. If exists is true, it means the account exists, otherwise, the account does not exist
*/
export const checkAccountExists = (
  account: string
): Promise<BType.AccountExistsResponse> => {
  console.log('checkAccountExists in react-native started', account);
  let res1 = Fula.checkAccountExists(account)
    .then((res) => {
      try {
        let jsonRes: BType.AccountExistsResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
accountFund: This function takes an account argument, and returns a promise of an object that contains the account and a boolean exists flag. If exists is true, it means the account exists, otherwise, the account does not exist
*/
export const accountFund = (
  account: string
): Promise<BType.AccountFundResponse> => {
  console.log('accountFund in react-native started', account);
  let res1 = Fula.accountFund(account)
    .then((res) => {
      try {
        let jsonRes: BType.AccountFundResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
createPool: This function takes two arguments: seed and poolName. The seed is used to identify the account that is creating the pool, and the poolName is the name of the pool being created. The function returns a promise of an object that contains the owner of the pool and the poolID of the created pool.
*/
export const createPool = (
  seed: string,
  poolName: string
): Promise<BType.PoolCreateResponse> => {
  console.log('createPool in react-native started', seed, poolName);
  let res1 = Fula.createPool(seed, poolName)
    .then((res) => {
      try {
        let jsonRes: BType.PoolCreateResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
  listPools: This function takes no arguments and returns a promise of an object that contains a list of pools. Each pool in the list contains the poolID, owner, poolName, parent, and participants of the pool
  */
export const listPools = (): Promise<BType.PoolListResponse> => {
  console.log('listPools in react-native started');
  let res1 = Fula.listPools()
    .then((res) => {
      try {
        let jsonRes: BType.PoolListResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
    joinPool: This function takes two arguments: seed and poolID. The seed is used to identify the account that is joining the pool, and the poolID is the ID of the pool the account is joining. The function returns a promise of an object that contains the account joining the pool and the poolID of the joined pool.
    */

export const joinPool = (poolID: number): Promise<BType.PoolJoinResponse> => {
  console.log('joinPool in react-native started', poolID);
  let res1 = Fula.joinPool(poolID.toString())
    .then((res) => {
      try {
        let jsonRes: BType.PoolJoinResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          console.error('Error parsing res in joining pool:', e);
          return res; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error joining pool:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res1;
};

/*
      leavePool: This function takes two arguments: seed and poolID. The seed is used to identify the account that is leaving the pool, and the poolID is the ID of the pool the account is leaving. The function returns a promise of an object that contains the `
      */

export const leavePool = (poolID: number): Promise<BType.PoolLeaveResponse> => {
  console.log('leavePool in react-native started', poolID);
  let res1 = Fula.leavePool(poolID.toString())
    .then((res) => {
      try {
        let jsonRes: BType.PoolLeaveResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

export const cancelPoolJoin = (
  poolID: number
): Promise<BType.PoolCancelJoinResponse> => {
  console.log('cancelPoolJoin in react-native started', poolID);
  let res1 = Fula.cancelPoolJoin(poolID.toString())
    .then((res) => {
      try {
        let jsonRes: BType.PoolCancelJoinResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};
export const listPoolJoinRequests = (
  poolID: string
): Promise<BType.PoolRequestsResponse> => {
  console.log('listPoolJoinRequests in react-native started', poolID);
  let res1 = Fula.listPoolJoinRequests(poolID)
    .then((res) => {
      try {
        let jsonRes: BType.PoolRequestsResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
          seed is used to authorize the request.
poolID is the ID of the pool in which the account is requesting to join.
account is the account that is requesting to join the pool.
accept is a boolean value that indicates whether to accept or reject the join request.
It returns a promise of BType.PoolVoteResponse which includes the account and poolID
*/
export const votePoolJoinRequest = (
  seed: string,
  poolID: number,
  account: string,
  accept: boolean
): Promise<BType.PoolVoteResponse> => {
  console.log(
    'votePoolJoinRequest in react-native started',
    seed,
    poolID,
    account,
    accept
  );
  let res1 = Fula.votePoolJoinRequest(seed, poolID, account, accept)
    .then((res) => {
      try {
        let jsonRes: BType.PoolVoteResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes four arguments:

seed is used to authorize the request.
poolID is the ID of the pool in which the replication request is made.
replicationFactor is the number of copies of the content to be stored.
cid is the content identifier of the content to be replicated.
It returns a promise of BType.ManifestUploadResponse which includes the uploader, storage, ManifestMetadata, and poolID
          */
export const batchUploadManifest = (
  api: ApiPromise | undefined, //this is just for compatibility with chainAPI inputs and is not used
  seed: string, //this is just for compatibility with chainAPI inputs and is not used
  cids_i: string[],
  poolId_i: string | number,
  replicationFactor_i: string | number
): Promise<BType.ManifestBatchUploadResponse> => {
  console.log(
    'newReplicationRequest in react-native started',
    api,
    seed,
    poolId_i,
    replicationFactor_i,
    cids_i
  );
  if (typeof poolId_i === 'number') {
    poolId_i = poolId_i.toString();
  }
  if (typeof replicationFactor_i === 'number') {
    replicationFactor_i = replicationFactor_i.toString();
  }
  let res1 = Fula.batchUploadManifest(cids_i, poolId_i, replicationFactor_i)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestBatchUploadResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes four arguments:

seed is used to authorize the request.
poolID is the ID of the pool in which the replication request is made.
uploader is the account of the user making the request
cid is the content identifier of the content to be stored.
It returns a promise of BType.ManifestUploadResponse which includes the uploader, storage, ManifestMetadata, and poolID
*/
export const newStoreRequest = (
  seed: string,
  poolID: number,
  uploader: string,
  cid: string
): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'newStoreRequest in react-native started',
    seed,
    poolID,
    uploader,
    cid
  );
  let res1 = Fula.newStoreRequest(seed, poolID, uploader, cid)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes one argument:

poolID is the ID of the pool for which the replication requests are listed
It returns a promise of BType.ManifestUploadResponse[] which is an array of the replication requests, including the uploader, storage, ManifestMetadata, and poolID
*/
export const listAvailableReplicationRequests = (
  poolID: string
): Promise<BType.ManifestUploadResponse[]> => {
  console.log(
    'listAvailableReplicationRequests in react-native started',
    poolID
  );
  let res1 = Fula.listAvailableReplicationRequests(poolID)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestUploadResponse[] = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes three arguments:

seed is the seed of the account that is removing the replication request
poolID is the ID of the pool for which the replication request is being removed
cid is the content ID of the replication request being removed
It returns a promise of BType.ManifestUploadResponse which is the removed replication request, including the uploader, storage, ManifestMetadata, and poolID
*/
export const removeReplicationRequest = (
  seed: string,
  poolID: number,
  cid: string
): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeReplicationRequest in react-native started',
    seed,
    poolID,
    cid
  );
  let res1 = Fula.removeReplicationRequest(seed, poolID, cid)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes four arguments:

seed is the seed of the account that is removing the storer
storer is the address of the storer that is being removed
poolID is the ID of the pool for which the storer is being removed
cid is the content ID of the replication request for which the storer is being removed
It returns a promise of BType.ManifestUploadResponse which is the replication request, including the uploader, storage, ManifestMetadata, and poolID after the storer has been removed.
*/
export const removeStorer = (
  seed: string,
  storer: string,
  poolID: number,
  cid: string
): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeStorer in react-native started',
    seed,
    storer,
    poolID,
    cid
  );
  let res1 = Fula.removeStorer(seed, storer, poolID, cid)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
It takes four arguments:

seed is the seed of the account that is removing the stored replication
uploader is the address of the uploader that is being removed
poolID is the ID of the pool for which the stored replication is being removed
cid is the content ID of the replication request for which the stored replication is being removed
It returns a promise of BType.ManifestUploadResponse which is the replication request, including the uploader, storage, ManifestMetadata, and poolID after the stored replication has been removed.
*/
export const removeStoredReplication = (
  seed: string,
  uploader: string,
  poolID: number,
  cid: string
): Promise<BType.ManifestUploadResponse> => {
  console.log(
    'removeStoredReplication in react-native started',
    seed,
    uploader,
    poolID,
    cid
  );
  let res1 = Fula.removeStoredReplication(seed, uploader, poolID, cid)
    .then((res) => {
      try {
        let jsonRes: BType.ManifestUploadResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

/*
  bloxFreeSpace: This function takes no arguments and returns a promise of an object that contains the blox free space information.
  */
export const bloxFreeSpace = (): Promise<BType.BloxFreeSpaceResponse> => {
  console.log('bloxFreeSpace in react-native started');
  let res1 = Fula.bloxFreeSpace()
    .then((res) => {
      try {
        let jsonRes: BType.BloxFreeSpaceResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res1;
};

export const getAccount = (): Promise<BType.GetAccountResponse> => {
  console.log('getAccount in react-native started');
  let res = Fula.getAccount()
    .then((res1) => {
      try {
        let jsonRes: BType.GetAccountResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in get account:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error getting account:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};

export const assetsBalance = (
  account: string,
  assetId: string,
  classId: string
): Promise<BType.AssetsBalanceResponse> => {
  console.log('assetsBalance in react-native started');
  let res = Fula.assetsBalance(account, assetId, classId)
    .then((res1) => {
      try {
        let jsonRes: BType.AssetsBalanceResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in get asset balance:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error getting asset balance:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};

export const transferToFula = (
  amount: string,
  wallet: string,
  chain: string
): Promise<BType.TransferToFulaResponse> => {
  console.log('transferToFula in react-native started');
  let res = Fula.transferToFula(amount, wallet, chain)
    .then((res1) => {
      try {
        let jsonRes: BType.TransferToFulaResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in transferToFula:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error getting transferToFula:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};
