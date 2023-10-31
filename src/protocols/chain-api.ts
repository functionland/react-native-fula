import { default as EventTypes } from '../interfaces/lookup';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import type * as BType from '../types/blockchain';

const types = {
  FulaPoolPool: EventTypes.FulaPoolPool,
};

export const init = async (
  wsAddress: string = 'wss://node3.functionyard.fula.network'
): Promise<ApiPromise> => {
  const provider = new WsProvider(wsAddress);
  const api = await ApiPromise.create({ types, provider }).catch((err) => {
    console.log(err);
    return Promise.reject(err);
  });
  return api;
};

export const disconnectApi = async (api: ApiPromise): Promise<void> => {
  await api.disconnect();
};

function addDoubleSlashToSeed(seed: string): string {
  return seed.startsWith('//') ? seed : '//' + seed;
}

/*
  createManifest: This function batch uploads manifests
*/
function createManifest(
  cids: string[],
  poolId: number,
  replicationFactor: number = 4
): {
  manifest: any[];
  cids: string[];
  poolId: number[];
  replicationFactor: number[];
} {
  const manifest_metadata = cids.map((cid) => ({
    job: {
      work: 'Storage',
      engine: 'IPFS',
      uri: cid,
    },
  }));

  // Create arrays filled with `poolId` and `replicationFactor`, one element for each `cid`
  const poolIds = new Array(cids.length).fill(poolId);
  const replicationFactors = new Array(cids.length).fill(replicationFactor);

  const batchUploadManifest = {
    manifest: manifest_metadata,
    cids: cids,
    poolId: poolIds,
    replicationFactor: replicationFactors,
  };

  return batchUploadManifest;
}
export const batchUploadManifest = async (
  api: ApiPromise | undefined,
  seed: string,
  cids_i: [string],
  poolId_i: number,
  replicationFactor_i: number = 4
): Promise<{ hash: string }> => {
  const { manifest, cids, poolId, replicationFactor } = createManifest(
    cids_i,
    poolId_i,
    replicationFactor_i
  );

  console.log('uploadManifest in react-native started');
  try {
    if (api === undefined) {
      api = await init();
    }

    // Simple transaction
    const keyring = new Keyring({ type: 'sr25519' });
    const userKey = keyring.addFromUri(seed, { name: 'account' }, 'sr25519');
    console.log(
      `${userKey.meta.name}: has address ${userKey.address} with publicKey [${userKey.publicKey}]`
    );
    if (api?.tx?.fula?.batchUploadManifest) {
      const submitExtrinsic = api.tx.fula.batchUploadManifest(
        manifest,
        cids,
        poolId,
        replicationFactor
      );
      let unsub: () => void; // Define a variable to hold the unsub function

      if (submitExtrinsic) {
        return new Promise<{ hash: string }>((resolve, reject) => {
          submitExtrinsic
            .signAndSend(userKey, ({ status, events }) => {
              if (status.isInBlock || status.isFinalized) {
                if (unsub) {
                  unsub(); // Call unsub before resolving the promise
                }
                resolve({ hash: status.asInBlock.toString() });
              }
            })
            .then((unsubFn) => {
              unsub = unsubFn; // Store the unsub function once it becomes available
            })
            .catch((error) => {
              if (unsub) {
                unsub(); // Call unsub before rejecting the promise
              }
              console.log(':( transaction failed', error);
              reject(error);
            });
        });
      } else {
        return Promise.reject(new TypeError('submitExtrinsic not constructed'));
      }
    } else {
      return Promise.reject(new TypeError('api not initialized'));
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

/*
  listPools: This function takes start index and length and returns a promise of an object that contains a list of pools. Each pool in the list contains the poolID, owner, poolName, parent, and participants of the pool
  */
export const listPools = async (
  api: ApiPromise | undefined,
  start: number = 1,
  length: number = 10
): Promise<BType.PoolListResponse> => {
  console.log('listPools in react-native started');
  try {
    if (api === undefined) {
      api = await init();
    }
    // Type guard to assure TypeScript that api is not undefined
    if (!api?.query?.pool?.lastPoolId || !api?.query?.pool?.pools) {
      throw new Error('Failed to initialize api or api.query.pool');
    }
    const pools: BType.PoolListResponse = { pools: [] };
    const lastPoolId = await api.query.pool.lastPoolId();
    let finalReturnedId: number = Number(lastPoolId.toHuman());
    if (Number(lastPoolId.toHuman()) > start + length) {
      finalReturnedId = start + length;
    }
    for (let i = start; i <= finalReturnedId; i++) {
      const poolInfo = await api.query.pool.pools(i).catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
      if (poolInfo != null) {
        let formattedPoolInfo: BType.Pool = JSON.parse(
          JSON.stringify(poolInfo.toHuman())
        );
        pools.pools.push(formattedPoolInfo);
      }
    }
    return Promise.resolve(pools);
  } catch (err) {
    return Promise.reject(err);
  }
};

/*
  checkJoinRequest: This function takes poolId and AccontId and returns a promise of an object that contains request to the pools.
  */
export const checkJoinRequest = async (
  api: ApiPromise | undefined,
  poolId: number,
  accountId: string
): Promise<BType.PoolRequest | null> => {
  console.log('checkJoinRequest in react-native started');
  try {
    if (api === undefined) {
      api = await init();
    }
    // Type guard to assure TypeScript that api is not undefined
    if (!api?.query?.pool?.poolRequests) {
      throw new Error('Failed to initialize api or api.query.pool');
    }

    const poolRequest = await api.query.pool.poolRequests(poolId, accountId);

    if (poolRequest != null) {
      let formattedPoolRequest: BType.PoolRequest = JSON.parse(
        JSON.stringify(poolRequest.toHuman())
      );
      return Promise.resolve(formattedPoolRequest);
    }
    return Promise.resolve(null);
  } catch (err) {
    return Promise.reject(err);
  }
};
