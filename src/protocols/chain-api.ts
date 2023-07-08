import { default as EventTypes } from '../interfaces/api-lookup';

import { ApiPromise, WsProvider } from '@polkadot/api';
import type * as BType from '../types/blockchain';

    const types = {
        FulaPoolPool: EventTypes.FulaPoolPool,
    }

    export const init = async (wsAddress: string = 'wss://node.testnet.fx.land'): Promise<ApiPromise> => {
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

/*
  listPools: This function takes start index and length and returns a promise of an object that contains a list of pools. Each pool in the list contains the poolID, owner, poolName, parent, and participants of the pool
  */
  export const listPools = async (api: ApiPromise|undefined, start: number=1, length: number=10): Promise<BType.PoolListResponse> => {
    console.log(
        'listPools in react-native started'
    );
    try {
        if(api == undefined) {
            api = await init();
        }
        const pools: BType.PoolListResponse = { pools: [] };
        const lastPoolId = await api.query.pool.lastPoolId();
        let finalReturnedId: number = Number(lastPoolId.toHuman());
        if (Number(lastPoolId.toHuman()) > start + length) {
            finalReturnedId = start + length;
        }
        for(let i=start; i<=finalReturnedId;i++) {
            const poolInfo = await api.query.pool
            .pools(i).catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
            if(poolInfo != null) {
                let formattedPoolInfo: BType.Pool = JSON.parse(JSON.stringify(poolInfo.toHuman()));
                pools.pools.push(formattedPoolInfo);
            }
        }
        return Promise.resolve(pools);
    } catch (err) {
        return Promise.reject(err);
    }
  }

  /*
  checkJoinRequest: This function takes poolId and AccontId and returns a promise of an object that contains request to the pools.
  */
  export const checkJoinRequest = async (api: ApiPromise|undefined, poolId: number, accountId: string): Promise<BType.PoolRequest|null> => {
    console.log(
        'checkJoinRequest in react-native started'
    );
    try {
        if(api == undefined) {
            api = await init();
        }

        const poolRequest = await api.query.pool.poolRequests(poolId, accountId);

        if(poolRequest != null) {
            let formattedPoolRequest: BType.PoolRequest = JSON.parse(JSON.stringify(poolRequest.toHuman()));
            return Promise.resolve(formattedPoolRequest);
        }
        return Promise.resolve(null);
        
    } catch (err) {
        return Promise.reject(err);
    }
  }