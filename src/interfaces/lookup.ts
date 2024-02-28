// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

 

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::types::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData'
  },
  /**
   * Lookup5: pallet_balances::types::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128',
    flags: 'u128'
  },
  /**
   * Lookup8: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'SpWeightsWeightV2Weight',
    operational: 'SpWeightsWeightV2Weight',
    mandatory: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup9: sp_weights::weight_v2::Weight
   **/
  SpWeightsWeightV2Weight: {
    refTime: 'Compact<u64>',
    proofSize: 'Compact<u64>'
  },
  /**
   * Lookup14: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup16: sp_runtime::generic::digest::DigestItem
   **/
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: 'Bytes',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Consensus: '([u8;4],Bytes)',
      Seal: '([u8;4],Bytes)',
      PreRuntime: '([u8;4],Bytes)',
      __Unused7: 'Null',
      RuntimeEnvironmentUpdated: 'Null'
    }
  },
  /**
   * Lookup19: frame_system::EventRecord<sugarfunge_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup21: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      ExtrinsicFailed: {
        dispatchError: 'SpRuntimeDispatchError',
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      CodeUpdated: 'Null',
      NewAccount: {
        account: 'AccountId32',
      },
      KilledAccount: {
        account: 'AccountId32',
      },
      Remarked: {
        _alias: {
          hash_: 'hash',
        },
        sender: 'AccountId32',
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup22: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'SpWeightsWeightV2Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays'
  },
  /**
   * Lookup23: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup24: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup25: sp_runtime::DispatchError
   **/
  SpRuntimeDispatchError: {
    _enum: {
      Other: 'Null',
      CannotLookup: 'Null',
      BadOrigin: 'Null',
      Module: 'SpRuntimeModuleError',
      ConsumerRemaining: 'Null',
      NoProviders: 'Null',
      TooManyConsumers: 'Null',
      Token: 'SpRuntimeTokenError',
      Arithmetic: 'SpArithmeticArithmeticError',
      Transactional: 'SpRuntimeTransactionalError',
      Exhausted: 'Null',
      Corruption: 'Null',
      Unavailable: 'Null',
      RootNotAllowed: 'Null'
    }
  },
  /**
   * Lookup26: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]'
  },
  /**
   * Lookup27: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['FundsUnavailable', 'OnlyProvider', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported', 'CannotCreateHold', 'NotExpendable', 'Blocked']
  },
  /**
   * Lookup28: sp_arithmetic::ArithmeticError
   **/
  SpArithmeticArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup29: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer']
  },
  /**
   * Lookup30: pallet_grandpa::pallet::Event
   **/
  PalletGrandpaEvent: {
    _enum: {
      NewAuthorities: {
        authoritySet: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
      },
      Paused: 'Null',
      Resumed: 'Null'
    }
  },
  /**
   * Lookup33: sp_consensus_grandpa::app::Public
   **/
  SpConsensusGrandpaAppPublic: 'SpCoreEd25519Public',
  /**
   * Lookup34: sp_core::ed25519::Public
   **/
  SpCoreEd25519Public: '[u8;32]',
  /**
   * Lookup35: pallet_balances::pallet::Event<T, I>
   **/
  PalletBalancesEvent: {
    _enum: {
      Endowed: {
        account: 'AccountId32',
        freeBalance: 'u128',
      },
      DustLost: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Transfer: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      BalanceSet: {
        who: 'AccountId32',
        free: 'u128',
      },
      Reserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unreserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      ReserveRepatriated: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
        destinationStatus: 'FrameSupportTokensMiscBalanceStatus',
      },
      Deposit: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Withdraw: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Slashed: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Minted: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Burned: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Suspended: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Restored: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Upgraded: {
        who: 'AccountId32',
      },
      Issued: {
        amount: 'u128',
      },
      Rescinded: {
        amount: 'u128',
      },
      Locked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unlocked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Frozen: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Thawed: {
        who: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup36: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup37: pallet_transaction_payment::pallet::Event<T>
   **/
  PalletTransactionPaymentEvent: {
    _enum: {
      TransactionFeePaid: {
        who: 'AccountId32',
        actualFee: 'u128',
        tip: 'u128'
      }
    }
  },
  /**
   * Lookup38: pallet_sudo::pallet::Event<T>
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
      KeyChanged: {
        oldSudoer: 'Option<AccountId32>',
      },
      SudoAsDone: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup42: pallet_scheduler::pallet::Event<T>
   **/
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: {
        when: 'u32',
        index: 'u32',
      },
      Canceled: {
        when: 'u32',
        index: 'u32',
      },
      Dispatched: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallUnavailable: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PeriodicFailed: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PermanentlyOverweight: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>'
      }
    }
  },
  /**
   * Lookup45: pallet_collective::pallet::Event<T, I>
   **/
  PalletCollectiveEvent: {
    _enum: {
      Proposed: {
        account: 'AccountId32',
        proposalIndex: 'u32',
        proposalHash: 'H256',
        threshold: 'u32',
      },
      Voted: {
        account: 'AccountId32',
        proposalHash: 'H256',
        voted: 'bool',
        yes: 'u32',
        no: 'u32',
      },
      Approved: {
        proposalHash: 'H256',
      },
      Disapproved: {
        proposalHash: 'H256',
      },
      Executed: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MemberExecuted: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      Closed: {
        proposalHash: 'H256',
        yes: 'u32',
        no: 'u32'
      }
    }
  },
  /**
   * Lookup47: sugarfunge_validator_set::pallet::Event<T>
   **/
  SugarfungeValidatorSetEvent: {
    _enum: {
      ValidatorAdditionInitiated: 'AccountId32',
      ValidatorRemovalInitiated: 'AccountId32'
    }
  },
  /**
   * Lookup48: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32'
      }
    }
  },
  /**
   * Lookup49: sugarfunge_asset::pallet::Event<T>
   **/
  SugarfungeAssetEvent: {
    _enum: {
      ClassCreated: {
        classId: 'u64',
        who: 'AccountId32',
      },
      AssetCreated: {
        classId: 'u64',
        assetId: 'u64',
        who: 'AccountId32',
      },
      AssetMetadataUpdated: {
        classId: 'u64',
        assetId: 'u64',
        who: 'AccountId32',
        metadata: 'Bytes',
      },
      Mint: {
        who: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      BatchMint: {
        who: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      Burn: {
        who: 'AccountId32',
        from: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      BatchBurn: {
        who: 'AccountId32',
        from: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      Transferred: {
        who: 'AccountId32',
        from: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      BatchTransferred: {
        who: 'AccountId32',
        from: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      OperatorApprovalForAll: {
        who: 'AccountId32',
        operator: 'AccountId32',
        classId: 'u64',
        approved: 'bool'
      }
    }
  },
  /**
   * Lookup52: sugarfunge_dao::pallet::Event<T>
   **/
  SugarfungeDaoEvent: {
    _enum: {
      SomethingStored: '(u32,AccountId32)'
    }
  },
  /**
   * Lookup53: sugarfunge_bundle::pallet::Event<T>
   **/
  SugarfungeBundleEvent: {
    _enum: {
      Register: {
        bundleId: 'H256',
        who: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
      },
      Mint: {
        bundleId: 'H256',
        who: 'AccountId32',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      Burn: {
        bundleId: 'H256',
        who: 'AccountId32',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup54: sugarfunge_bag::pallet::Event<T>
   **/
  SugarfungeBagEvent: {
    _enum: {
      Register: {
        who: 'AccountId32',
        classId: 'u64',
      },
      Created: {
        bag: 'AccountId32',
        who: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        owners: 'Vec<AccountId32>',
      },
      Deposit: {
        bag: 'AccountId32',
        who: 'AccountId32',
      },
      Sweep: {
        bag: 'AccountId32',
        who: 'AccountId32',
        to: 'AccountId32'
      }
    }
  },
  /**
   * Lookup56: sugarfunge_exgine::pallet::Event<T>
   **/
  SugarfungeExgineEvent: {
    _enum: {
      SomethingStored: '(u32,AccountId32)'
    }
  },
  /**
   * Lookup57: sugarfunge_market::pallet::Event<T>
   **/
  SugarfungeMarketEvent: {
    _enum: {
      Created: {
        marketId: 'u64',
        who: 'AccountId32',
      },
      RateCreated: {
        marketId: 'u64',
        marketRateId: 'u64',
        who: 'AccountId32',
      },
      LiquidityAdded: {
        who: 'AccountId32',
        marketId: 'u64',
        marketRateId: 'u64',
        classIds: 'Vec<u64>',
        assetIds: 'Vec<Vec<u64>>',
        amounts: 'Vec<Vec<u128>>',
      },
      LiquidityRemoved: {
        who: 'AccountId32',
        marketId: 'u64',
        marketRateId: 'u64',
        classIds: 'Vec<u64>',
        assetIds: 'Vec<Vec<u64>>',
        amounts: 'Vec<Vec<u128>>',
      },
      Deposit: {
        who: 'AccountId32',
        marketId: 'u64',
        marketRateId: 'u64',
        amount: 'u128',
        balances: 'Vec<SugarfungeMarketRateBalance>',
        success: 'bool',
      },
      Exchanged: {
        buyer: 'AccountId32',
        marketId: 'u64',
        marketRateId: 'u64',
        amount: 'u128',
        balances: 'Vec<SugarfungeMarketRateBalance>',
        success: 'bool'
      }
    }
  },
  /**
   * Lookup61: sugarfunge_market::RateBalance<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeMarketRateBalance: {
    rate: 'SugarfungeMarketAssetRate',
    balance: 'i128'
  },
  /**
   * Lookup62: sugarfunge_market::AssetRate<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeMarketAssetRate: {
    classId: 'u64',
    assetId: 'u64',
    action: 'SugarfungeMarketRateAction',
    from: 'SugarfungeMarketRateAccount',
    to: 'SugarfungeMarketRateAccount'
  },
  /**
   * Lookup63: sugarfunge_market::RateAction<ClassId, AssetId>
   **/
  SugarfungeMarketRateAction: {
    _enum: {
      Transfer: 'i128',
      MarketTransfer: '(SugarfungeMarketAmm,u64,u64)',
      Mint: 'i128',
      Burn: 'i128',
      Has: '(SugarfungeMarketAmountOp,i128)'
    }
  },
  /**
   * Lookup65: sugarfunge_market::AMM
   **/
  SugarfungeMarketAmm: {
    _enum: ['Constant']
  },
  /**
   * Lookup66: sugarfunge_market::AmountOp
   **/
  SugarfungeMarketAmountOp: {
    _enum: ['Equal', 'LessThan', 'LessEqualThan', 'GreaterThan', 'GreaterEqualThan']
  },
  /**
   * Lookup67: sugarfunge_market::RateAccount<sp_core::crypto::AccountId32>
   **/
  SugarfungeMarketRateAccount: {
    _enum: {
      Market: 'Null',
      Account: 'AccountId32',
      Buyer: 'Null'
    }
  },
  /**
   * Lookup68: functionland_fula::pallet::Event<T>
   **/
  FunctionlandFulaEvent: {
    _enum: {
      ManifestOutput: {
        uploader: 'AccountId32',
        storer: 'Vec<AccountId32>',
        poolId: 'u32',
        manifest: 'Bytes',
      },
      StorageManifestOutput: {
        storer: 'AccountId32',
        poolId: 'u32',
        cid: 'Bytes',
      },
      RemoveStorerOutput: {
        storer: 'Option<AccountId32>',
        poolId: 'u32',
        cid: 'Bytes',
      },
      ManifestRemoved: {
        uploader: 'AccountId32',
        poolId: 'u32',
        cid: 'Bytes',
      },
      ManifestStorageUpdated: {
        storer: 'AccountId32',
        poolId: 'u32',
        cid: 'Bytes',
        activeCycles: 'u16',
        missedCycles: 'u16',
        activeDays: 'i32',
      },
      BatchManifestOutput: {
        uploader: 'AccountId32',
        poolIds: 'Vec<u32>',
        manifests: 'Vec<Bytes>',
      },
      BatchStorageManifestOutput: {
        storer: 'AccountId32',
        poolId: 'u32',
        cids: 'Vec<Bytes>',
      },
      BatchRemoveStorerOutput: {
        storer: 'AccountId32',
        poolId: 'u32',
        cids: 'Vec<Bytes>',
      },
      BatchManifestRemoved: {
        uploader: 'AccountId32',
        poolIds: 'Vec<u32>',
        cids: 'Vec<Bytes>',
      },
      VerifiedStorerManifests: {
        storer: 'AccountId32',
        validCids: 'Vec<Bytes>',
        invalidCids: 'Vec<Bytes>',
      },
      UpdateFileSizeOutput: {
        _alias: {
          size_: 'size',
        },
        account: 'AccountId32',
        poolId: 'u32',
        cid: 'Bytes',
        size_: 'u64',
      },
      UpdateFileSizesOutput: {
        account: 'AccountId32',
        poolId: 'u32',
        cids: 'Vec<Bytes>',
        sizes: 'Vec<u64>',
      },
      GetManifests: {
        manifests: 'Vec<FunctionlandFulaManifestWithPoolId>',
      },
      GetAvailableManifests: {
        manifests: 'Vec<FunctionlandFulaManifestAvailable>',
      },
      GetManifestsStorerData: {
        manifests: 'Vec<FunctionlandFulaStorerData>',
      },
      Challenge: {
        challenger: 'AccountId32',
        challenged: 'AccountId32',
        cid: 'Bytes',
        state: 'FunctionlandFulaChallengeState',
      },
      VerifiedChallenges: {
        challenged: 'AccountId32',
        successful: 'Vec<Bytes>',
        failed: 'Vec<Bytes>',
      },
      MintedLaborTokens: {
        account: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
        calculatedAmount: 'u128'
      }
    }
  },
  /**
   * Lookup74: functionland_fula::ManifestWithPoolId<PoolId, sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  FunctionlandFulaManifestWithPoolId: {
    _alias: {
      size_: 'size'
    },
    poolId: 'u32',
    usersData: 'Vec<FunctionlandFulaUploaderData>',
    manifestMetadata: 'Bytes',
    size_: 'Option<u64>'
  },
  /**
   * Lookup77: functionland_fula::UploaderData<sp_core::crypto::AccountId32>
   **/
  FunctionlandFulaUploaderData: {
    uploader: 'AccountId32',
    storers: 'Vec<AccountId32>',
    replicationFactor: 'u16'
  },
  /**
   * Lookup80: functionland_fula::ManifestAvailable<PoolId, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  FunctionlandFulaManifestAvailable: {
    poolId: 'u32',
    replicationFactor: 'u16',
    manifestMetadata: 'Bytes'
  },
  /**
   * Lookup82: functionland_fula::StorerData<PoolId, bounded_collections::bounded_vec::BoundedVec<T, S>, sp_core::crypto::AccountId32>
   **/
  FunctionlandFulaStorerData: {
    poolId: 'u32',
    cid: 'Bytes',
    account: 'AccountId32',
    manifestData: 'FunctionlandFulaManifestStorageData'
  },
  /**
   * Lookup84: functionland_fula::ManifestStorageData
   **/
  FunctionlandFulaManifestStorageData: {
    activeCycles: 'u16',
    missedCycles: 'u16',
    activeDays: 'i32',
    challengeState: 'FunctionlandFulaChallengeState'
  },
  /**
   * Lookup85: functionland_fula::ChallengeState
   **/
  FunctionlandFulaChallengeState: {
    _enum: ['Open', 'Successful', 'Failed']
  },
  /**
   * Lookup86: fula_pool::pallet::Event<T>
   **/
  FulaPoolEvent: {
    _enum: {
      PoolCreated: {
        owner: 'Option<AccountId32>',
        poolId: 'u32',
      },
      JoinRequested: {
        account: 'AccountId32',
        poolId: 'u32',
      },
      RequestWithdrawn: {
        account: 'AccountId32',
        poolId: 'u32',
      },
      VotingResult: {
        account: 'AccountId32',
        poolId: 'u32',
        result: 'Bytes',
      },
      CapacityReached: {
        poolId: 'u32',
      },
      ParticipantLeft: {
        account: 'AccountId32',
        poolId: 'u32'
      }
    }
  },
  /**
   * Lookup87: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup90: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup93: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_storage: {
        items: 'Vec<(Bytes,Bytes)>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Bytes>',
      },
      kill_prefix: {
        prefix: 'Bytes',
        subkeys: 'u32',
      },
      remark_with_event: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup96: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup97: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup98: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup100: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup101: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup102: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup103: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32',
    stateVersion: 'u8'
  },
  /**
   * Lookup108: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered']
  },
  /**
   * Lookup109: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup110: pallet_grandpa::StoredState<N>
   **/
  PalletGrandpaStoredState: {
    _enum: {
      Live: 'Null',
      PendingPause: {
        scheduledAt: 'u32',
        delay: 'u32',
      },
      Paused: 'Null',
      PendingResume: {
        scheduledAt: 'u32',
        delay: 'u32'
      }
    }
  },
  /**
   * Lookup111: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpConsensusGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup114: pallet_grandpa::pallet::Call<T>
   **/
  PalletGrandpaCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpConsensusGrandpaEquivocationProof',
        keyOwnerProof: 'SpCoreVoid',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpConsensusGrandpaEquivocationProof',
        keyOwnerProof: 'SpCoreVoid',
      },
      note_stalled: {
        delay: 'u32',
        bestFinalizedBlockNumber: 'u32'
      }
    }
  },
  /**
   * Lookup115: sp_consensus_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpConsensusGrandpaEquivocation'
  },
  /**
   * Lookup116: sp_consensus_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpConsensusGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup117: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup118: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup119: sp_consensus_grandpa::app::Signature
   **/
  SpConsensusGrandpaAppSignature: 'SpCoreEd25519Signature',
  /**
   * Lookup120: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup123: finality_grandpa::Equivocation<sp_consensus_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_consensus_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpConsensusGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpConsensusGrandpaAppSignature)'
  },
  /**
   * Lookup124: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup126: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup127: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup129: pallet_balances::types::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup130: pallet_balances::types::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup133: pallet_balances::types::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup136: pallet_balances::types::IdAmount<Id, Balance>
   **/
  PalletBalancesIdAmount: {
    id: 'Null',
    amount: 'u128'
  },
  /**
   * Lookup138: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer_allow_death: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance_deprecated: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        oldReserved: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        keepAlive: 'bool',
      },
      force_unreserve: {
        who: 'MultiAddress',
        amount: 'u128',
      },
      upgrade_accounts: {
        who: 'Vec<AccountId32>',
      },
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      force_set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>'
      }
    }
  },
  /**
   * Lookup143: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'Expendability', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves', 'TooManyHolds', 'TooManyFreezes']
  },
  /**
   * Lookup145: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2']
  },
  /**
   * Lookup146: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      sudo_as: {
        who: 'MultiAddress',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup148: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: '[u8;32]',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel_named: {
        id: '[u8;32]',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      schedule_named_after: {
        id: '[u8;32]',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup150: pallet_collective::pallet::Call<T, I>
   **/
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId32>',
        prime: 'Option<AccountId32>',
        oldCount: 'u32',
      },
      execute: {
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      propose: {
        threshold: 'Compact<u32>',
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      vote: {
        proposal: 'H256',
        index: 'Compact<u32>',
        approve: 'bool',
      },
      __Unused4: 'Null',
      disapprove_proposal: {
        proposalHash: 'H256',
      },
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'SpWeightsWeightV2Weight',
        lengthBound: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup151: sugarfunge_validator_set::pallet::Call<T>
   **/
  SugarfungeValidatorSetCall: {
    _enum: {
      add_validator: {
        validatorId: 'AccountId32',
      },
      remove_validator: {
        validatorId: 'AccountId32',
      },
      add_validator_again: {
        validatorId: 'AccountId32'
      }
    }
  },
  /**
   * Lookup152: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'SugarfungeRuntimeOpaqueSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null'
    }
  },
  /**
   * Lookup153: sugarfunge_runtime::opaque::SessionKeys
   **/
  SugarfungeRuntimeOpaqueSessionKeys: {
    aura: 'SpConsensusAuraSr25519AppSr25519Public',
    grandpa: 'SpConsensusGrandpaAppPublic'
  },
  /**
   * Lookup154: sp_consensus_aura::sr25519::app_sr25519::Public
   **/
  SpConsensusAuraSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup155: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup156: sugarfunge_asset::pallet::Call<T>
   **/
  SugarfungeAssetCall: {
    _enum: {
      create_class: {
        owner: 'AccountId32',
        classId: 'u64',
        metadata: 'Bytes',
      },
      create_asset: {
        classId: 'u64',
        assetId: 'u64',
        metadata: 'Bytes',
      },
      transfer_from: {
        from: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      batch_transfer_from: {
        from: 'AccountId32',
        to: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      mint: {
        to: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      batch_mint: {
        to: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      burn: {
        from: 'AccountId32',
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      batch_burn: {
        from: 'AccountId32',
        classId: 'u64',
        assetIds: 'Vec<u64>',
        amounts: 'Vec<u128>',
      },
      update_class_metadata: {
        classId: 'u64',
        metadata: 'Bytes',
      },
      update_asset_metadata: {
        classId: 'u64',
        assetId: 'u64',
        metadata: 'Bytes'
      }
    }
  },
  /**
   * Lookup159: sugarfunge_dao::pallet::Call<T>
   **/
  SugarfungeDaoCall: {
    _enum: {
      do_something: {
        something: 'u32',
      },
      cause_error: 'Null'
    }
  },
  /**
   * Lookup160: sugarfunge_bundle::pallet::Call<T>
   **/
  SugarfungeBundleCall: {
    _enum: {
      register_bundle: {
        classId: 'u64',
        assetId: 'u64',
        bundleId: 'H256',
        schema: '(Vec<u64>,Vec<Vec<u64>>,Vec<Vec<u128>>)',
        metadata: 'Bytes',
      },
      mint_bundle: {
        from: 'AccountId32',
        to: 'AccountId32',
        bundleId: 'H256',
        amount: 'u128',
      },
      burn_bundle: {
        from: 'AccountId32',
        to: 'AccountId32',
        bundleId: 'H256',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup168: sugarfunge_bag::pallet::Call<T>
   **/
  SugarfungeBagCall: {
    _enum: {
      register: {
        classId: 'u64',
        metadata: 'Bytes',
      },
      create: {
        classId: 'u64',
        owners: 'Vec<AccountId32>',
        shares: 'Vec<u128>',
      },
      deposit: {
        bag: 'AccountId32',
        classIds: 'Vec<u64>',
        assetIds: 'Vec<Vec<u64>>',
        amounts: 'Vec<Vec<u128>>',
      },
      sweep: {
        to: 'AccountId32',
        bag: 'AccountId32'
      }
    }
  },
  /**
   * Lookup169: sugarfunge_exgine::pallet::Call<T>
   **/
  SugarfungeExgineCall: {
    _enum: {
      do_something: {
        something: 'u32',
      },
      cause_error: 'Null'
    }
  },
  /**
   * Lookup170: sugarfunge_market::pallet::Call<T>
   **/
  SugarfungeMarketCall: {
    _enum: {
      create_market: {
        marketId: 'u64',
      },
      create_market_rate: {
        marketId: 'u64',
        marketRateId: 'u64',
        rates: 'Vec<SugarfungeMarketAssetRate>',
      },
      deposit: {
        marketId: 'u64',
        marketRateId: 'u64',
        amount: 'u128',
      },
      exchange_assets: {
        marketId: 'u64',
        marketRateId: 'u64',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup173: functionland_fula::pallet::Call<T>
   **/
  FunctionlandFulaCall: {
    _enum: {
      update_manifest: {
        cid: 'Bytes',
        poolId: 'u32',
        activeCycles: 'u16',
        missedCycles: 'u16',
        activeDays: 'i32',
      },
      upload_manifest: {
        manifest: 'Bytes',
        cid: 'Bytes',
        poolId: 'u32',
        replicationFactor: 'u16',
      },
      batch_upload_manifest: {
        manifest: 'Vec<Bytes>',
        cids: 'Vec<Bytes>',
        poolId: 'Vec<u32>',
        replicationFactor: 'Vec<u16>',
      },
      storage_manifest: {
        cid: 'Bytes',
        poolId: 'u32',
      },
      batch_storage_manifest: {
        cids: 'Vec<Bytes>',
        poolId: 'u32',
      },
      remove_stored_manifest: {
        cid: 'Bytes',
        poolId: 'u32',
      },
      batch_remove_stored_manifest: {
        cids: 'Vec<Bytes>',
        poolId: 'u32',
      },
      remove_manifest: {
        cid: 'Bytes',
        poolId: 'u32',
      },
      batch_remove_manifest: {
        cids: 'Vec<Bytes>',
        poolIds: 'Vec<u32>',
      },
      verify_manifests: 'Null',
      get_manifests: {
        poolId: 'Option<u32>',
        uploader: 'Option<AccountId32>',
        storer: 'Option<AccountId32>',
      },
      get_available_manifests: {
        poolId: 'Option<u32>',
      },
      get_manifests_storer_data: {
        poolId: 'Option<u32>',
        storer: 'Option<AccountId32>',
      },
      generate_challenge: 'Null',
      verify_challenge: {
        poolId: 'u32',
        cids: 'Vec<Bytes>',
        classId: 'u64',
        assetId: 'u64',
      },
      mint_labor_tokens: {
        classId: 'u64',
        assetId: 'u64',
        amount: 'u128',
      },
      update_file_size: {
        _alias: {
          size_: 'size',
        },
        cid: 'Bytes',
        poolId: 'u32',
        size_: 'u64',
      },
      update_file_sizes: {
        cids: 'Vec<Bytes>',
        poolId: 'u32',
        sizes: 'Vec<u64>'
      }
    }
  },
  /**
   * Lookup177: fula_pool::pallet::Call<T>
   **/
  FulaPoolCall: {
    _enum: {
      create: {
        name: 'Bytes',
        region: 'Bytes',
        peerId: 'Bytes',
      },
      leave_pool: {
        poolId: 'u32',
      },
      join: {
        poolId: 'u32',
        peerId: 'Bytes',
      },
      cancel_join: {
        poolId: 'u32',
      },
      vote: {
        poolId: 'u32',
        account: 'AccountId32',
        positive: 'bool',
        peerId: 'Bytes'
      }
    }
  },
  /**
   * Lookup179: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup182: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<sugarfunge_runtime::RuntimeCall>, BlockNumber, sugarfunge_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'SugarfungeRuntimeOriginCaller'
  },
  /**
   * Lookup183: frame_support::traits::preimages::Bounded<sugarfunge_runtime::RuntimeCall>
   **/
  FrameSupportPreimagesBounded: {
    _enum: {
      Legacy: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Inline: 'Bytes',
      Lookup: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        len: 'u32'
      }
    }
  },
  /**
   * Lookup185: sugarfunge_runtime::OriginCaller
   **/
  SugarfungeRuntimeOriginCaller: {
    _enum: {
      system: 'FrameSupportDispatchRawOrigin',
      __Unused1: 'Null',
      Void: 'SpCoreVoid',
      __Unused3: 'Null',
      __Unused4: 'Null',
      __Unused5: 'Null',
      __Unused6: 'Null',
      __Unused7: 'Null',
      Council: 'PalletCollectiveRawOrigin'
    }
  },
  /**
   * Lookup186: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup187: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup189: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named']
  },
  /**
   * Lookup191: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup192: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength']
  },
  /**
   * Lookup194: sugarfunge_validator_set::pallet::Error<T>
   **/
  SugarfungeValidatorSetError: {
    _enum: ['TooLowValidatorCount', 'Duplicate', 'ValidatorNotApproved', 'BadOrigin']
  },
  /**
   * Lookup198: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup199: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup200: sugarfunge_asset::Class<sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  SugarfungeAssetClass: {
    owner: 'AccountId32',
    metadata: 'Bytes'
  },
  /**
   * Lookup202: sugarfunge_asset::Asset<ClassId, sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  SugarfungeAssetAsset: {
    classId: 'u64',
    creator: 'AccountId32',
    metadata: 'Bytes'
  },
  /**
   * Lookup204: sugarfunge_asset::pallet::Error<T>
   **/
  SugarfungeAssetError: {
    _enum: ['Unknown', 'InUse', 'InvalidAssetId', 'InsufficientBalance', 'NumOverflow', 'InvalidArrayLength', 'Overflow', 'InvalidClassId', 'NoPermission', 'ClassNotFound', 'AssetNotFound']
  },
  /**
   * Lookup205: sugarfunge_dao::pallet::Error<T>
   **/
  SugarfungeDaoError: {
    _enum: ['NoneValue', 'StorageOverflow']
  },
  /**
   * Lookup206: sugarfunge_bundle::Bundle<ClassId, AssetId, BundleSchema, sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  SugarfungeBundleBundle: {
    creator: 'AccountId32',
    classId: 'u64',
    assetId: 'u64',
    metadata: 'Bytes',
    schema: '(Vec<u64>,Vec<Vec<u64>>,Vec<Vec<u128>>)',
    vault: 'AccountId32'
  },
  /**
   * Lookup207: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup208: sugarfunge_bundle::pallet::Error<T>
   **/
  SugarfungeBundleError: {
    _enum: ['InvalidBundleIdForBundle', 'BundleExists', 'BundleNotFound', 'NumOverflow', 'InvalidArrayLength', 'InsufficientBalance', 'AssetExists', 'AccountNotOwner']
  },
  /**
   * Lookup209: sugarfunge_bag::BagClass<sp_core::crypto::AccountId32, ClassId>
   **/
  SugarfungeBagBagClass: {
    operator: 'AccountId32',
    classId: 'u64'
  },
  /**
   * Lookup210: sugarfunge_bag::Bag<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeBagBag: {
    operator: 'AccountId32',
    classId: 'u64',
    assetId: 'u64',
    totalShares: 'u128'
  },
  /**
   * Lookup211: sugarfunge_bag::pallet::Error<T>
   **/
  SugarfungeBagError: {
    _enum: ['BagClassExists', 'BagExists', 'InvalidBagClass', 'InvalidBag', 'InvalidBagOperator', 'InvalidBagOwner', 'InvalidArrayLength', 'InsufficientShares']
  },
  /**
   * Lookup212: sugarfunge_exgine::pallet::Error<T>
   **/
  SugarfungeExgineError: {
    _enum: ['NoneValue', 'StorageOverflow']
  },
  /**
   * Lookup213: sugarfunge_market::Market<sp_core::crypto::AccountId32>
   **/
  SugarfungeMarketMarket: {
    owner: 'AccountId32',
    vault: 'AccountId32'
  },
  /**
   * Lookup215: sugarfunge_market::pallet::Error<T>
   **/
  SugarfungeMarketError: {
    _enum: ['Overflow', 'InsufficientAmount', 'InsufficientLiquidity', 'InvalidMarket', 'InvalidMarketRate', 'InvalidMarketOwner', 'NotAuthorizedToMintAsset', 'MarketExists', 'MarketRateExists', 'InvalidAsset', 'InvalidAssetRate', 'InvalidRateAccount', 'InvalidRateAmount', 'InvalidBurnPrice', 'InvalidBurnBalance', 'InvalidTransferPrice', 'InvalidTransferBalance', 'InvalidBuyer', 'InvalidArrayLength']
  },
  /**
   * Lookup217: functionland_fula::Manifest<sp_core::crypto::AccountId32, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  FunctionlandFulaManifest: {
    _alias: {
      size_: 'size'
    },
    usersData: 'Vec<FunctionlandFulaUploaderData>',
    manifestMetadata: 'Bytes',
    size_: 'Option<u64>'
  },
  /**
   * Lookup220: functionland_fula::Challenge<sp_core::crypto::AccountId32>
   **/
  FunctionlandFulaChallenge: {
    challenger: 'AccountId32',
    challengeState: 'FunctionlandFulaChallengeState'
  },
  /**
   * Lookup221: functionland_fula::ClaimData
   **/
  FunctionlandFulaClaimData: {
    mintedLaborTokens: 'u128',
    expectedLaborTokens: 'u128',
    challengeTokens: 'u128'
  },
  /**
   * Lookup222: functionland_fula::pallet::Error<T>
   **/
  FunctionlandFulaError: {
    _enum: ['NoneValue', 'StorageOverflow', 'ReplicationFactorLimitReached', 'ReplicationFactorInvalid', 'AccountAlreadyStorer', 'AccountNotStorer', 'AccountNotInPool', 'AccountNotUploader', 'AccountNotFound', 'ManifestAlreadyExist', 'ManifestNotFound', 'ManifestNotStored', 'InvalidArrayLength', 'ErrorPickingCIDToChallenge', 'ErrorPickingAccountToChallenge', 'ManifestStorerDataNotFound', 'NoFileSizeProvided', 'NoAccountsToChallenge']
  },
  /**
   * Lookup223: fula_pool::Pool<T>
   **/
  FulaPoolPool: {
    name: 'Bytes',
    owner: 'Option<AccountId32>',
    parent: 'Option<u32>',
    participants: 'Vec<AccountId32>',
    requestNumber: 'u8',
    region: 'Bytes'
  },
  /**
   * Lookup226: fula_pool::PoolRequest<T>
   **/
  FulaPoolPoolRequest: {
    voted: 'Vec<AccountId32>',
    positiveVotes: 'u16',
    peerId: 'Bytes'
  },
  /**
   * Lookup227: fula_pool::User<bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  FulaPoolUser: {
    poolId: 'Option<u32>',
    requestPoolId: 'Option<u32>',
    peerId: 'Bytes'
  },
  /**
   * Lookup228: fula_pool::pallet::Error<T>
   **/
  FulaPoolError: {
    _enum: ['UserBusy', 'MaxPools', 'NameTooLong', 'PoolDoesNotExist', 'RequestDoesNotExist', 'CapacityReached', 'UserDoesNotExist', 'AccessDenied', 'InternalError', 'AlreadyVoted']
  },
  /**
   * Lookup230: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup231: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup232: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup235: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup236: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup237: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup238: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup241: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup242: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup243: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>',
  /**
   * Lookup244: sugarfunge_runtime::Runtime
   **/
  SugarfungeRuntimeRuntime: 'Null'
};
