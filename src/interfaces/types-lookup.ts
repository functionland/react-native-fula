// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup';

import type { Bytes, Compact, Enum, Null, Option, Result, Struct, Text, U8aFixed, Vec, bool, i128, i32, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H256, MultiAddress } from '@polkadot/types/interfaces/runtime';
import type { Event } from '@polkadot/types/interfaces/system';

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemAccountInfo (3) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32;
    readonly consumers: u32;
    readonly providers: u32;
    readonly sufficients: u32;
    readonly data: PalletBalancesAccountData;
  }

  /** @name PalletBalancesAccountData (5) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128;
    readonly reserved: u128;
    readonly frozen: u128;
    readonly flags: u128;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeight (8) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: SpWeightsWeightV2Weight;
    readonly operational: SpWeightsWeightV2Weight;
    readonly mandatory: SpWeightsWeightV2Weight;
  }

  /** @name SpWeightsWeightV2Weight (9) */
  interface SpWeightsWeightV2Weight extends Struct {
    readonly refTime: Compact<u64>;
    readonly proofSize: Compact<u64>;
  }

  /** @name SpRuntimeDigest (14) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>;
  }

  /** @name SpRuntimeDigestDigestItem (16) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean;
    readonly asOther: Bytes;
    readonly isConsensus: boolean;
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>;
    readonly isSeal: boolean;
    readonly asSeal: ITuple<[U8aFixed, Bytes]>;
    readonly isPreRuntime: boolean;
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>;
    readonly isRuntimeEnvironmentUpdated: boolean;
    readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated';
  }

  /** @name FrameSystemEventRecord (19) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase;
    readonly event: Event;
    readonly topics: Vec<H256>;
  }

  /** @name FrameSystemEvent (21) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean;
    readonly asExtrinsicSuccess: {
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo;
    } & Struct;
    readonly isExtrinsicFailed: boolean;
    readonly asExtrinsicFailed: {
      readonly dispatchError: SpRuntimeDispatchError;
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo;
    } & Struct;
    readonly isCodeUpdated: boolean;
    readonly isNewAccount: boolean;
    readonly asNewAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isKilledAccount: boolean;
    readonly asKilledAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isRemarked: boolean;
    readonly asRemarked: {
      readonly sender: AccountId32;
      readonly hash_: H256;
    } & Struct;
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked';
  }

  /** @name FrameSupportDispatchDispatchInfo (22) */
  interface FrameSupportDispatchDispatchInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
    readonly class: FrameSupportDispatchDispatchClass;
    readonly paysFee: FrameSupportDispatchPays;
  }

  /** @name FrameSupportDispatchDispatchClass (23) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean;
    readonly isOperational: boolean;
    readonly isMandatory: boolean;
    readonly type: 'Normal' | 'Operational' | 'Mandatory';
  }

  /** @name FrameSupportDispatchPays (24) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly type: 'Yes' | 'No';
  }

  /** @name SpRuntimeDispatchError (25) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean;
    readonly isCannotLookup: boolean;
    readonly isBadOrigin: boolean;
    readonly isModule: boolean;
    readonly asModule: SpRuntimeModuleError;
    readonly isConsumerRemaining: boolean;
    readonly isNoProviders: boolean;
    readonly isTooManyConsumers: boolean;
    readonly isToken: boolean;
    readonly asToken: SpRuntimeTokenError;
    readonly isArithmetic: boolean;
    readonly asArithmetic: SpArithmeticArithmeticError;
    readonly isTransactional: boolean;
    readonly asTransactional: SpRuntimeTransactionalError;
    readonly isExhausted: boolean;
    readonly isCorruption: boolean;
    readonly isUnavailable: boolean;
    readonly isRootNotAllowed: boolean;
    readonly type: 'Other' | 'CannotLookup' | 'BadOrigin' | 'Module' | 'ConsumerRemaining' | 'NoProviders' | 'TooManyConsumers' | 'Token' | 'Arithmetic' | 'Transactional' | 'Exhausted' | 'Corruption' | 'Unavailable' | 'RootNotAllowed';
  }

  /** @name SpRuntimeModuleError (26) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8;
    readonly error: U8aFixed;
  }

  /** @name SpRuntimeTokenError (27) */
  interface SpRuntimeTokenError extends Enum {
    readonly isFundsUnavailable: boolean;
    readonly isOnlyProvider: boolean;
    readonly isBelowMinimum: boolean;
    readonly isCannotCreate: boolean;
    readonly isUnknownAsset: boolean;
    readonly isFrozen: boolean;
    readonly isUnsupported: boolean;
    readonly isCannotCreateHold: boolean;
    readonly isNotExpendable: boolean;
    readonly isBlocked: boolean;
    readonly type: 'FundsUnavailable' | 'OnlyProvider' | 'BelowMinimum' | 'CannotCreate' | 'UnknownAsset' | 'Frozen' | 'Unsupported' | 'CannotCreateHold' | 'NotExpendable' | 'Blocked';
  }

  /** @name SpArithmeticArithmeticError (28) */
  interface SpArithmeticArithmeticError extends Enum {
    readonly isUnderflow: boolean;
    readonly isOverflow: boolean;
    readonly isDivisionByZero: boolean;
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
  }

  /** @name SpRuntimeTransactionalError (29) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean;
    readonly isNoLayer: boolean;
    readonly type: 'LimitReached' | 'NoLayer';
  }

  /** @name PalletGrandpaEvent (30) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: {
      readonly authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    } & Struct;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name SpConsensusGrandpaAppPublic (33) */
  interface SpConsensusGrandpaAppPublic extends SpCoreEd25519Public {}

  /** @name SpCoreEd25519Public (34) */
  interface SpCoreEd25519Public extends U8aFixed {}

  /** @name PalletBalancesEvent (35) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean;
    readonly asEndowed: {
      readonly account: AccountId32;
      readonly freeBalance: u128;
    } & Struct;
    readonly isDustLost: boolean;
    readonly asDustLost: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBalanceSet: boolean;
    readonly asBalanceSet: {
      readonly who: AccountId32;
      readonly free: u128;
    } & Struct;
    readonly isReserved: boolean;
    readonly asReserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnreserved: boolean;
    readonly asUnreserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isReserveRepatriated: boolean;
    readonly asReserveRepatriated: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
      readonly destinationStatus: FrameSupportTokensMiscBalanceStatus;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdraw: boolean;
    readonly asWithdraw: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isMinted: boolean;
    readonly asMinted: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSuspended: boolean;
    readonly asSuspended: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isRestored: boolean;
    readonly asRestored: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUpgraded: boolean;
    readonly asUpgraded: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly amount: u128;
    } & Struct;
    readonly isRescinded: boolean;
    readonly asRescinded: {
      readonly amount: u128;
    } & Struct;
    readonly isLocked: boolean;
    readonly asLocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnlocked: boolean;
    readonly asUnlocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed' | 'Minted' | 'Burned' | 'Suspended' | 'Restored' | 'Upgraded' | 'Issued' | 'Rescinded' | 'Locked' | 'Unlocked' | 'Frozen' | 'Thawed';
  }

  /** @name FrameSupportTokensMiscBalanceStatus (36) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean;
    readonly isReserved: boolean;
    readonly type: 'Free' | 'Reserved';
  }

  /** @name PalletTransactionPaymentEvent (37) */
  interface PalletTransactionPaymentEvent extends Enum {
    readonly isTransactionFeePaid: boolean;
    readonly asTransactionFeePaid: {
      readonly who: AccountId32;
      readonly actualFee: u128;
      readonly tip: u128;
    } & Struct;
    readonly type: 'TransactionFeePaid';
  }

  /** @name PalletSudoEvent (38) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean;
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isKeyChanged: boolean;
    readonly asKeyChanged: {
      readonly oldSudoer: Option<AccountId32>;
    } & Struct;
    readonly isSudoAsDone: boolean;
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone';
  }

  /** @name PalletSchedulerEvent (42) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean;
    readonly asScheduled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isCanceled: boolean;
    readonly asCanceled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isDispatched: boolean;
    readonly asDispatched: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isCallUnavailable: boolean;
    readonly asCallUnavailable: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPeriodicFailed: boolean;
    readonly asPeriodicFailed: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPermanentlyOverweight: boolean;
    readonly asPermanentlyOverweight: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched' | 'CallUnavailable' | 'PeriodicFailed' | 'PermanentlyOverweight';
  }

  /** @name PalletCollectiveEvent (45) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: {
      readonly account: AccountId32;
      readonly proposalIndex: u32;
      readonly proposalHash: H256;
      readonly threshold: u32;
    } & Struct;
    readonly isVoted: boolean;
    readonly asVoted: {
      readonly account: AccountId32;
      readonly proposalHash: H256;
      readonly voted: bool;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly isApproved: boolean;
    readonly asApproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isDisapproved: boolean;
    readonly asDisapproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isExecuted: boolean;
    readonly asExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isMemberExecuted: boolean;
    readonly asMemberExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isClosed: boolean;
    readonly asClosed: {
      readonly proposalHash: H256;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted' | 'Closed';
  }

  /** @name SugarfungeValidatorSetEvent (47) */
  interface SugarfungeValidatorSetEvent extends Enum {
    readonly isValidatorAdditionInitiated: boolean;
    readonly asValidatorAdditionInitiated: AccountId32;
    readonly isValidatorRemovalInitiated: boolean;
    readonly asValidatorRemovalInitiated: AccountId32;
    readonly type: 'ValidatorAdditionInitiated' | 'ValidatorRemovalInitiated';
  }

  /** @name PalletSessionEvent (48) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: {
      readonly sessionIndex: u32;
    } & Struct;
    readonly type: 'NewSession';
  }

  /** @name SugarfungeAssetEvent (49) */
  interface SugarfungeAssetEvent extends Enum {
    readonly isClassCreated: boolean;
    readonly asClassCreated: {
      readonly classId: u64;
      readonly who: AccountId32;
    } & Struct;
    readonly isAssetCreated: boolean;
    readonly asAssetCreated: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly who: AccountId32;
    } & Struct;
    readonly isAssetMetadataUpdated: boolean;
    readonly asAssetMetadataUpdated: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly who: AccountId32;
      readonly metadata: Bytes;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly who: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchMint: boolean;
    readonly asBatchMint: {
      readonly who: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchBurn: boolean;
    readonly asBatchBurn: {
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchTransferred: boolean;
    readonly asBatchTransferred: {
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isOperatorApprovalForAll: boolean;
    readonly asOperatorApprovalForAll: {
      readonly who: AccountId32;
      readonly operator: AccountId32;
      readonly classId: u64;
      readonly approved: bool;
    } & Struct;
    readonly type: 'ClassCreated' | 'AssetCreated' | 'AssetMetadataUpdated' | 'Mint' | 'BatchMint' | 'Burn' | 'BatchBurn' | 'Transferred' | 'BatchTransferred' | 'OperatorApprovalForAll';
  }

  /** @name SugarfungeDaoEvent (52) */
  interface SugarfungeDaoEvent extends Enum {
    readonly isSomethingStored: boolean;
    readonly asSomethingStored: ITuple<[u32, AccountId32]>;
    readonly type: 'SomethingStored';
  }

  /** @name SugarfungeBundleEvent (53) */
  interface SugarfungeBundleEvent extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly bundleId: H256;
      readonly who: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly bundleId: H256;
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly bundleId: H256;
      readonly who: AccountId32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Register' | 'Mint' | 'Burn';
  }

  /** @name SugarfungeBagEvent (54) */
  interface SugarfungeBagEvent extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly who: AccountId32;
      readonly classId: u64;
    } & Struct;
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly bag: AccountId32;
      readonly who: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly owners: Vec<AccountId32>;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly bag: AccountId32;
      readonly who: AccountId32;
    } & Struct;
    readonly isSweep: boolean;
    readonly asSweep: {
      readonly bag: AccountId32;
      readonly who: AccountId32;
      readonly to: AccountId32;
    } & Struct;
    readonly type: 'Register' | 'Created' | 'Deposit' | 'Sweep';
  }

  /** @name SugarfungeExgineEvent (56) */
  interface SugarfungeExgineEvent extends Enum {
    readonly isSomethingStored: boolean;
    readonly asSomethingStored: ITuple<[u32, AccountId32]>;
    readonly type: 'SomethingStored';
  }

  /** @name SugarfungeMarketEvent (57) */
  interface SugarfungeMarketEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly marketId: u64;
      readonly who: AccountId32;
    } & Struct;
    readonly isRateCreated: boolean;
    readonly asRateCreated: {
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly who: AccountId32;
    } & Struct;
    readonly isLiquidityAdded: boolean;
    readonly asLiquidityAdded: {
      readonly who: AccountId32;
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly classIds: Vec<u64>;
      readonly assetIds: Vec<Vec<u64>>;
      readonly amounts: Vec<Vec<u128>>;
    } & Struct;
    readonly isLiquidityRemoved: boolean;
    readonly asLiquidityRemoved: {
      readonly who: AccountId32;
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly classIds: Vec<u64>;
      readonly assetIds: Vec<Vec<u64>>;
      readonly amounts: Vec<Vec<u128>>;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly who: AccountId32;
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly amount: u128;
      readonly balances: Vec<SugarfungeMarketRateBalance>;
      readonly success: bool;
    } & Struct;
    readonly isExchanged: boolean;
    readonly asExchanged: {
      readonly buyer: AccountId32;
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly amount: u128;
      readonly balances: Vec<SugarfungeMarketRateBalance>;
      readonly success: bool;
    } & Struct;
    readonly type: 'Created' | 'RateCreated' | 'LiquidityAdded' | 'LiquidityRemoved' | 'Deposit' | 'Exchanged';
  }

  /** @name SugarfungeMarketRateBalance (61) */
  interface SugarfungeMarketRateBalance extends Struct {
    readonly rate: SugarfungeMarketAssetRate;
    readonly balance: i128;
  }

  /** @name SugarfungeMarketAssetRate (62) */
  interface SugarfungeMarketAssetRate extends Struct {
    readonly classId: u64;
    readonly assetId: u64;
    readonly action: SugarfungeMarketRateAction;
    readonly from: SugarfungeMarketRateAccount;
    readonly to: SugarfungeMarketRateAccount;
  }

  /** @name SugarfungeMarketRateAction (63) */
  interface SugarfungeMarketRateAction extends Enum {
    readonly isTransfer: boolean;
    readonly asTransfer: i128;
    readonly isMarketTransfer: boolean;
    readonly asMarketTransfer: ITuple<[SugarfungeMarketAmm, u64, u64]>;
    readonly isMint: boolean;
    readonly asMint: i128;
    readonly isBurn: boolean;
    readonly asBurn: i128;
    readonly isHas: boolean;
    readonly asHas: ITuple<[SugarfungeMarketAmountOp, i128]>;
    readonly type: 'Transfer' | 'MarketTransfer' | 'Mint' | 'Burn' | 'Has';
  }

  /** @name SugarfungeMarketAmm (65) */
  interface SugarfungeMarketAmm extends Enum {
    readonly isConstant: boolean;
    readonly type: 'Constant';
  }

  /** @name SugarfungeMarketAmountOp (66) */
  interface SugarfungeMarketAmountOp extends Enum {
    readonly isEqual: boolean;
    readonly isLessThan: boolean;
    readonly isLessEqualThan: boolean;
    readonly isGreaterThan: boolean;
    readonly isGreaterEqualThan: boolean;
    readonly type: 'Equal' | 'LessThan' | 'LessEqualThan' | 'GreaterThan' | 'GreaterEqualThan';
  }

  /** @name SugarfungeMarketRateAccount (67) */
  interface SugarfungeMarketRateAccount extends Enum {
    readonly isMarket: boolean;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly isBuyer: boolean;
    readonly type: 'Market' | 'Account' | 'Buyer';
  }

  /** @name FunctionlandFulaEvent (68) */
  interface FunctionlandFulaEvent extends Enum {
    readonly isManifestOutput: boolean;
    readonly asManifestOutput: {
      readonly uploader: AccountId32;
      readonly storer: Vec<AccountId32>;
      readonly poolId: u32;
      readonly manifest: Bytes;
    } & Struct;
    readonly isStorageManifestOutput: boolean;
    readonly asStorageManifestOutput: {
      readonly storer: AccountId32;
      readonly poolId: u32;
      readonly cid: Bytes;
    } & Struct;
    readonly isRemoveStorerOutput: boolean;
    readonly asRemoveStorerOutput: {
      readonly storer: Option<AccountId32>;
      readonly poolId: u32;
      readonly cid: Bytes;
    } & Struct;
    readonly isManifestRemoved: boolean;
    readonly asManifestRemoved: {
      readonly uploader: AccountId32;
      readonly poolId: u32;
      readonly cid: Bytes;
    } & Struct;
    readonly isManifestStorageUpdated: boolean;
    readonly asManifestStorageUpdated: {
      readonly storer: AccountId32;
      readonly poolId: u32;
      readonly cid: Bytes;
      readonly activeCycles: u16;
      readonly missedCycles: u16;
      readonly activeDays: i32;
    } & Struct;
    readonly isBatchManifestOutput: boolean;
    readonly asBatchManifestOutput: {
      readonly uploader: AccountId32;
      readonly poolIds: Vec<u32>;
      readonly manifests: Vec<Bytes>;
    } & Struct;
    readonly isBatchStorageManifestOutput: boolean;
    readonly asBatchStorageManifestOutput: {
      readonly storer: AccountId32;
      readonly poolId: u32;
      readonly cids: Vec<Bytes>;
    } & Struct;
    readonly isBatchRemoveStorerOutput: boolean;
    readonly asBatchRemoveStorerOutput: {
      readonly storer: AccountId32;
      readonly poolId: u32;
      readonly cids: Vec<Bytes>;
    } & Struct;
    readonly isBatchManifestRemoved: boolean;
    readonly asBatchManifestRemoved: {
      readonly uploader: AccountId32;
      readonly poolIds: Vec<u32>;
      readonly cids: Vec<Bytes>;
    } & Struct;
    readonly isVerifiedStorerManifests: boolean;
    readonly asVerifiedStorerManifests: {
      readonly storer: AccountId32;
      readonly validCids: Vec<Bytes>;
      readonly invalidCids: Vec<Bytes>;
    } & Struct;
    readonly isUpdateFileSizeOutput: boolean;
    readonly asUpdateFileSizeOutput: {
      readonly account: AccountId32;
      readonly poolId: u32;
      readonly cid: Bytes;
      readonly size_: u64;
    } & Struct;
    readonly isUpdateFileSizesOutput: boolean;
    readonly asUpdateFileSizesOutput: {
      readonly account: AccountId32;
      readonly poolId: u32;
      readonly cids: Vec<Bytes>;
      readonly sizes: Vec<u64>;
    } & Struct;
    readonly isGetManifests: boolean;
    readonly asGetManifests: {
      readonly manifests: Vec<FunctionlandFulaManifestWithPoolId>;
    } & Struct;
    readonly isGetAvailableManifests: boolean;
    readonly asGetAvailableManifests: {
      readonly manifests: Vec<FunctionlandFulaManifestAvailable>;
    } & Struct;
    readonly isGetManifestsStorerData: boolean;
    readonly asGetManifestsStorerData: {
      readonly manifests: Vec<FunctionlandFulaStorerData>;
    } & Struct;
    readonly isChallenge: boolean;
    readonly asChallenge: {
      readonly challenger: AccountId32;
      readonly challenged: AccountId32;
      readonly cid: Bytes;
      readonly state: FunctionlandFulaChallengeState;
    } & Struct;
    readonly isVerifiedChallenges: boolean;
    readonly asVerifiedChallenges: {
      readonly challenged: AccountId32;
      readonly successful: Vec<Bytes>;
      readonly failed: Vec<Bytes>;
    } & Struct;
    readonly isMintedLaborTokens: boolean;
    readonly asMintedLaborTokens: {
      readonly account: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
      readonly calculatedAmount: u128;
    } & Struct;
    readonly type: 'ManifestOutput' | 'StorageManifestOutput' | 'RemoveStorerOutput' | 'ManifestRemoved' | 'ManifestStorageUpdated' | 'BatchManifestOutput' | 'BatchStorageManifestOutput' | 'BatchRemoveStorerOutput' | 'BatchManifestRemoved' | 'VerifiedStorerManifests' | 'UpdateFileSizeOutput' | 'UpdateFileSizesOutput' | 'GetManifests' | 'GetAvailableManifests' | 'GetManifestsStorerData' | 'Challenge' | 'VerifiedChallenges' | 'MintedLaborTokens';
  }

  /** @name FunctionlandFulaManifestWithPoolId (74) */
  interface FunctionlandFulaManifestWithPoolId extends Struct {
    readonly poolId: u32;
    readonly usersData: Vec<FunctionlandFulaUploaderData>;
    readonly manifestMetadata: Bytes;
    readonly size_: Option<u64>;
  }

  /** @name FunctionlandFulaUploaderData (77) */
  interface FunctionlandFulaUploaderData extends Struct {
    readonly uploader: AccountId32;
    readonly storers: Vec<AccountId32>;
    readonly replicationFactor: u16;
  }

  /** @name FunctionlandFulaManifestAvailable (80) */
  interface FunctionlandFulaManifestAvailable extends Struct {
    readonly poolId: u32;
    readonly replicationFactor: u16;
    readonly manifestMetadata: Bytes;
  }

  /** @name FunctionlandFulaStorerData (82) */
  interface FunctionlandFulaStorerData extends Struct {
    readonly poolId: u32;
    readonly cid: Bytes;
    readonly account: AccountId32;
    readonly manifestData: FunctionlandFulaManifestStorageData;
  }

  /** @name FunctionlandFulaManifestStorageData (84) */
  interface FunctionlandFulaManifestStorageData extends Struct {
    readonly activeCycles: u16;
    readonly missedCycles: u16;
    readonly activeDays: i32;
    readonly challengeState: FunctionlandFulaChallengeState;
  }

  /** @name FunctionlandFulaChallengeState (85) */
  interface FunctionlandFulaChallengeState extends Enum {
    readonly isOpen: boolean;
    readonly isSuccessful: boolean;
    readonly isFailed: boolean;
    readonly type: 'Open' | 'Successful' | 'Failed';
  }

  /** @name FulaPoolEvent (86) */
  interface FulaPoolEvent extends Enum {
    readonly isPoolCreated: boolean;
    readonly asPoolCreated: {
      readonly owner: Option<AccountId32>;
      readonly poolId: u32;
    } & Struct;
    readonly isJoinRequested: boolean;
    readonly asJoinRequested: {
      readonly account: AccountId32;
      readonly poolId: u32;
    } & Struct;
    readonly isRequestWithdrawn: boolean;
    readonly asRequestWithdrawn: {
      readonly account: AccountId32;
      readonly poolId: u32;
    } & Struct;
    readonly isVotingResult: boolean;
    readonly asVotingResult: {
      readonly account: AccountId32;
      readonly poolId: u32;
      readonly result: Bytes;
    } & Struct;
    readonly isCapacityReached: boolean;
    readonly asCapacityReached: {
      readonly poolId: u32;
    } & Struct;
    readonly isParticipantLeft: boolean;
    readonly asParticipantLeft: {
      readonly account: AccountId32;
      readonly poolId: u32;
    } & Struct;
    readonly type: 'PoolCreated' | 'JoinRequested' | 'RequestWithdrawn' | 'VotingResult' | 'CapacityReached' | 'ParticipantLeft';
  }

  /** @name FrameSystemPhase (87) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean;
    readonly asApplyExtrinsic: u32;
    readonly isFinalization: boolean;
    readonly isInitialization: boolean;
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (90) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>;
    readonly specName: Text;
  }

  /** @name FrameSystemCall (93) */
  interface FrameSystemCall extends Enum {
    readonly isRemark: boolean;
    readonly asRemark: {
      readonly remark: Bytes;
    } & Struct;
    readonly isSetHeapPages: boolean;
    readonly asSetHeapPages: {
      readonly pages: u64;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetCodeWithoutChecks: boolean;
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetStorage: boolean;
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>;
    } & Struct;
    readonly isKillStorage: boolean;
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>;
    } & Struct;
    readonly isKillPrefix: boolean;
    readonly asKillPrefix: {
      readonly prefix: Bytes;
      readonly subkeys: u32;
    } & Struct;
    readonly isRemarkWithEvent: boolean;
    readonly asRemarkWithEvent: {
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent';
  }

  /** @name FrameSystemLimitsBlockWeights (96) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: SpWeightsWeightV2Weight;
    readonly maxBlock: SpWeightsWeightV2Weight;
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (97) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass;
    readonly operational: FrameSystemLimitsWeightsPerClass;
    readonly mandatory: FrameSystemLimitsWeightsPerClass;
  }

  /** @name FrameSystemLimitsWeightsPerClass (98) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: SpWeightsWeightV2Weight;
    readonly maxExtrinsic: Option<SpWeightsWeightV2Weight>;
    readonly maxTotal: Option<SpWeightsWeightV2Weight>;
    readonly reserved: Option<SpWeightsWeightV2Weight>;
  }

  /** @name FrameSystemLimitsBlockLength (100) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32;
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (101) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32;
    readonly operational: u32;
    readonly mandatory: u32;
  }

  /** @name SpWeightsRuntimeDbWeight (102) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64;
    readonly write: u64;
  }

  /** @name SpVersionRuntimeVersion (103) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text;
    readonly implName: Text;
    readonly authoringVersion: u32;
    readonly specVersion: u32;
    readonly implVersion: u32;
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>;
    readonly transactionVersion: u32;
    readonly stateVersion: u8;
  }

  /** @name FrameSystemError (108) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNeedsToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly isNonDefaultComposite: boolean;
    readonly isNonZeroRefCount: boolean;
    readonly isCallFiltered: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered';
  }

  /** @name PalletTimestampCall (109) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<u64>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name PalletGrandpaStoredState (110) */
  interface PalletGrandpaStoredState extends Enum {
    readonly isLive: boolean;
    readonly isPendingPause: boolean;
    readonly asPendingPause: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly isPaused: boolean;
    readonly isPendingResume: boolean;
    readonly asPendingResume: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly type: 'Live' | 'PendingPause' | 'Paused' | 'PendingResume';
  }

  /** @name PalletGrandpaStoredPendingChange (111) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32;
    readonly delay: u32;
    readonly nextAuthorities: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    readonly forced: Option<u32>;
  }

  /** @name PalletGrandpaCall (114) */
  interface PalletGrandpaCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpCoreVoid;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpCoreVoid;
    } & Struct;
    readonly isNoteStalled: boolean;
    readonly asNoteStalled: {
      readonly delay: u32;
      readonly bestFinalizedBlockNumber: u32;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'NoteStalled';
  }

  /** @name SpConsensusGrandpaEquivocationProof (115) */
  interface SpConsensusGrandpaEquivocationProof extends Struct {
    readonly setId: u64;
    readonly equivocation: SpConsensusGrandpaEquivocation;
  }

  /** @name SpConsensusGrandpaEquivocation (116) */
  interface SpConsensusGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean;
    readonly asPrevote: FinalityGrandpaEquivocationPrevote;
    readonly isPrecommit: boolean;
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit;
    readonly type: 'Prevote' | 'Precommit';
  }

  /** @name FinalityGrandpaEquivocationPrevote (117) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrevote (118) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpConsensusGrandpaAppSignature (119) */
  interface SpConsensusGrandpaAppSignature extends SpCoreEd25519Signature {}

  /** @name SpCoreEd25519Signature (120) */
  interface SpCoreEd25519Signature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (123) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrecommit (124) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpCoreVoid (126) */
  type SpCoreVoid = Null;

  /** @name PalletGrandpaError (127) */
  interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean;
    readonly isResumeFailed: boolean;
    readonly isChangePending: boolean;
    readonly isTooSoon: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isInvalidEquivocationProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly type: 'PauseFailed' | 'ResumeFailed' | 'ChangePending' | 'TooSoon' | 'InvalidKeyOwnershipProof' | 'InvalidEquivocationProof' | 'DuplicateOffenceReport';
  }

  /** @name PalletBalancesBalanceLock (129) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
    readonly reasons: PalletBalancesReasons;
  }

  /** @name PalletBalancesReasons (130) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean;
    readonly isMisc: boolean;
    readonly isAll: boolean;
    readonly type: 'Fee' | 'Misc' | 'All';
  }

  /** @name PalletBalancesReserveData (133) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
  }

  /** @name PalletBalancesIdAmount (136) */
  interface PalletBalancesIdAmount extends Struct {
    readonly id: Null;
    readonly amount: u128;
  }

  /** @name PalletBalancesCall (138) */
  interface PalletBalancesCall extends Enum {
    readonly isTransferAllowDeath: boolean;
    readonly asTransferAllowDeath: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isSetBalanceDeprecated: boolean;
    readonly asSetBalanceDeprecated: {
      readonly who: MultiAddress;
      readonly newFree: Compact<u128>;
      readonly oldReserved: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferAll: boolean;
    readonly asTransferAll: {
      readonly dest: MultiAddress;
      readonly keepAlive: bool;
    } & Struct;
    readonly isForceUnreserve: boolean;
    readonly asForceUnreserve: {
      readonly who: MultiAddress;
      readonly amount: u128;
    } & Struct;
    readonly isUpgradeAccounts: boolean;
    readonly asUpgradeAccounts: {
      readonly who: Vec<AccountId32>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isForceSetBalance: boolean;
    readonly asForceSetBalance: {
      readonly who: MultiAddress;
      readonly newFree: Compact<u128>;
    } & Struct;
    readonly type: 'TransferAllowDeath' | 'SetBalanceDeprecated' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve' | 'UpgradeAccounts' | 'Transfer' | 'ForceSetBalance';
  }

  /** @name PalletBalancesError (143) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean;
    readonly isLiquidityRestrictions: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isExistentialDeposit: boolean;
    readonly isExpendability: boolean;
    readonly isExistingVestingSchedule: boolean;
    readonly isDeadAccount: boolean;
    readonly isTooManyReserves: boolean;
    readonly isTooManyHolds: boolean;
    readonly isTooManyFreezes: boolean;
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'Expendability' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves' | 'TooManyHolds' | 'TooManyFreezes';
  }

  /** @name PalletTransactionPaymentReleases (145) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean;
    readonly isV2: boolean;
    readonly type: 'V1Ancient' | 'V2';
  }

  /** @name PalletSudoCall (146) */
  interface PalletSudoCall extends Enum {
    readonly isSudo: boolean;
    readonly asSudo: {
      readonly call: Call;
    } & Struct;
    readonly isSudoUncheckedWeight: boolean;
    readonly asSudoUncheckedWeight: {
      readonly call: Call;
      readonly weight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isSetKey: boolean;
    readonly asSetKey: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSudoAs: boolean;
    readonly asSudoAs: {
      readonly who: MultiAddress;
      readonly call: Call;
    } & Struct;
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs';
  }

  /** @name PalletSchedulerCall (148) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean;
    readonly asSchedule: {
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancel: boolean;
    readonly asCancel: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isScheduleNamed: boolean;
    readonly asScheduleNamed: {
      readonly id: U8aFixed;
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancelNamed: boolean;
    readonly asCancelNamed: {
      readonly id: U8aFixed;
    } & Struct;
    readonly isScheduleAfter: boolean;
    readonly asScheduleAfter: {
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isScheduleNamedAfter: boolean;
    readonly asScheduleNamedAfter: {
      readonly id: U8aFixed;
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter';
  }

  /** @name PalletCollectiveCall (150) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean;
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>;
      readonly prime: Option<AccountId32>;
      readonly oldCount: u32;
    } & Struct;
    readonly isExecute: boolean;
    readonly asExecute: {
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly threshold: Compact<u32>;
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly proposal: H256;
      readonly index: Compact<u32>;
      readonly approve: bool;
    } & Struct;
    readonly isDisapproveProposal: boolean;
    readonly asDisapproveProposal: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isClose: boolean;
    readonly asClose: {
      readonly proposalHash: H256;
      readonly index: Compact<u32>;
      readonly proposalWeightBound: SpWeightsWeightV2Weight;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote' | 'DisapproveProposal' | 'Close';
  }

  /** @name SugarfungeValidatorSetCall (151) */
  interface SugarfungeValidatorSetCall extends Enum {
    readonly isAddValidator: boolean;
    readonly asAddValidator: {
      readonly validatorId: AccountId32;
    } & Struct;
    readonly isRemoveValidator: boolean;
    readonly asRemoveValidator: {
      readonly validatorId: AccountId32;
    } & Struct;
    readonly isAddValidatorAgain: boolean;
    readonly asAddValidatorAgain: {
      readonly validatorId: AccountId32;
    } & Struct;
    readonly type: 'AddValidator' | 'RemoveValidator' | 'AddValidatorAgain';
  }

  /** @name PalletSessionCall (152) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: SugarfungeRuntimeOpaqueSessionKeys;
      readonly proof: Bytes;
    } & Struct;
    readonly isPurgeKeys: boolean;
    readonly type: 'SetKeys' | 'PurgeKeys';
  }

  /** @name SugarfungeRuntimeOpaqueSessionKeys (153) */
  interface SugarfungeRuntimeOpaqueSessionKeys extends Struct {
    readonly aura: SpConsensusAuraSr25519AppSr25519Public;
    readonly grandpa: SpConsensusGrandpaAppPublic;
  }

  /** @name SpConsensusAuraSr25519AppSr25519Public (154) */
  interface SpConsensusAuraSr25519AppSr25519Public extends SpCoreSr25519Public {}

  /** @name SpCoreSr25519Public (155) */
  interface SpCoreSr25519Public extends U8aFixed {}

  /** @name SugarfungeAssetCall (156) */
  interface SugarfungeAssetCall extends Enum {
    readonly isCreateClass: boolean;
    readonly asCreateClass: {
      readonly owner: AccountId32;
      readonly classId: u64;
      readonly metadata: Bytes;
    } & Struct;
    readonly isCreateAsset: boolean;
    readonly asCreateAsset: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly metadata: Bytes;
    } & Struct;
    readonly isTransferFrom: boolean;
    readonly asTransferFrom: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchTransferFrom: boolean;
    readonly asBatchTransferFrom: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchMint: boolean;
    readonly asBatchMint: {
      readonly to: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly from: AccountId32;
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isBatchBurn: boolean;
    readonly asBatchBurn: {
      readonly from: AccountId32;
      readonly classId: u64;
      readonly assetIds: Vec<u64>;
      readonly amounts: Vec<u128>;
    } & Struct;
    readonly isUpdateClassMetadata: boolean;
    readonly asUpdateClassMetadata: {
      readonly classId: u64;
      readonly metadata: Bytes;
    } & Struct;
    readonly isUpdateAssetMetadata: boolean;
    readonly asUpdateAssetMetadata: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly metadata: Bytes;
    } & Struct;
    readonly type: 'CreateClass' | 'CreateAsset' | 'TransferFrom' | 'BatchTransferFrom' | 'Mint' | 'BatchMint' | 'Burn' | 'BatchBurn' | 'UpdateClassMetadata' | 'UpdateAssetMetadata';
  }

  /** @name SugarfungeDaoCall (159) */
  interface SugarfungeDaoCall extends Enum {
    readonly isDoSomething: boolean;
    readonly asDoSomething: {
      readonly something: u32;
    } & Struct;
    readonly isCauseError: boolean;
    readonly type: 'DoSomething' | 'CauseError';
  }

  /** @name SugarfungeBundleCall (160) */
  interface SugarfungeBundleCall extends Enum {
    readonly isRegisterBundle: boolean;
    readonly asRegisterBundle: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly bundleId: H256;
      readonly schema: ITuple<[Vec<u64>, Vec<Vec<u64>>, Vec<Vec<u128>>]>;
      readonly metadata: Bytes;
    } & Struct;
    readonly isMintBundle: boolean;
    readonly asMintBundle: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly bundleId: H256;
      readonly amount: u128;
    } & Struct;
    readonly isBurnBundle: boolean;
    readonly asBurnBundle: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly bundleId: H256;
      readonly amount: u128;
    } & Struct;
    readonly type: 'RegisterBundle' | 'MintBundle' | 'BurnBundle';
  }

  /** @name SugarfungeBagCall (168) */
  interface SugarfungeBagCall extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly classId: u64;
      readonly metadata: Bytes;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly classId: u64;
      readonly owners: Vec<AccountId32>;
      readonly shares: Vec<u128>;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly bag: AccountId32;
      readonly classIds: Vec<u64>;
      readonly assetIds: Vec<Vec<u64>>;
      readonly amounts: Vec<Vec<u128>>;
    } & Struct;
    readonly isSweep: boolean;
    readonly asSweep: {
      readonly to: AccountId32;
      readonly bag: AccountId32;
    } & Struct;
    readonly type: 'Register' | 'Create' | 'Deposit' | 'Sweep';
  }

  /** @name SugarfungeExgineCall (169) */
  interface SugarfungeExgineCall extends Enum {
    readonly isDoSomething: boolean;
    readonly asDoSomething: {
      readonly something: u32;
    } & Struct;
    readonly isCauseError: boolean;
    readonly type: 'DoSomething' | 'CauseError';
  }

  /** @name SugarfungeMarketCall (170) */
  interface SugarfungeMarketCall extends Enum {
    readonly isCreateMarket: boolean;
    readonly asCreateMarket: {
      readonly marketId: u64;
    } & Struct;
    readonly isCreateMarketRate: boolean;
    readonly asCreateMarketRate: {
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly rates: Vec<SugarfungeMarketAssetRate>;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isExchangeAssets: boolean;
    readonly asExchangeAssets: {
      readonly marketId: u64;
      readonly marketRateId: u64;
      readonly amount: u128;
    } & Struct;
    readonly type: 'CreateMarket' | 'CreateMarketRate' | 'Deposit' | 'ExchangeAssets';
  }

  /** @name FunctionlandFulaCall (173) */
  interface FunctionlandFulaCall extends Enum {
    readonly isUpdateManifest: boolean;
    readonly asUpdateManifest: {
      readonly cid: Bytes;
      readonly poolId: u32;
      readonly activeCycles: u16;
      readonly missedCycles: u16;
      readonly activeDays: i32;
    } & Struct;
    readonly isUploadManifest: boolean;
    readonly asUploadManifest: {
      readonly manifest: Bytes;
      readonly cid: Bytes;
      readonly poolId: u32;
      readonly replicationFactor: u16;
    } & Struct;
    readonly isBatchUploadManifest: boolean;
    readonly asBatchUploadManifest: {
      readonly manifest: Vec<Bytes>;
      readonly cids: Vec<Bytes>;
      readonly poolId: Vec<u32>;
      readonly replicationFactor: Vec<u16>;
    } & Struct;
    readonly isStorageManifest: boolean;
    readonly asStorageManifest: {
      readonly cid: Bytes;
      readonly poolId: u32;
    } & Struct;
    readonly isBatchStorageManifest: boolean;
    readonly asBatchStorageManifest: {
      readonly cids: Vec<Bytes>;
      readonly poolId: u32;
    } & Struct;
    readonly isRemoveStoredManifest: boolean;
    readonly asRemoveStoredManifest: {
      readonly cid: Bytes;
      readonly poolId: u32;
    } & Struct;
    readonly isBatchRemoveStoredManifest: boolean;
    readonly asBatchRemoveStoredManifest: {
      readonly cids: Vec<Bytes>;
      readonly poolId: u32;
    } & Struct;
    readonly isRemoveManifest: boolean;
    readonly asRemoveManifest: {
      readonly cid: Bytes;
      readonly poolId: u32;
    } & Struct;
    readonly isBatchRemoveManifest: boolean;
    readonly asBatchRemoveManifest: {
      readonly cids: Vec<Bytes>;
      readonly poolIds: Vec<u32>;
    } & Struct;
    readonly isVerifyManifests: boolean;
    readonly isGetManifests: boolean;
    readonly asGetManifests: {
      readonly poolId: Option<u32>;
      readonly uploader: Option<AccountId32>;
      readonly storer: Option<AccountId32>;
    } & Struct;
    readonly isGetAvailableManifests: boolean;
    readonly asGetAvailableManifests: {
      readonly poolId: Option<u32>;
    } & Struct;
    readonly isGetManifestsStorerData: boolean;
    readonly asGetManifestsStorerData: {
      readonly poolId: Option<u32>;
      readonly storer: Option<AccountId32>;
    } & Struct;
    readonly isGenerateChallenge: boolean;
    readonly isVerifyChallenge: boolean;
    readonly asVerifyChallenge: {
      readonly poolId: u32;
      readonly cids: Vec<Bytes>;
      readonly classId: u64;
      readonly assetId: u64;
    } & Struct;
    readonly isMintLaborTokens: boolean;
    readonly asMintLaborTokens: {
      readonly classId: u64;
      readonly assetId: u64;
      readonly amount: u128;
    } & Struct;
    readonly isUpdateFileSize: boolean;
    readonly asUpdateFileSize: {
      readonly cid: Bytes;
      readonly poolId: u32;
      readonly size_: u64;
    } & Struct;
    readonly isUpdateFileSizes: boolean;
    readonly asUpdateFileSizes: {
      readonly cids: Vec<Bytes>;
      readonly poolId: u32;
      readonly sizes: Vec<u64>;
    } & Struct;
    readonly type: 'UpdateManifest' | 'UploadManifest' | 'BatchUploadManifest' | 'StorageManifest' | 'BatchStorageManifest' | 'RemoveStoredManifest' | 'BatchRemoveStoredManifest' | 'RemoveManifest' | 'BatchRemoveManifest' | 'VerifyManifests' | 'GetManifests' | 'GetAvailableManifests' | 'GetManifestsStorerData' | 'GenerateChallenge' | 'VerifyChallenge' | 'MintLaborTokens' | 'UpdateFileSize' | 'UpdateFileSizes';
  }

  /** @name FulaPoolCall (177) */
  interface FulaPoolCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly name: Bytes;
      readonly region: Bytes;
      readonly peerId: Bytes;
    } & Struct;
    readonly isLeavePool: boolean;
    readonly asLeavePool: {
      readonly poolId: u32;
    } & Struct;
    readonly isJoin: boolean;
    readonly asJoin: {
      readonly poolId: u32;
      readonly peerId: Bytes;
    } & Struct;
    readonly isCancelJoin: boolean;
    readonly asCancelJoin: {
      readonly poolId: u32;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly poolId: u32;
      readonly account: AccountId32;
      readonly positive: bool;
      readonly peerId: Bytes;
    } & Struct;
    readonly type: 'Create' | 'LeavePool' | 'Join' | 'CancelJoin' | 'Vote';
  }

  /** @name PalletSudoError (179) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean;
    readonly type: 'RequireSudo';
  }

  /** @name PalletSchedulerScheduled (182) */
  interface PalletSchedulerScheduled extends Struct {
    readonly maybeId: Option<U8aFixed>;
    readonly priority: u8;
    readonly call: FrameSupportPreimagesBounded;
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
    readonly origin: SugarfungeRuntimeOriginCaller;
  }

  /** @name FrameSupportPreimagesBounded (183) */
  interface FrameSupportPreimagesBounded extends Enum {
    readonly isLegacy: boolean;
    readonly asLegacy: {
      readonly hash_: H256;
    } & Struct;
    readonly isInline: boolean;
    readonly asInline: Bytes;
    readonly isLookup: boolean;
    readonly asLookup: {
      readonly hash_: H256;
      readonly len: u32;
    } & Struct;
    readonly type: 'Legacy' | 'Inline' | 'Lookup';
  }

  /** @name SugarfungeRuntimeOriginCaller (185) */
  interface SugarfungeRuntimeOriginCaller extends Enum {
    readonly isSystem: boolean;
    readonly asSystem: FrameSupportDispatchRawOrigin;
    readonly isVoid: boolean;
    readonly isCouncil: boolean;
    readonly asCouncil: PalletCollectiveRawOrigin;
    readonly type: 'System' | 'Void' | 'Council';
  }

  /** @name FrameSupportDispatchRawOrigin (186) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly isNone: boolean;
    readonly type: 'Root' | 'Signed' | 'None';
  }

  /** @name PalletCollectiveRawOrigin (187) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean;
    readonly asMembers: ITuple<[u32, u32]>;
    readonly isMember: boolean;
    readonly asMember: AccountId32;
    readonly isPhantom: boolean;
    readonly type: 'Members' | 'Member' | 'Phantom';
  }

  /** @name PalletSchedulerError (189) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean;
    readonly isNotFound: boolean;
    readonly isTargetBlockNumberInPast: boolean;
    readonly isRescheduleNoChange: boolean;
    readonly isNamed: boolean;
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange' | 'Named';
  }

  /** @name PalletCollectiveVotes (191) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32;
    readonly threshold: u32;
    readonly ayes: Vec<AccountId32>;
    readonly nays: Vec<AccountId32>;
    readonly end: u32;
  }

  /** @name PalletCollectiveError (192) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalMissing: boolean;
    readonly isWrongIndex: boolean;
    readonly isDuplicateVote: boolean;
    readonly isAlreadyInitialized: boolean;
    readonly isTooEarly: boolean;
    readonly isTooManyProposals: boolean;
    readonly isWrongProposalWeight: boolean;
    readonly isWrongProposalLength: boolean;
    readonly type: 'NotMember' | 'DuplicateProposal' | 'ProposalMissing' | 'WrongIndex' | 'DuplicateVote' | 'AlreadyInitialized' | 'TooEarly' | 'TooManyProposals' | 'WrongProposalWeight' | 'WrongProposalLength';
  }

  /** @name SugarfungeValidatorSetError (194) */
  interface SugarfungeValidatorSetError extends Enum {
    readonly isTooLowValidatorCount: boolean;
    readonly isDuplicate: boolean;
    readonly isValidatorNotApproved: boolean;
    readonly isBadOrigin: boolean;
    readonly type: 'TooLowValidatorCount' | 'Duplicate' | 'ValidatorNotApproved' | 'BadOrigin';
  }

  /** @name SpCoreCryptoKeyTypeId (198) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (199) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly isNoKeys: boolean;
    readonly isNoAccount: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
  }

  /** @name SugarfungeAssetClass (200) */
  interface SugarfungeAssetClass extends Struct {
    readonly owner: AccountId32;
    readonly metadata: Bytes;
  }

  /** @name SugarfungeAssetAsset (202) */
  interface SugarfungeAssetAsset extends Struct {
    readonly classId: u64;
    readonly creator: AccountId32;
    readonly metadata: Bytes;
  }

  /** @name SugarfungeAssetError (204) */
  interface SugarfungeAssetError extends Enum {
    readonly isUnknown: boolean;
    readonly isInUse: boolean;
    readonly isInvalidAssetId: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isNumOverflow: boolean;
    readonly isInvalidArrayLength: boolean;
    readonly isOverflow: boolean;
    readonly isInvalidClassId: boolean;
    readonly isNoPermission: boolean;
    readonly isClassNotFound: boolean;
    readonly isAssetNotFound: boolean;
    readonly type: 'Unknown' | 'InUse' | 'InvalidAssetId' | 'InsufficientBalance' | 'NumOverflow' | 'InvalidArrayLength' | 'Overflow' | 'InvalidClassId' | 'NoPermission' | 'ClassNotFound' | 'AssetNotFound';
  }

  /** @name SugarfungeDaoError (205) */
  interface SugarfungeDaoError extends Enum {
    readonly isNoneValue: boolean;
    readonly isStorageOverflow: boolean;
    readonly type: 'NoneValue' | 'StorageOverflow';
  }

  /** @name SugarfungeBundleBundle (206) */
  interface SugarfungeBundleBundle extends Struct {
    readonly creator: AccountId32;
    readonly classId: u64;
    readonly assetId: u64;
    readonly metadata: Bytes;
    readonly schema: ITuple<[Vec<u64>, Vec<Vec<u64>>, Vec<Vec<u128>>]>;
    readonly vault: AccountId32;
  }

  /** @name FrameSupportPalletId (207) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name SugarfungeBundleError (208) */
  interface SugarfungeBundleError extends Enum {
    readonly isInvalidBundleIdForBundle: boolean;
    readonly isBundleExists: boolean;
    readonly isBundleNotFound: boolean;
    readonly isNumOverflow: boolean;
    readonly isInvalidArrayLength: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isAssetExists: boolean;
    readonly isAccountNotOwner: boolean;
    readonly type: 'InvalidBundleIdForBundle' | 'BundleExists' | 'BundleNotFound' | 'NumOverflow' | 'InvalidArrayLength' | 'InsufficientBalance' | 'AssetExists' | 'AccountNotOwner';
  }

  /** @name SugarfungeBagBagClass (209) */
  interface SugarfungeBagBagClass extends Struct {
    readonly operator: AccountId32;
    readonly classId: u64;
  }

  /** @name SugarfungeBagBag (210) */
  interface SugarfungeBagBag extends Struct {
    readonly operator: AccountId32;
    readonly classId: u64;
    readonly assetId: u64;
    readonly totalShares: u128;
  }

  /** @name SugarfungeBagError (211) */
  interface SugarfungeBagError extends Enum {
    readonly isBagClassExists: boolean;
    readonly isBagExists: boolean;
    readonly isInvalidBagClass: boolean;
    readonly isInvalidBag: boolean;
    readonly isInvalidBagOperator: boolean;
    readonly isInvalidBagOwner: boolean;
    readonly isInvalidArrayLength: boolean;
    readonly isInsufficientShares: boolean;
    readonly type: 'BagClassExists' | 'BagExists' | 'InvalidBagClass' | 'InvalidBag' | 'InvalidBagOperator' | 'InvalidBagOwner' | 'InvalidArrayLength' | 'InsufficientShares';
  }

  /** @name SugarfungeExgineError (212) */
  interface SugarfungeExgineError extends Enum {
    readonly isNoneValue: boolean;
    readonly isStorageOverflow: boolean;
    readonly type: 'NoneValue' | 'StorageOverflow';
  }

  /** @name SugarfungeMarketMarket (213) */
  interface SugarfungeMarketMarket extends Struct {
    readonly owner: AccountId32;
    readonly vault: AccountId32;
  }

  /** @name SugarfungeMarketError (215) */
  interface SugarfungeMarketError extends Enum {
    readonly isOverflow: boolean;
    readonly isInsufficientAmount: boolean;
    readonly isInsufficientLiquidity: boolean;
    readonly isInvalidMarket: boolean;
    readonly isInvalidMarketRate: boolean;
    readonly isInvalidMarketOwner: boolean;
    readonly isNotAuthorizedToMintAsset: boolean;
    readonly isMarketExists: boolean;
    readonly isMarketRateExists: boolean;
    readonly isInvalidAsset: boolean;
    readonly isInvalidAssetRate: boolean;
    readonly isInvalidRateAccount: boolean;
    readonly isInvalidRateAmount: boolean;
    readonly isInvalidBurnPrice: boolean;
    readonly isInvalidBurnBalance: boolean;
    readonly isInvalidTransferPrice: boolean;
    readonly isInvalidTransferBalance: boolean;
    readonly isInvalidBuyer: boolean;
    readonly isInvalidArrayLength: boolean;
    readonly type: 'Overflow' | 'InsufficientAmount' | 'InsufficientLiquidity' | 'InvalidMarket' | 'InvalidMarketRate' | 'InvalidMarketOwner' | 'NotAuthorizedToMintAsset' | 'MarketExists' | 'MarketRateExists' | 'InvalidAsset' | 'InvalidAssetRate' | 'InvalidRateAccount' | 'InvalidRateAmount' | 'InvalidBurnPrice' | 'InvalidBurnBalance' | 'InvalidTransferPrice' | 'InvalidTransferBalance' | 'InvalidBuyer' | 'InvalidArrayLength';
  }

  /** @name FunctionlandFulaManifest (217) */
  interface FunctionlandFulaManifest extends Struct {
    readonly usersData: Vec<FunctionlandFulaUploaderData>;
    readonly manifestMetadata: Bytes;
    readonly size_: Option<u64>;
  }

  /** @name FunctionlandFulaChallenge (220) */
  interface FunctionlandFulaChallenge extends Struct {
    readonly challenger: AccountId32;
    readonly challengeState: FunctionlandFulaChallengeState;
  }

  /** @name FunctionlandFulaClaimData (221) */
  interface FunctionlandFulaClaimData extends Struct {
    readonly mintedLaborTokens: u128;
    readonly expectedLaborTokens: u128;
    readonly challengeTokens: u128;
  }

  /** @name FunctionlandFulaError (222) */
  interface FunctionlandFulaError extends Enum {
    readonly isNoneValue: boolean;
    readonly isStorageOverflow: boolean;
    readonly isReplicationFactorLimitReached: boolean;
    readonly isReplicationFactorInvalid: boolean;
    readonly isAccountAlreadyStorer: boolean;
    readonly isAccountNotStorer: boolean;
    readonly isAccountNotInPool: boolean;
    readonly isAccountNotUploader: boolean;
    readonly isAccountNotFound: boolean;
    readonly isManifestAlreadyExist: boolean;
    readonly isManifestNotFound: boolean;
    readonly isManifestNotStored: boolean;
    readonly isInvalidArrayLength: boolean;
    readonly isErrorPickingCIDToChallenge: boolean;
    readonly isErrorPickingAccountToChallenge: boolean;
    readonly isManifestStorerDataNotFound: boolean;
    readonly isNoFileSizeProvided: boolean;
    readonly isNoAccountsToChallenge: boolean;
    readonly type: 'NoneValue' | 'StorageOverflow' | 'ReplicationFactorLimitReached' | 'ReplicationFactorInvalid' | 'AccountAlreadyStorer' | 'AccountNotStorer' | 'AccountNotInPool' | 'AccountNotUploader' | 'AccountNotFound' | 'ManifestAlreadyExist' | 'ManifestNotFound' | 'ManifestNotStored' | 'InvalidArrayLength' | 'ErrorPickingCIDToChallenge' | 'ErrorPickingAccountToChallenge' | 'ManifestStorerDataNotFound' | 'NoFileSizeProvided' | 'NoAccountsToChallenge';
  }

  /** @name FulaPoolPool (223) */
  interface FulaPoolPool extends Struct {
    readonly name: Bytes;
    readonly owner: Option<AccountId32>;
    readonly parent: Option<u32>;
    readonly participants: Vec<AccountId32>;
    readonly requestNumber: u8;
    readonly region: Bytes;
  }

  /** @name FulaPoolPoolRequest (226) */
  interface FulaPoolPoolRequest extends Struct {
    readonly voted: Vec<AccountId32>;
    readonly positiveVotes: u16;
    readonly peerId: Bytes;
  }

  /** @name FulaPoolUser (227) */
  interface FulaPoolUser extends Struct {
    readonly poolId: Option<u32>;
    readonly requestPoolId: Option<u32>;
    readonly peerId: Bytes;
  }

  /** @name FulaPoolError (228) */
  interface FulaPoolError extends Enum {
    readonly isUserBusy: boolean;
    readonly isMaxPools: boolean;
    readonly isNameTooLong: boolean;
    readonly isPoolDoesNotExist: boolean;
    readonly isRequestDoesNotExist: boolean;
    readonly isCapacityReached: boolean;
    readonly isUserDoesNotExist: boolean;
    readonly isAccessDenied: boolean;
    readonly isInternalError: boolean;
    readonly isAlreadyVoted: boolean;
    readonly type: 'UserBusy' | 'MaxPools' | 'NameTooLong' | 'PoolDoesNotExist' | 'RequestDoesNotExist' | 'CapacityReached' | 'UserDoesNotExist' | 'AccessDenied' | 'InternalError' | 'AlreadyVoted';
  }

  /** @name SpRuntimeMultiSignature (230) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: SpCoreEd25519Signature;
    readonly isSr25519: boolean;
    readonly asSr25519: SpCoreSr25519Signature;
    readonly isEcdsa: boolean;
    readonly asEcdsa: SpCoreEcdsaSignature;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name SpCoreSr25519Signature (231) */
  interface SpCoreSr25519Signature extends U8aFixed {}

  /** @name SpCoreEcdsaSignature (232) */
  interface SpCoreEcdsaSignature extends U8aFixed {}

  /** @name FrameSystemExtensionsCheckNonZeroSender (235) */
  type FrameSystemExtensionsCheckNonZeroSender = Null;

  /** @name FrameSystemExtensionsCheckSpecVersion (236) */
  type FrameSystemExtensionsCheckSpecVersion = Null;

  /** @name FrameSystemExtensionsCheckTxVersion (237) */
  type FrameSystemExtensionsCheckTxVersion = Null;

  /** @name FrameSystemExtensionsCheckGenesis (238) */
  type FrameSystemExtensionsCheckGenesis = Null;

  /** @name FrameSystemExtensionsCheckNonce (241) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (242) */
  type FrameSystemExtensionsCheckWeight = Null;

  /** @name PalletTransactionPaymentChargeTransactionPayment (243) */
  interface PalletTransactionPaymentChargeTransactionPayment extends Compact<u128> {}

  /** @name SugarfungeRuntimeRuntime (244) */
  type SugarfungeRuntimeRuntime = Null;

} // declare module
