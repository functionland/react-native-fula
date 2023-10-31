// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    asset: {
      AssetNotFound: AugmentedError<ApiType>;
      ClassNotFound: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      InUse: AugmentedError<ApiType>;
      InvalidArrayLength: AugmentedError<ApiType>;
      InvalidAssetId: AugmentedError<ApiType>;
      InvalidClassId: AugmentedError<ApiType>;
      NoPermission: AugmentedError<ApiType>;
      NumOverflow: AugmentedError<ApiType>;
      Overflow: AugmentedError<ApiType>;
      Unknown: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bag: {
      BagClassExists: AugmentedError<ApiType>;
      BagExists: AugmentedError<ApiType>;
      InsufficientShares: AugmentedError<ApiType>;
      InvalidArrayLength: AugmentedError<ApiType>;
      InvalidBag: AugmentedError<ApiType>;
      InvalidBagClass: AugmentedError<ApiType>;
      InvalidBagOperator: AugmentedError<ApiType>;
      InvalidBagOwner: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist.
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit.
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account.
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account.
       **/
      Expendability: AugmentedError<ApiType>;
      /**
       * Balance too low to send value.
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal.
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of freezes exceed `MaxFreezes`.
       **/
      TooManyFreezes: AugmentedError<ApiType>;
      /**
       * Number of holds exceed `MaxHolds`.
       **/
      TooManyHolds: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed `MaxReserves`.
       **/
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value.
       **/
      VestingBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bundle: {
      AccountNotOwner: AugmentedError<ApiType>;
      AssetExists: AugmentedError<ApiType>;
      /**
       * Bundle already exists
       **/
      BundleExists: AugmentedError<ApiType>;
      /**
       * Bundle does not exists
       **/
      BundleNotFound: AugmentedError<ApiType>;
      /**
       * Insufficient asset balance
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Array is of wrong length
       **/
      InvalidArrayLength: AugmentedError<ApiType>;
      /**
       * Bundle hash does not match bundle id
       **/
      InvalidBundleIdForBundle: AugmentedError<ApiType>;
      /**
       * Number Overflow
       **/
      NumOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    dao: {
      /**
       * Error names should be descriptive.
       **/
      NoneValue: AugmentedError<ApiType>;
      /**
       * Errors should have helpful documentation associated with them.
       **/
      StorageOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    exgine: {
      /**
       * Error names should be descriptive.
       **/
      NoneValue: AugmentedError<ApiType>;
      /**
       * Errors should have helpful documentation associated with them.
       **/
      StorageOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    fula: {
      AccountAlreadyStorer: AugmentedError<ApiType>;
      AccountNotFound: AugmentedError<ApiType>;
      AccountNotInPool: AugmentedError<ApiType>;
      AccountNotStorer: AugmentedError<ApiType>;
      AccountNotUploader: AugmentedError<ApiType>;
      ErrorPickingAccountToChallenge: AugmentedError<ApiType>;
      ErrorPickingCIDToChallenge: AugmentedError<ApiType>;
      InvalidArrayLength: AugmentedError<ApiType>;
      ManifestAlreadyExist: AugmentedError<ApiType>;
      ManifestNotFound: AugmentedError<ApiType>;
      ManifestNotStored: AugmentedError<ApiType>;
      ManifestStorerDataNotFound: AugmentedError<ApiType>;
      NoAccountsToChallenge: AugmentedError<ApiType>;
      NoFileSizeProvided: AugmentedError<ApiType>;
      NoneValue: AugmentedError<ApiType>;
      ReplicationFactorInvalid: AugmentedError<ApiType>;
      ReplicationFactorLimitReached: AugmentedError<ApiType>;
      StorageOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    grandpa: {
      /**
       * Attempt to signal GRANDPA change with one already pending.
       **/
      ChangePending: AugmentedError<ApiType>;
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA pause when the authority set isn't live
       * (either paused or already pending pause).
       **/
      PauseFailed: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA resume when the authority set isn't paused
       * (either live or already pending resume).
       **/
      ResumeFailed: AugmentedError<ApiType>;
      /**
       * Cannot signal forced change so soon after last.
       **/
      TooSoon: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    market: {
      InsufficientAmount: AugmentedError<ApiType>;
      InsufficientLiquidity: AugmentedError<ApiType>;
      InvalidArrayLength: AugmentedError<ApiType>;
      InvalidAsset: AugmentedError<ApiType>;
      InvalidAssetRate: AugmentedError<ApiType>;
      InvalidBurnBalance: AugmentedError<ApiType>;
      InvalidBurnPrice: AugmentedError<ApiType>;
      InvalidBuyer: AugmentedError<ApiType>;
      InvalidMarket: AugmentedError<ApiType>;
      InvalidMarketOwner: AugmentedError<ApiType>;
      InvalidMarketRate: AugmentedError<ApiType>;
      InvalidRateAccount: AugmentedError<ApiType>;
      InvalidRateAmount: AugmentedError<ApiType>;
      InvalidTransferBalance: AugmentedError<ApiType>;
      InvalidTransferPrice: AugmentedError<ApiType>;
      MarketExists: AugmentedError<ApiType>;
      MarketRateExists: AugmentedError<ApiType>;
      NotAuthorizedToMintAsset: AugmentedError<ApiType>;
      Overflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    pool: {
      /**
       * Access denied due to invalid data, e.g. user is trying to leave the pool that it does
       * not belong to or vote without rights.
       **/
      AccessDenied: AugmentedError<ApiType>;
      /**
       * The user has already voted.
       * TODO: might be considered slashable behaviour as it wastes resources.
       **/
      AlreadyVoted: AugmentedError<ApiType>;
      /**
       * The pool is at max capacity.
       **/
      CapacityReached: AugmentedError<ApiType>;
      /**
       * Internal error.
       **/
      InternalError: AugmentedError<ApiType>;
      /**
       * Maximum pool number has been reached.
       **/
      MaxPools: AugmentedError<ApiType>;
      /**
       * The pool name supplied was too long.
       **/
      NameTooLong: AugmentedError<ApiType>;
      /**
       * The pool does not exist.
       **/
      PoolDoesNotExist: AugmentedError<ApiType>;
      /**
       * The pool join request does not exist.
       **/
      RequestDoesNotExist: AugmentedError<ApiType>;
      /**
       * User is already attached to a pool or has a pending join request.
       **/
      UserBusy: AugmentedError<ApiType>;
      /**
       * The user does not exist.
       **/
      UserDoesNotExist: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Attempt to use a non-named function on a named task.
       **/
      Named: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    session: {
      /**
       * Registered duplicate key.
       **/
      DuplicatedKey: AugmentedError<ApiType>;
      /**
       * Invalid ownership proof.
       **/
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * No associated validator ID for account.
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * No keys are associated with this account.
       **/
      NoKeys: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    validatorSet: {
      /**
       * Only the validator can add itself back after coming online.
       **/
      BadOrigin: AugmentedError<ApiType>;
      /**
       * Validator is already in the validator set.
       **/
      Duplicate: AugmentedError<ApiType>;
      /**
       * Target (post-removal) validator count is below the minimum.
       **/
      TooLowValidatorCount: AugmentedError<ApiType>;
      /**
       * Validator is not approved for re-addition.
       **/
      ValidatorNotApproved: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
