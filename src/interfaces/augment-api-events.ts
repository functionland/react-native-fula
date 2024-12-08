// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type { Bytes, Null, Option, Result, U8aFixed, Vec, bool, i32, u128, u16, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, H256 } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportDispatchDispatchInfo, FrameSupportTokensMiscBalanceStatus, FunctionlandFulaChallengeState, FunctionlandFulaManifestAvailable, FunctionlandFulaManifestWithPoolId, FunctionlandFulaStorerData, PalletImOnlineSr25519AppSr25519Public, SpConsensusGrandpaAppPublic, SpRuntimeDispatchError, SugarfungeMarketRateBalance } from '@polkadot/types/lookup';

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    asset: {
      AssetCreated: AugmentedEvent<ApiType, [classId: u64, assetId: u64, who: AccountId32], { classId: u64, assetId: u64, who: AccountId32 }>;
      AssetMetadataUpdated: AugmentedEvent<ApiType, [classId: u64, assetId: u64, who: AccountId32, metadata: Bytes], { classId: u64, assetId: u64, who: AccountId32, metadata: Bytes }>;
      BatchBurn: AugmentedEvent<ApiType, [who: AccountId32, from: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128>], { who: AccountId32, from: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128> }>;
      BatchMint: AugmentedEvent<ApiType, [who: AccountId32, to: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128>], { who: AccountId32, to: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128> }>;
      BatchTransferred: AugmentedEvent<ApiType, [who: AccountId32, from: AccountId32, to: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128>], { who: AccountId32, from: AccountId32, to: AccountId32, classId: u64, assetIds: Vec<u64>, amounts: Vec<u128> }>;
      Burn: AugmentedEvent<ApiType, [who: AccountId32, from: AccountId32, classId: u64, assetId: u64, amount: u128], { who: AccountId32, from: AccountId32, classId: u64, assetId: u64, amount: u128 }>;
      ClassCreated: AugmentedEvent<ApiType, [classId: u64, who: AccountId32], { classId: u64, who: AccountId32 }>;
      Mint: AugmentedEvent<ApiType, [who: AccountId32, to: AccountId32, classId: u64, assetId: u64, amount: u128], { who: AccountId32, to: AccountId32, classId: u64, assetId: u64, amount: u128 }>;
      OperatorApprovalForAll: AugmentedEvent<ApiType, [who: AccountId32, operator: AccountId32, classId: u64, approved: bool], { who: AccountId32, operator: AccountId32, classId: u64, approved: bool }>;
      Transferred: AugmentedEvent<ApiType, [who: AccountId32, from: AccountId32, to: AccountId32, classId: u64, assetId: u64, amount: u128], { who: AccountId32, from: AccountId32, to: AccountId32, classId: u64, assetId: u64, amount: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    bag: {
      Created: AugmentedEvent<ApiType, [bag: AccountId32, who: AccountId32, classId: u64, assetId: u64, owners: Vec<AccountId32>], { bag: AccountId32, who: AccountId32, classId: u64, assetId: u64, owners: Vec<AccountId32> }>;
      Deposit: AugmentedEvent<ApiType, [bag: AccountId32, who: AccountId32], { bag: AccountId32, who: AccountId32 }>;
      Register: AugmentedEvent<ApiType, [who: AccountId32, classId: u64], { who: AccountId32, classId: u64 }>;
      Sweep: AugmentedEvent<ApiType, [bag: AccountId32, who: AccountId32, to: AccountId32], { bag: AccountId32, who: AccountId32, to: AccountId32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    balances: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [who: AccountId32, free: u128], { who: AccountId32, free: u128 }>;
      /**
       * Some amount was burned from an account.
       **/
      Burned: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was deposited (e.g. for transaction fees).
       **/
      Deposit: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * An account was removed whose balance was non-zero but below ExistentialDeposit,
       * resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32, amount: u128 }>;
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<ApiType, [account: AccountId32, freeBalance: u128], { account: AccountId32, freeBalance: u128 }>;
      /**
       * Some balance was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Total issuance was increased by `amount`, creating a credit to be balanced.
       **/
      Issued: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>;
      /**
       * Some balance was locked.
       **/
      Locked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was minted into an account.
       **/
      Minted: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Total issuance was decreased by `amount`, creating a debt to be balanced.
       **/
      Rescinded: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>;
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was moved from the reserve of the first account to the second account.
       * Final argument indicates the destination balance type.
       **/
      ReserveRepatriated: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus], { from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus }>;
      /**
       * Some amount was restored into an account.
       **/
      Restored: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was removed from the account (e.g. for misbehavior).
       **/
      Slashed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was suspended from an account (it can be restored later).
       **/
      Suspended: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128], { from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Some balance was unlocked.
       **/
      Unlocked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * An account was upgraded.
       **/
      Upgraded: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>;
      /**
       * Some amount was withdrawn from the account (e.g. for transaction fees).
       **/
      Withdraw: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    bundle: {
      Burn: AugmentedEvent<ApiType, [bundleId: H256, who: AccountId32, from: AccountId32, to: AccountId32, amount: u128], { bundleId: H256, who: AccountId32, from: AccountId32, to: AccountId32, amount: u128 }>;
      Mint: AugmentedEvent<ApiType, [bundleId: H256, who: AccountId32, from: AccountId32, to: AccountId32, amount: u128], { bundleId: H256, who: AccountId32, from: AccountId32, to: AccountId32, amount: u128 }>;
      Register: AugmentedEvent<ApiType, [bundleId: H256, who: AccountId32, classId: u64, assetId: u64], { bundleId: H256, who: AccountId32, classId: u64, assetId: u64 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [proposalHash: H256, yes: u32, no: u32], { proposalHash: H256, yes: u32, no: u32 }>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>;
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>], { proposalHash: H256, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32], { account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32 }>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       **/
      Voted: AugmentedEvent<ApiType, [account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32], { account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    dao: {
      /**
       * Event documentation should end with an array that provides descriptive names for event
       * parameters. [something, who]
       **/
      SomethingStored: AugmentedEvent<ApiType, [u32, AccountId32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    exgine: {
      /**
       * Event documentation should end with an array that provides descriptive names for event
       * parameters. [something, who]
       **/
      SomethingStored: AugmentedEvent<ApiType, [u32, AccountId32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    fula: {
      BatchManifestOutput: AugmentedEvent<ApiType, [uploader: AccountId32, poolIds: Vec<u32>, manifests: Vec<Bytes>], { uploader: AccountId32, poolIds: Vec<u32>, manifests: Vec<Bytes> }>;
      BatchManifestRemoved: AugmentedEvent<ApiType, [uploader: AccountId32, poolIds: Vec<u32>, cids: Vec<Bytes>], { uploader: AccountId32, poolIds: Vec<u32>, cids: Vec<Bytes> }>;
      BatchRemoveStorerOutput: AugmentedEvent<ApiType, [storer: AccountId32, poolId: u32, cids: Vec<Bytes>], { storer: AccountId32, poolId: u32, cids: Vec<Bytes> }>;
      BatchStorageManifestOutput: AugmentedEvent<ApiType, [storer: AccountId32, poolId: u32, cids: Vec<Bytes>], { storer: AccountId32, poolId: u32, cids: Vec<Bytes> }>;
      Challenge: AugmentedEvent<ApiType, [challenger: AccountId32, challenged: AccountId32, cid: Bytes, state: FunctionlandFulaChallengeState], { challenger: AccountId32, challenged: AccountId32, cid: Bytes, state: FunctionlandFulaChallengeState }>;
      GetAvailableManifests: AugmentedEvent<ApiType, [manifests: Vec<FunctionlandFulaManifestAvailable>], { manifests: Vec<FunctionlandFulaManifestAvailable> }>;
      GetManifests: AugmentedEvent<ApiType, [manifests: Vec<FunctionlandFulaManifestWithPoolId>], { manifests: Vec<FunctionlandFulaManifestWithPoolId> }>;
      GetManifestsStorerData: AugmentedEvent<ApiType, [manifests: Vec<FunctionlandFulaStorerData>], { manifests: Vec<FunctionlandFulaStorerData> }>;
      ManifestOutput: AugmentedEvent<ApiType, [uploader: AccountId32, storer: Vec<AccountId32>, poolId: u32, manifest: Bytes], { uploader: AccountId32, storer: Vec<AccountId32>, poolId: u32, manifest: Bytes }>;
      ManifestRemoved: AugmentedEvent<ApiType, [uploader: AccountId32, poolId: u32, cid: Bytes], { uploader: AccountId32, poolId: u32, cid: Bytes }>;
      ManifestStorageUpdated: AugmentedEvent<ApiType, [storer: AccountId32, poolId: u32, cid: Bytes, activeCycles: u16, missedCycles: u16, activeDays: i32], { storer: AccountId32, poolId: u32, cid: Bytes, activeCycles: u16, missedCycles: u16, activeDays: i32 }>;
      MintedLaborTokens: AugmentedEvent<ApiType, [account: AccountId32, classId: u64, assetId: u64, amount: u128, calculatedAmount: u128], { account: AccountId32, classId: u64, assetId: u64, amount: u128, calculatedAmount: u128 }>;
      RemoveStorerOutput: AugmentedEvent<ApiType, [storer: Option<AccountId32>, poolId: u32, cid: Bytes], { storer: Option<AccountId32>, poolId: u32, cid: Bytes }>;
      StorageManifestOutput: AugmentedEvent<ApiType, [storer: AccountId32, poolId: u32, cid: Bytes], { storer: AccountId32, poolId: u32, cid: Bytes }>;
      UpdateFileSizeOutput: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32, cid: Bytes, size_: u64], { account: AccountId32, poolId: u32, cid: Bytes, size_: u64 }>;
      UpdateFileSizesOutput: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32, cids: Vec<Bytes>, sizes: Vec<u64>], { account: AccountId32, poolId: u32, cids: Vec<Bytes>, sizes: Vec<u64> }>;
      VerifiedChallenges: AugmentedEvent<ApiType, [challenged: AccountId32, successful: Vec<Bytes>, failed: Vec<Bytes>], { challenged: AccountId32, successful: Vec<Bytes>, failed: Vec<Bytes> }>;
      VerifiedStorerManifests: AugmentedEvent<ApiType, [storer: AccountId32, validCids: Vec<Bytes>, invalidCids: Vec<Bytes>], { storer: AccountId32, validCids: Vec<Bytes>, invalidCids: Vec<Bytes> }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    grandpa: {
      /**
       * New authority set has been applied.
       **/
      NewAuthorities: AugmentedEvent<ApiType, [authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>], { authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>> }>;
      /**
       * Current authority set has been paused.
       **/
      Paused: AugmentedEvent<ApiType, []>;
      /**
       * Current authority set has been resumed.
       **/
      Resumed: AugmentedEvent<ApiType, []>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    imOnline: {
      /**
       * At the end of the session, no offence was committed.
       **/
      AllGood: AugmentedEvent<ApiType, []>;
      /**
       * A new heartbeat was received from `AuthorityId`.
       **/
      HeartbeatReceived: AugmentedEvent<ApiType, [authorityId: PalletImOnlineSr25519AppSr25519Public], { authorityId: PalletImOnlineSr25519AppSr25519Public }>;
      /**
       * At the end of the session, at least one validator was found to be offline.
       **/
      SomeOffline: AugmentedEvent<ApiType, [offline: Vec<ITuple<[AccountId32, AccountId32]>>], { offline: Vec<ITuple<[AccountId32, AccountId32]>> }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    market: {
      Created: AugmentedEvent<ApiType, [marketId: u64, who: AccountId32], { marketId: u64, who: AccountId32 }>;
      Deposit: AugmentedEvent<ApiType, [who: AccountId32, marketId: u64, marketRateId: u64, amount: u128, balances: Vec<SugarfungeMarketRateBalance>, success: bool], { who: AccountId32, marketId: u64, marketRateId: u64, amount: u128, balances: Vec<SugarfungeMarketRateBalance>, success: bool }>;
      Exchanged: AugmentedEvent<ApiType, [buyer: AccountId32, marketId: u64, marketRateId: u64, amount: u128, balances: Vec<SugarfungeMarketRateBalance>, success: bool], { buyer: AccountId32, marketId: u64, marketRateId: u64, amount: u128, balances: Vec<SugarfungeMarketRateBalance>, success: bool }>;
      LiquidityAdded: AugmentedEvent<ApiType, [who: AccountId32, marketId: u64, marketRateId: u64, classIds: Vec<u64>, assetIds: Vec<Vec<u64>>, amounts: Vec<Vec<u128>>], { who: AccountId32, marketId: u64, marketRateId: u64, classIds: Vec<u64>, assetIds: Vec<Vec<u64>>, amounts: Vec<Vec<u128>> }>;
      LiquidityRemoved: AugmentedEvent<ApiType, [who: AccountId32, marketId: u64, marketRateId: u64, classIds: Vec<u64>, assetIds: Vec<Vec<u64>>, amounts: Vec<Vec<u128>>], { who: AccountId32, marketId: u64, marketRateId: u64, classIds: Vec<u64>, assetIds: Vec<Vec<u64>>, amounts: Vec<Vec<u128>> }>;
      RateCreated: AugmentedEvent<ApiType, [marketId: u64, marketRateId: u64, who: AccountId32], { marketId: u64, marketRateId: u64, who: AccountId32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    pool: {
      /**
       * Pool's capacity has been reached,
       **/
      CapacityReached: AugmentedEvent<ApiType, [poolId: u32], { poolId: u32 }>;
      /**
       * A user requested to join a pool.
       **/
      JoinRequested: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32], { account: AccountId32, poolId: u32 }>;
      /**
       * Pool participant left.
       **/
      ParticipantLeft: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32], { account: AccountId32, poolId: u32 }>;
      /**
       * A pool has been created.
       **/
      PoolCreated: AugmentedEvent<ApiType, [owner: Option<AccountId32>, poolId: u32], { owner: Option<AccountId32>, poolId: u32 }>;
      /**
       * A user has withdrawn their request to join a pool.
       **/
      RequestWithdrawn: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32], { account: AccountId32, poolId: u32 }>;
      VotingResult: AugmentedEvent<ApiType, [account: AccountId32, poolId: u32, result: Bytes], { account: AccountId32, poolId: u32, result: Bytes }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    scheduler: {
      /**
       * The call for the provided hash was not found so the task has been aborted.
       **/
      CallUnavailable: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * Canceled some task.
       **/
      Canceled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32, index: u32 }>;
      /**
       * Dispatched some task.
       **/
      Dispatched: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>, result: Result<Null, SpRuntimeDispatchError>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed>, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * The given task was unable to be renewed since the agenda is full at that block.
       **/
      PeriodicFailed: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * The given task can never be executed since it is overweight.
       **/
      PermanentlyOverweight: AugmentedEvent<ApiType, [task: ITuple<[u32, u32]>, id: Option<U8aFixed>], { task: ITuple<[u32, u32]>, id: Option<U8aFixed> }>;
      /**
       * Scheduled some task.
       **/
      Scheduled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32, index: u32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the
       * block number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [sessionIndex: u32], { sessionIndex: u32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    sudo: {
      /**
       * The \[sudoer\] just switched identity; the old key is supplied if one existed.
       **/
      KeyChanged: AugmentedEvent<ApiType, [oldSudoer: Option<AccountId32>], { oldSudoer: Option<AccountId32> }>;
      /**
       * A sudo just took place. \[result\]
       **/
      Sudid: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A sudo just took place. \[result\]
       **/
      SudoAsDone: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportDispatchDispatchInfo], { dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportDispatchDispatchInfo }>;
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [dispatchInfo: FrameSupportDispatchDispatchInfo], { dispatchInfo: FrameSupportDispatchDispatchInfo }>;
      /**
       * An account was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * On on-chain remark happened.
       **/
      Remarked: AugmentedEvent<ApiType, [sender: AccountId32, hash_: H256], { sender: AccountId32, hash_: H256 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    transactionPayment: {
      /**
       * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       * has been paid by `who`.
       **/
      TransactionFeePaid: AugmentedEvent<ApiType, [who: AccountId32, actualFee: u128, tip: u128], { who: AccountId32, actualFee: u128, tip: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    utility: {
      /**
       * Batch of dispatches completed fully with no error.
       **/
      BatchCompleted: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches completed but has errors.
       **/
      BatchCompletedWithErrors: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       * well as the error.
       **/
      BatchInterrupted: AugmentedEvent<ApiType, [index: u32, error: SpRuntimeDispatchError], { index: u32, error: SpRuntimeDispatchError }>;
      /**
       * A call was dispatched.
       **/
      DispatchedAs: AugmentedEvent<ApiType, [result: Result<Null, SpRuntimeDispatchError>], { result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single item within a Batch of dispatches has completed with no error.
       **/
      ItemCompleted: AugmentedEvent<ApiType, []>;
      /**
       * A single item within a Batch of dispatches has completed with error.
       **/
      ItemFailed: AugmentedEvent<ApiType, [error: SpRuntimeDispatchError], { error: SpRuntimeDispatchError }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    validatorSet: {
      /**
       * New validator addition initiated. Effective in ~2 sessions.
       **/
      ValidatorAdditionInitiated: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Validator removal initiated. Effective in ~2 sessions.
       **/
      ValidatorRemovalInitiated: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  } // AugmentedEvents
} // declare module
