import { default as EventTypes } from '../interfaces/api-lookup';

import { ApiPromise, WsProvider } from '@polkadot/api';
// SBP-M1 review: remove commented out code
//import { Keyring } from '@polkadot/keyring';
import type * as BType from '../types/blockchain';

const types = {
  FulaPoolPool: EventTypes.FulaPoolPool,
};

export const init = async (
  // SBP-M1 review: consider making configurable
  wsAddress: string = 'wss://node3.functionyard.fx.land'
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

// SBP-M1 review: remove commented out code
/*
  createAccount: This function takes a seed and returns am account
*/
/*export const uploadManifest = async (
  api: ApiPromise | undefined,
  seed: string,
  manifest: typeof EventTypes.FunctionlandFulaCall._enum.upload_manifest
): Promise<BType.ManifestUploadResponse> => {
  console.log('uploadManifest in react-native started');
  try {
    if (api === undefined) {
      api = await init();
    }

    // Simple transaction
    const keyring = new Keyring({ type: 'sr25519' });
    const userKey = keyring.addFromUri(seed, { name: 'account' });
    console.log(
      `${userKey.meta.name}: has address ${userKey.address} with publicKey [${userKey.publicKey}]`
    );
    const submitExtrinsic = await api.tx.manifest.upload(manifest);
    const unsub = await submitExtrinsic
      .signAndSend(userKey, ({ status, events }) => {
        if (status.isInBlock || status.isFinalized) {
          console.log(events);
          unsub();
          return Promise.resolve({ success: true });
        }
      })
      .catch((error) => {
        console.log(':( transaction failed', error);
        return Promise.reject(error);
      });
  } catch (err) {
    return Promise.reject(err);
  }
};*/

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
    if (!api || !api.query || !api.query.pool || !api.query.pool.lastPoolId || !api.query.pool.pools) {
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

// SBP-M1 review: typo
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
    if (!api || !api.query || !api.query.pool || !api.query.pool.poolRequests) {
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
