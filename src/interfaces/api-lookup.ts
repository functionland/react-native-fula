// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData'
  },
  /**
   * Lookup5: pallet_balances::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    miscFrozen: 'u128',
    feeFrozen: 'u128'
  },
  /**
   * Lookup7: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'Weight',
    operational: 'Weight',
    mandatory: 'Weight'
  },
  /**
   * Lookup12: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup14: sp_runtime::generic::digest::DigestItem
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
   * Lookup17: frame_system::EventRecord<sugarfunge_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup19: frame_system::pallet::Event<T>
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
   * Lookup20: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays'
  },
  /**
   * Lookup21: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup22: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup23: sp_runtime::DispatchError
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
      Arithmetic: 'SpRuntimeArithmeticError',
      Transactional: 'SpRuntimeTransactionalError'
    }
  },
  /**
   * Lookup24: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]'
  },
  /**
   * Lookup25: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['NoFunds', 'WouldDie', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported']
  },
  /**
   * Lookup26: sp_runtime::ArithmeticError
   **/
  SpRuntimeArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup27: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer']
  },
  /**
   * Lookup28: pallet_grandpa::pallet::Event
   **/
  PalletGrandpaEvent: {
    _enum: {
      NewAuthorities: {
        authoritySet: 'Vec<(SpFinalityGrandpaAppPublic,u64)>',
      },
      Paused: 'Null',
      Resumed: 'Null'
    }
  },
  /**
   * Lookup31: sp_finality_grandpa::app::Public
   **/
  SpFinalityGrandpaAppPublic: 'SpCoreEd25519Public',
  /**
   * Lookup32: sp_core::ed25519::Public
   **/
  SpCoreEd25519Public: '[u8;32]',
  /**
   * Lookup33: pallet_balances::pallet::Event<T, I>
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
        reserved: 'u128',
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
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup34: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup35: pallet_transaction_payment::pallet::Event<T>
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
   * Lookup36: pallet_sudo::pallet::Event<T>
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
   * Lookup40: pallet_scheduler::pallet::Event<T>
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
        id: 'Option<Bytes>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallLookupFailed: {
        task: '(u32,u32)',
        id: 'Option<Bytes>',
        error: 'FrameSupportScheduleLookupError'
      }
    }
  },
  /**
   * Lookup43: frame_support::traits::schedule::LookupError
   **/
  FrameSupportScheduleLookupError: {
    _enum: ['Unknown', 'BadFormat']
  },
  /**
   * Lookup44: pallet_collective::pallet::Event<T, I>
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
   * Lookup46: sugarfunge_validator_set::pallet::Event<T>
   **/
  SugarfungeValidatorSetEvent: {
    _enum: {
      ValidatorAdditionInitiated: 'AccountId32',
      ValidatorRemovalInitiated: 'AccountId32'
    }
  },
  /**
   * Lookup47: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32'
      }
    }
  },
  /**
   * Lookup48: sugarfunge_asset::pallet::Event<T>
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
   * Lookup51: sugarfunge_dao::pallet::Event<T>
   **/
  SugarfungeDaoEvent: {
    _enum: {
      SomethingStored: '(u32,AccountId32)'
    }
  },
  /**
   * Lookup52: sugarfunge_bundle::pallet::Event<T>
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
   * Lookup53: sugarfunge_bag::pallet::Event<T>
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
   * Lookup55: sugarfunge_exgine::pallet::Event<T>
   **/
  SugarfungeExgineEvent: {
    _enum: {
      SomethingStored: '(u32,AccountId32)'
    }
  },
  /**
   * Lookup56: sugarfunge_market::pallet::Event<T>
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
   * Lookup60: sugarfunge_market::RateBalance<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeMarketRateBalance: {
    rate: 'SugarfungeMarketAssetRate',
    balance: 'i128'
  },
  /**
   * Lookup61: sugarfunge_market::AssetRate<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeMarketAssetRate: {
    classId: 'u64',
    assetId: 'u64',
    action: 'SugarfungeMarketRateAction',
    from: 'SugarfungeMarketRateAccount',
    to: 'SugarfungeMarketRateAccount'
  },
  /**
   * Lookup62: sugarfunge_market::RateAction<ClassId, AssetId>
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
   * Lookup64: sugarfunge_market::AMM
   **/
  SugarfungeMarketAmm: {
    _enum: ['Constant']
  },
  /**
   * Lookup65: sugarfunge_market::AmountOp
   **/
  SugarfungeMarketAmountOp: {
    _enum: ['Equal', 'LessThan', 'LessEqualThan', 'GreaterThan', 'GreaterEqualThan']
  },
  /**
   * Lookup66: sugarfunge_market::RateAccount<sp_core::crypto::AccountId32>
   **/
  SugarfungeMarketRateAccount: {
    _enum: {
      Market: 'Null',
      Account: 'AccountId32',
      Buyer: 'Null'
    }
  },
  /**
   * Lookup67: functionland_fula::pallet::Event<T>
   **/
  FunctionlandFulaEvent: {
    _enum: {
      ManifestOutput: {
        uploader: 'AccountId32',
        storage: 'Vec<AccountId32>',
        manifest: 'Bytes',
        poolId: 'u32',
      },
      StorageManifestOutput: {
        uploader: 'AccountId32',
        storage: 'AccountId32',
        cid: 'Bytes',
        poolId: 'u32',
      },
      RemoveStorerOutput: {
        uploader: 'AccountId32',
        storage: 'Option<AccountId32>',
        cid: 'Bytes',
        poolId: 'u32',
      },
      ManifestRemoved: {
        uploader: 'AccountId32',
        cid: 'Bytes',
        poolId: 'u32',
      },
      ManifestStorageUpdated: {
        storer: 'AccountId32',
        poolId: 'u32',
        cid: 'Bytes',
        activeCycles: 'u16',
        missedCycles: 'u16',
        activeDays: 'i32'
      }
    }
  },
  /**
   * Lookup70: fula_pool::pallet::Event<T>
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
      Accepted: {
        account: 'AccountId32',
        poolId: 'u32',
      },
      Denied: {
        account: 'AccountId32',
        poolId: 'u32',
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
   * Lookup71: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup74: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup77: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      fill_block: {
        ratio: 'Perbill',
      },
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
   * Lookup82: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'Weight',
    maxBlock: 'Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup83: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup84: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'Weight',
    maxExtrinsic: 'Option<Weight>',
    maxTotal: 'Option<Weight>',
    reserved: 'Option<Weight>'
  },
  /**
   * Lookup86: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup87: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup88: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup89: sp_version::RuntimeVersion
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
   * Lookup94: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered']
  },
  /**
   * Lookup96: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup98: pallet_grandpa::StoredState<N>
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
   * Lookup99: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpFinalityGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup102: pallet_grandpa::pallet::Call<T>
   **/
  PalletGrandpaCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpFinalityGrandpaEquivocationProof',
        keyOwnerProof: 'SpCoreVoid',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpFinalityGrandpaEquivocationProof',
        keyOwnerProof: 'SpCoreVoid',
      },
      note_stalled: {
        delay: 'u32',
        bestFinalizedBlockNumber: 'u32'
      }
    }
  },
  /**
   * Lookup103: sp_finality_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpFinalityGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpFinalityGrandpaEquivocation'
  },
  /**
   * Lookup104: sp_finality_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpFinalityGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup105: finality_grandpa::Equivocation<sp_finality_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_finality_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpFinalityGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpFinalityGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpFinalityGrandpaAppSignature)'
  },
  /**
   * Lookup106: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup107: sp_finality_grandpa::app::Signature
   **/
  SpFinalityGrandpaAppSignature: 'SpCoreEd25519Signature',
  /**
   * Lookup108: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup111: finality_grandpa::Equivocation<sp_finality_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_finality_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpFinalityGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpFinalityGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpFinalityGrandpaAppSignature)'
  },
  /**
   * Lookup112: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup114: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup115: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup117: pallet_balances::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup118: pallet_balances::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup121: pallet_balances::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup123: pallet_balances::Releases
   **/
  PalletBalancesReleases: {
    _enum: ['V1_0_0', 'V2_0_0']
  },
  /**
   * Lookup124: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        newReserved: 'Compact<u128>',
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
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup129: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'KeepAlive', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves']
  },
  /**
   * Lookup131: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2']
  },
  /**
   * Lookup132: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'Weight',
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
   * Lookup134: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: 'Bytes',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      cancel_named: {
        id: 'Bytes',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      schedule_named_after: {
        id: 'Bytes',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed'
      }
    }
  },
  /**
   * Lookup136: frame_support::traits::schedule::MaybeHashed<sugarfunge_runtime::RuntimeCall, primitive_types::H256>
   **/
  FrameSupportScheduleMaybeHashed: {
    _enum: {
      Value: 'Call',
      Hash: 'H256'
    }
  },
  /**
   * Lookup137: pallet_collective::pallet::Call<T, I>
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
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'Compact<Weight>',
        lengthBound: 'Compact<u32>',
      },
      disapprove_proposal: {
        proposalHash: 'H256'
      }
    }
  },
  /**
   * Lookup139: sugarfunge_validator_set::pallet::Call<T>
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
   * Lookup140: pallet_session::pallet::Call<T>
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
   * Lookup141: sugarfunge_runtime::opaque::SessionKeys
   **/
  SugarfungeRuntimeOpaqueSessionKeys: {
    aura: 'SpConsensusAuraSr25519AppSr25519Public',
    grandpa: 'SpFinalityGrandpaAppPublic'
  },
  /**
   * Lookup142: sp_consensus_aura::sr25519::app_sr25519::Public
   **/
  SpConsensusAuraSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup143: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup144: sugarfunge_asset::pallet::Call<T>
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
   * Lookup147: sugarfunge_dao::pallet::Call<T>
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
   * Lookup148: sugarfunge_bundle::pallet::Call<T>
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
   * Lookup156: sugarfunge_bag::pallet::Call<T>
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
   * Lookup157: sugarfunge_exgine::pallet::Call<T>
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
   * Lookup158: sugarfunge_market::pallet::Call<T>
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
   * Lookup161: functionland_fula::pallet::Call<T>
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
      storage_manifest: {
        uploader: 'AccountId32',
        cid: 'Bytes',
        poolId: 'u32',
      },
      remove_storer: {
        storage: 'AccountId32',
        cid: 'Bytes',
        poolId: 'u32',
      },
      remove_stored_manifest: {
        uploader: 'AccountId32',
        cid: 'Bytes',
        poolId: 'u32',
      },
      remove_manifest: {
        cid: 'Bytes',
        poolId: 'u32'
      }
    }
  },
  /**
   * Lookup164: fula_pool::pallet::Call<T>
   **/
  FulaPoolCall: {
    _enum: {
      create: {
        name: 'Bytes',
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
        positive: 'bool'
      }
    }
  },
  /**
   * Lookup166: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup169: pallet_scheduler::ScheduledV3<frame_support::traits::schedule::MaybeHashed<sugarfunge_runtime::RuntimeCall, primitive_types::H256>, BlockNumber, sugarfunge_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduledV3: {
    maybeId: 'Option<Bytes>',
    priority: 'u8',
    call: 'FrameSupportScheduleMaybeHashed',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'SugarfungeRuntimeOriginCaller'
  },
  /**
   * Lookup170: sugarfunge_runtime::OriginCaller
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
      __Unused8: 'Null',
      Council: 'PalletCollectiveRawOrigin'
    }
  },
  /**
   * Lookup171: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup172: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup173: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange']
  },
  /**
   * Lookup175: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup176: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength']
  },
  /**
   * Lookup178: sugarfunge_validator_set::pallet::Error<T>
   **/
  SugarfungeValidatorSetError: {
    _enum: ['TooLowValidatorCount', 'Duplicate', 'ValidatorNotApproved', 'BadOrigin']
  },
  /**
   * Lookup183: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup184: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup185: sugarfunge_asset::Class<sp_core::crypto::AccountId32, sp_core::bounded::bounded_vec::BoundedVec<T, S>>
   **/
  SugarfungeAssetClass: {
    owner: 'AccountId32',
    metadata: 'Bytes'
  },
  /**
   * Lookup187: sugarfunge_asset::Asset<ClassId, sp_core::crypto::AccountId32, sp_core::bounded::bounded_vec::BoundedVec<T, S>>
   **/
  SugarfungeAssetAsset: {
    classId: 'u64',
    creator: 'AccountId32',
    metadata: 'Bytes'
  },
  /**
   * Lookup189: sugarfunge_asset::pallet::Error<T>
   **/
  SugarfungeAssetError: {
    _enum: ['Unknown', 'InUse', 'InvalidAssetId', 'InsufficientBalance', 'NumOverflow', 'InvalidArrayLength', 'Overflow', 'InvalidClassId', 'NoPermission', 'ClassNotFound', 'AssetNotFound']
  },
  /**
   * Lookup190: sugarfunge_dao::pallet::Error<T>
   **/
  SugarfungeDaoError: {
    _enum: ['NoneValue', 'StorageOverflow']
  },
  /**
   * Lookup191: sugarfunge_bundle::Bundle<ClassId, AssetId, BundleSchema, sp_core::crypto::AccountId32, sp_core::bounded::bounded_vec::BoundedVec<T, S>>
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
   * Lookup192: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup193: sugarfunge_bundle::pallet::Error<T>
   **/
  SugarfungeBundleError: {
    _enum: ['InvalidBundleIdForBundle', 'BundleExists', 'BundleNotFound', 'NumOverflow', 'InvalidArrayLength', 'InsufficientBalance']
  },
  /**
   * Lookup194: sugarfunge_bag::BagClass<sp_core::crypto::AccountId32, ClassId>
   **/
  SugarfungeBagBagClass: {
    operator: 'AccountId32',
    classId: 'u64'
  },
  /**
   * Lookup195: sugarfunge_bag::Bag<sp_core::crypto::AccountId32, ClassId, AssetId>
   **/
  SugarfungeBagBag: {
    operator: 'AccountId32',
    classId: 'u64',
    assetId: 'u64',
    totalShares: 'u128'
  },
  /**
   * Lookup196: sugarfunge_bag::pallet::Error<T>
   **/
  SugarfungeBagError: {
    _enum: ['BagClassExists', 'BagExists', 'InvalidBagClass', 'InvalidBag', 'InvalidBagOperator', 'InvalidBagOwner', 'InvalidArrayLength', 'InsufficientShares']
  },
  /**
   * Lookup197: sugarfunge_exgine::pallet::Error<T>
   **/
  SugarfungeExgineError: {
    _enum: ['NoneValue', 'StorageOverflow']
  },
  /**
   * Lookup198: sugarfunge_market::Market<sp_core::crypto::AccountId32>
   **/
  SugarfungeMarketMarket: {
    owner: 'AccountId32',
    vault: 'AccountId32'
  },
  /**
   * Lookup200: sugarfunge_market::pallet::Error<T>
   **/
  SugarfungeMarketError: {
    _enum: ['Overflow', 'InsufficientAmount', 'InsufficientLiquidity', 'InvalidMarket', 'InvalidMarketRate', 'InvalidMarketOwner', 'NotAuthorizedToMintAsset', 'MarketExists', 'MarketRateExists', 'InvalidAsset', 'InvalidAssetRate', 'InvalidRateAccount', 'InvalidRateAmount', 'InvalidBurnPrice', 'InvalidBurnBalance', 'InvalidTransferPrice', 'InvalidTransferBalance', 'InvalidBuyer', 'InvalidArrayLength']
  },
  /**
   * Lookup203: functionland_fula::Manifest<sp_core::crypto::AccountId32, sp_core::bounded::bounded_vec::BoundedVec<T, S>>
   **/
  FunctionlandFulaManifest: {
    storage: 'Vec<AccountId32>',
    replicationFactor: 'u16',
    manifestData: 'FunctionlandFulaManifestData'
  },
  /**
   * Lookup204: functionland_fula::ManifestData<sp_core::crypto::AccountId32, sp_core::bounded::bounded_vec::BoundedVec<T, S>>
   **/
  FunctionlandFulaManifestData: {
    uploader: 'AccountId32',
    manifestMetadata: 'Bytes'
  },
  /**
   * Lookup205: functionland_fula::ManifestStorageData
   **/
  FunctionlandFulaManifestStorageData: {
    activeCycles: 'u16',
    missedCycles: 'u16',
    activeDays: 'i32'
  },
  /**
   * Lookup206: functionland_fula::pallet::Error<T>
   **/
  FunctionlandFulaError: {
    _enum: ['NoneValue', 'StorageOverflow', 'ReplicationFactorLimitReached', 'ReplicationFactorInvalid', 'AccountAlreadyStorer', 'AccountNotStorer', 'AccountNotInPool', 'ManifestAlreadyExist', 'ManifestNotFound', 'ManifestNotStored']
  },
  /**
   * Lookup207: fula_pool::Pool<T>
   **/
  FulaPoolPool: {
    name: 'Bytes',
    owner: 'Option<AccountId32>',
    parent: 'Option<u32>',
    participants: 'Vec<AccountId32>',
    requestNumber: 'u8'
  },
  /**
   * Lookup210: fula_pool::PoolRequest<T>
   **/
  FulaPoolPoolRequest: {
    voted: 'Vec<AccountId32>',
    positiveVotes: 'u16',
    peerId: 'Bytes'
  },
  /**
   * Lookup211: fula_pool::User<sp_core::bounded::bounded_vec::BoundedVec<T, S>>
   **/
  FulaPoolUser: {
    poolId: 'Option<u32>',
    requestPoolId: 'Option<u32>',
    peerId: 'Bytes'
  },
  /**
   * Lookup212: fula_pool::pallet::Error<T>
   **/
  FulaPoolError: {
    _enum: ['UserBusy', 'MaxPools', 'NameTooLong', 'PoolDoesNotExist', 'RequestDoesNotExist', 'CapacityReached', 'UserDoesNotExist', 'AccessDenied', 'InternalError', 'AlreadyVoted']
  },
  /**
   * Lookup214: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup215: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup216: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup219: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup220: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup221: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup222: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup225: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup226: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup227: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>',
  /**
   * Lookup228: sugarfunge_runtime::Runtime
   **/
  SugarfungeRuntimeRuntime: 'Null'
};
