import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Button } from 'react-native';

import {
  fula,
  blockchain,
  chainApi,
  fxblox,
  fxAi,
} from '@functionland/react-native-fula';
const App = () => {
  const inprogress = false;
  const seed =
    '0xb82cc245d889913ee01f48ad161ba8473cac9e516026488493ed20296721a2a5';

  const initComplete = true;

  useEffect(() => {
    if (!__DEV__) {
      console.log = () => null;
    }
    if(fula.registerLifecycleListener) {
      fula
        .registerLifecycleListener()?.then(() => console.log('Lifecycle listener registered'))
        .catch((error) =>
          console.error('Failed to register lifecycle listener', error)
        );
    }
  }, []);

  //Key for peerId: 12D3KooWFi2PK36Rzi4Bmosj1np2t6i9v3QnbBiNY9hQWuJajnmZ
  const privateKey = [
    183, 7, 117, 9, 159, 132, 170, 235, 215, 34, 145, 181, 60, 207, 4, 27, 27,
    17, 17, 167, 100, 89, 157, 218, 73, 200, 183, 145, 104, 151, 204, 142, 241,
    94, 225, 7, 153, 168, 239, 94, 7, 187, 123, 158, 149, 149, 227, 170, 32, 54,
    203, 243, 211, 78, 120, 114, 199, 1, 197, 134, 6, 91, 87, 152,
  ];

  const bloxPeerId = '12D3KooWGCQEZMQhJ6VVybcS7j1yDqmpzVWkNUZzgtWL1fv6UbFP'; //tower
// const bloxPeerId = '12D3KooWDaT8gS2zGMLGBKmW1mKhQSHxYeEX3Fr3VSjuPzmjyfZC'; //laptop
  // const bloxPeerId = '12D3KooWQZBdE5zNUVTE2Aayajyy9cJDmK4bJwMZG52ieHt2f6nb'; //laptop2

  const bloxAddr = '/dns/relay.dev.fx.land/tcp/4001/p2p/12D3KooWDRrBaAfPwsGJivBoUw5fE7ZpDiyfUjqgiURq2DEcL835/p2p-circuit/p2p/' + bloxPeerId;
  //const bloxAddr = '/ip4/192.168.2.139/tcp/40001/p2p/' + bloxPeerId;

  return (
    <ScrollView style={styles.container}>
      {/* --- Initialization --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'New Client'}
          onPress={async () => {
            try {
              await fula.shutdown();
              let clientinit = await fula.newClient(
                privateKey.toString(),
                '',
                bloxAddr,
                bloxAddr ? '' : 'noop',
                true,
                true,
                true
              );
              if (clientinit) {
                console.log('newClient complete');
                console.log(clientinit);
              } else {
                console.log('wait for newClient to complete');
              }
            } catch (e) {
              console.log('newClient error:', e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- Connection --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Check Connection'}
          onPress={async () => {
            try {
              const r = await fula.checkConnection();
              console.log('checkConnection result:', r);
            } catch (e) {
              console.log('checkConnection error:', e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Ping'}
          onPress={async () => {
            try {
              const result = await fula.ping();
              console.log('Ping result:', JSON.stringify(result));
              if (result.success) {
                console.log(`Ping OK: ${result.successes}/3 succeeded, avg RTT: ${result.avg_rtt_ms}ms`);
              } else {
                console.log('Ping FAILED:', result.errors);
              }
            } catch (e) {
              console.log('Ping error:', e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- Account --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Local Account'}
          onPress={async () => {
            try {
              let seedHex = await chainApi.createHexSeedFromString(seed);
              console.log('seedHex is the polkadot acceptable seed:' + seedHex);
              let res = chainApi.getLocalAccount(seedHex);
              console.log('account is:' + res.account);
            } catch (e) {
              console.log(e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Account Fund'}
          onPress={async () => {
            try {
              let seedHex = await chainApi.createHexSeedFromString(seed);
              let res = chainApi.getLocalAccount(seedHex);
              console.log('account is:' + res.account);
              let res2 = await blockchain.accountFund(res.account);
              console.log(res2);
            } catch (e) {
              console.log(e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Check Account Balance'}
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                console.log('api created');
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .checkAccountBalance(api, accountId)
                  .then((res: any) => {
                    console.log('account balance:', res);
                  })
                  .catch((e: any) => {
                    console.log('account balance failed:', e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Blox Account + Balance'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .getAccount()
                      .then((res: any) => {
                        console.log('account received:', res);
                        if (res) {
                          blockchain
                            .assetsBalance(res.account, 110, 100)
                            .then((r2: any) => {
                              console.log('balance:', r2);
                            });
                        }
                      })
                      .catch((e: any) => {
                        console.log('getAccount failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- Pool Operations --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Join Pool'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .joinPool(1)
                      .then((res: any) => {
                        console.log('joined:', res);
                      })
                      .catch((e: any) => {
                        console.log('join failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Cancel Join Pool'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .cancelPoolJoin(1)
                      .then((res: any) => {
                        console.log('cancel joined:', res);
                      })
                      .catch((e: any) => {
                        console.log('cancel join failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Join Pool With Chain'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .joinPoolWithChain(1, 'mainnet')
                      .then((res: any) => {
                        console.log('joined pool with chain:', res);
                      })
                      .catch((e: any) => {
                        console.log('join pool with chain failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Leave Pool With Chain'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .leavePoolWithChain(1, 'mainnet')
                      .then((res: any) => {
                        console.log('left pool with chain:', res);
                      })
                      .catch((e: any) => {
                        console.log('leave pool with chain failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Check Join Request Status'}
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .checkJoinRequest(
                    api,
                    1,
                    '5DD9qAHKNUqcYaKf5qgYra9y8s9BtbfLanJrTr3hQsK5XGGP'
                  )
                  .then((res: any) => {
                    console.log('join request status:', res);
                  })
                  .catch((e: any) => {
                    console.log('join request status failed:', e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get User Pool'}
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .getUserPool(
                    api,
                    '5CcHZucP2u1FXQW9wuyC11vAVxB3c48pUhc5cc9b3oxbKPL2'
                  )
                  .then((res: any) => {
                    console.log('GetUserPool:', res);
                  })
                  .catch((e: any) => {
                    console.log('GetUserPool failed:', e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'List Pools'}
          onPress={async () => {
            try {
              chainApi.init().then((api: any) => {
                if (api) {
                  chainApi
                    .listPools(api, 1, 25)
                    .then((res: any) => {
                      console.log('list pools:', res);
                    })
                    .catch((e: any) => {
                      console.log('list pools failed:', e);
                    });
                }
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- Blox Hardware / Device --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Blox Free Space'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    blockchain
                      .bloxFreeSpace()
                      .then((res: any) => {
                        console.log('bloxFreeSpace:', res);
                      })
                      .catch((e: any) => {
                        console.log('bloxFreeSpace failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Datastore Size'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .getDatastoreSize()
                      .then((res: any) => {
                        console.log('Datastoresize:', res);
                      })
                      .catch((e: any) => {
                        console.log('Datastoresize failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Folder Size'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .getFolderSize('/uniondrive/chain')
                      .then((res: any) => {
                        console.log('Foldersize:', res);
                      })
                      .catch((e: any) => {
                        console.log('Foldersize failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Go-Fula Logs'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .fetchContainerLogs('fula_go', '30')
                      .then((res: any) => {
                        console.log('fetchContainerLogs:', res);
                      })
                      .catch((e: any) => {
                        console.log('fetchContainerLogs failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Remove All Wifis'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .wifiRemoveall()
                      .then((res: any) => {
                        console.log('wifiRemoveall:', res);
                      })
                      .catch((e: any) => {
                        console.log('wifiRemoveall failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Reboot'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .reboot()
                      .then((res: any) => {
                        console.log('reboot:', res);
                      })
                      .catch((e: any) => {
                        console.log('reboot failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Partition'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .partition()
                      .then((res: any) => {
                        console.log('partition:', res);
                      })
                      .catch((e: any) => {
                        console.log('partition failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- Plugins --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'List Active Plugins'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .listActivePlugins()
                      .then((res: any) => {
                        console.log('list active plugins:', res);
                      })
                      .catch((e: any) => {
                        console.log('list plugins failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Install Plugin'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .installPlugin('streamr-node', 'contractAddress====test')
                      .then((res: any) => {
                        console.log('install plugin:', res);
                      })
                      .catch((e: any) => {
                        console.log('install plugin failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Uninstall Plugin'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .uninstallPlugin('streamr-node')
                      .then((res: any) => {
                        console.log('uninstall plugin:', res);
                      })
                      .catch((e: any) => {
                        console.log('uninstall plugin failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Install Output'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .getInstallOutput('streamr-node', 'contractAddress')
                      .then((res: any) => {
                        console.log('getInstallOutput:', res);
                      })
                      .catch((e: any) => {
                        console.log('getInstallOutput failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Get Install Status'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .getInstallStatus('streamr-node')
                      .then((res: any) => {
                        console.log('getInstallStatus:', res);
                      })
                      .catch((e: any) => {
                        console.log('getInstallStatus failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Update Plugin'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  if (r) {
                    fxblox
                      .updatePlugin('streamr-node')
                      .then((res: any) => {
                        console.log('updatePlugin:', res);
                      })
                      .catch((e: any) => {
                        console.log('updatePlugin failed:', e);
                      });
                  }
                });
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

      {/* --- AI --- */}
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Chat with AI'}
          onPress={async () => {
            try {
              if (initComplete) {
                const isConnected = await fula.checkConnection();
                console.log('Connection check:', isConnected);

                if (isConnected) {
                  try {
                    const streamID = await fxAi.chatWithAI('deepseek-chart', 'Hello AI!');
                    console.log('ChatWithAI started, Stream ID:', streamID);

                    const fullResponse = await fxAi.fetchChunksUsingIterator(streamID);
                    console.log('Full Response:', fullResponse);
                  } catch (startError) {
                    console.error('Error starting ChatWithAI:', startError);
                  }
                }
              }
            } catch (e) {
              console.error('Unexpected error:', e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
      <View style={styles.section}>
        <Button
          title={inprogress ? 'Processing...' : 'Stream AI Chunks'}
          onPress={async () => {
            try {
              if (initComplete) {
                const isConnected = await fula.checkConnection();
                console.log('Connection check:', isConnected);

                if (isConnected) {
                  try {
                    const streamID = await fxAi.chatWithAI('deepseek-chart', 'Hello AI!');
                    console.log('ChatWithAI started, Stream ID:', streamID);

                    let fullResponse = '';
                    const cleanup = fxAi.streamChunks(streamID, {
                      onChunk: (chunk) => {
                        console.log('Received chunk:', chunk);
                        fullResponse += chunk;
                      },
                      onComplete: () => {
                        console.log('Stream completed. Full response:', fullResponse);
                      },
                      onError: (error) => {
                        console.error('Stream error:', error);
                      },
                    });

                    setTimeout(() => {
                      cleanup();
                      console.log('Cleaned up stream listeners');
                    }, 30000);

                  } catch (startError) {
                    console.error('Error starting ChatWithAI:', startError);
                  }
                }
              }
            } catch (e) {
              console.error('Unexpected error:', e);
            }
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 1000,
    backgroundColor: 'white',
    padding: 0,
  },
  section: {
    position: 'relative',
    marginTop: 5,
    marginLeft: 60,
  },
});

export default App;
