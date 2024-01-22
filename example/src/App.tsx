import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import {
  fula,
  blockchain,
  chainApi,
  fxblox,
} from '@functionland/react-native-fula';

const App = () => {
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [inprogress, setInprogress] = React.useState<boolean>(false);
  const [newRootCid, setNewRootCid] = React.useState<string>('');
  const root_cid = '';
  const seed =
    '0xmd93c00b5v99f99ti871r8r17r2rt66ee277777ge1be6fb47709b691efb0e777';

  const [initComplete, setInitComplete] = React.useState<
    { peerId: string; rootCid: string; private_ref: string } | {}
  >({});

  useEffect(() => {
    if (!__DEV__) {
      console.log = () => null;
      //console.error = () => null
    }
    fula
      .registerLifecycleListener()
      .then(() => console.log('Lifecycle listener registered'))
      .catch((error) =>
        console.error('Failed to register lifecycle listener', error)
      );
  }, []);

  let RNFS = require('react-native-fs');
  const readFile = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result: { path: any }[]) => {
        console.log('GOT RESULT', result);
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult: any[]) => {
        if (statResult[0].isFile()) {
          return RNFS.readFile(statResult[1], 'utf8');
        }
        return 'no file';
      })
      .then((contents: any) => {
        console.log(contents);
      })
      .catch((err: { message: any; code: any }) => {
        console.log(err.message, err.code);
      });
  };
  //Key for peerId: 12D3KooWMMt4C3FKui14ai4r1VWwznRw6DoP5DcgTfzx2D5VZoWx
  const privateKey = [
    183, 7, 117, 9, 159, 132, 170, 235, 215, 34, 145, 181, 60, 207, 4, 27, 27,
    17, 17, 167, 100, 89, 157, 218, 73, 200, 183, 145, 104, 151, 204, 142, 241,
    94, 225, 7, 153, 168, 239, 94, 7, 187, 123, 158, 149, 149, 227, 170, 32, 54,
    203, 243, 211, 78, 120, 114, 199, 1, 197, 134, 6, 91, 87, 152,
  ];

  const privateKey_tower = [
    136, 140, 244, 206, 112, 88, 174, 215, 168, 255, 187, 101, 60, 246, 164,
    180, 36, 243, 231, 82, 182, 24, 99, 79, 114, 144, 196, 186, 92, 27, 109, 89,
    153, 106, 217, 201, 106, 9, 66, 33, 214, 195, 255, 234, 178, 244, 203, 112,
    62, 91, 140, 55, 179, 10, 208, 210, 177, 111, 61, 46, 73, 148, 14, 62,
  ];
  //const bloxPeerId = '12D3KooWDiBNebfFD4QwJ1qDZaeapKcbr72cJfHE8foooTX25Z1V'; //tower
  //const bloxPeerId = '12D3KooWRTzN7HfmjoUBHokyRZuKdyohVVSGqKBMF24ZC3tGK78Q'; //laptop
  const bloxPeerId = '12D3KooWQZBdE5zNUVTE2Aayajyy9cJDmK4bJwMZG52ieHt2f6nb'; //laptop2
  //const bloxPeerId = '12D3KooWAN5FaAnC4d1GhAvoYxyUXdrkCGqux1NB6Pr4cZXn813E'; //test aws server

  const bloxAddr = '/dns/delta-relay.dev.fx.land/tcp/4001/p2p/12D3KooWDtA7kecHAGEB8XYEKHBUTt8GsRfMen1yMs7V85vrpMzC/p2p-circuit/p2p/' + bloxPeerId;
  //const bloxAddr = '/ip4/192.168.2.14/tcp/40001/p2p/' + bloxPeerId;

  const initFula = async () => {
    try {
      return fula.init(
        privateKey_tower.toString(),
        '',
        bloxAddr,
        '',
        true,
        root_cid
      );
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };
  React.useEffect(() => {
    /*chainApi.init().then((api) => {
      chainApi.listPools(api).then((pools) => {
        console.log('pools', pools);
      }).catch((e) => {
        console.log('error', e);
      });

      chainApi.checkJoinRequest(api, 1, "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty").then((poolReq) => {
        console.log('poolReq', poolReq);
      }).catch((err) => {
        console.log('error', err);
      });
    });*/
    //fula.logout(privateKey.toString(),'').then((a) => {
    /*initFula()
      .then((res) => {
        console.log('OK', res);
        setInitComplete(res);
        readFile();
        console.log('readFile local comlete');
        fula.mkdir('root/test1').then((res1) => {
          console.log('root created');
          console.log(res1);
          fula
            .ls('root')
            .then((res2) => {
              console.log('ls complete');
              console.log(res2);
              fula.shutdown();
            })
            .catch((e) => {
              console.log('error', e);
            });
        });
      })
      .catch((e) => {
        console.log('error', e);
      });*/
    //});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Put & Get</Text>
        <Button
          title={inprogress ? 'Putting & Getting...' : 'newclient'}
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
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
        <Button
          title={inprogress ? 'Putting & Getting...' : 'Init'}
          onPress={async () => {
            try {
              let resinit = await initFula();
              if (resinit) {
                console.log('init complete');
                console.log(resinit);
                setNewRootCid(resinit.rootCid);
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test'}
          onPress={async () => {
            try {
              fula
                .testData(privateKey.toString(), bloxAddr)
                .then((res: any) => {
                  console.log('tested');
                  console.log(res);
                })
                .catch((e: any) => {
                  console.log('test failed');
                  console.log(e);
                });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
        <Button
          //12D3KooWMMt4C3FKui14ai4r1VWwznRw6DoP5DcgTfzx2D5VZoWx
          title={inprogress ? 'Putting & Getting...' : 'set auth'}
          onPress={async () => {
            try {
              fula
                .setAuth(
                  '12D3KooWMMt4C3FKui14ai4r1VWwznRw6DoP5DcgTfzx2D5VZoWx',
                  true
                )
                .then((res: any) => {
                  console.log('tested');
                  console.log(res);
                })
                .catch((e: any) => {
                  console.log('test failed');
                  console.log(e);
                });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={
            inprogress
              ? 'Putting & Getting...'
              : 'Test List Failed links for a one'
          }
          onPress={async () => {
            try {
              console.log('checking: ' + newRootCid);
              fula
                .listFailedActions([newRootCid])
                .then((res: any) => {
                  console.log('tested');
                  console.log(res);
                })
                .catch((e: any) => {
                  console.log('test failed');
                  console.log(e);
                });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
        <Button
          title={
            inprogress
              ? 'Putting & Getting...'
              : 'Test List Failed links for all'
          }
          onPress={async () => {
            try {
              fula
                .listFailedActions()
                .then((res: any) => {
                  console.log('tested');
                  console.log(res);
                })
                .catch((e: any) => {
                  console.log('test failed');
                  console.log(e);
                });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Write WNFS'}
          onPress={async () => {
            const unixTimestamp: number = Math.floor(Date.now() / 1000);
            try {
              if (initComplete) {
                console.log('initialization is completed. putting key/value');
                var path = RNFS.DocumentDirectoryPath + '/test.txt';
                RNFS.writeFile(path, 'test ' + unixTimestamp, 'utf8')
                  .then((success: any) => {
                    console.log(
                      'FILE WRITTEN in ' +
                        RNFS.DocumentDirectoryPath +
                        '/test.txt with ' +
                        unixTimestamp
                    );
                    console.log(success);
                    fula
                      .writeFile(
                        'root/test_' + unixTimestamp + '.txt',
                        RNFS.DocumentDirectoryPath + '/test.txt'
                      )
                      .then((res: any) => {
                        console.log('upload completed');
                        console.log(res);
                        fula
                          .readFile(
                            'root/test_' + unixTimestamp + '.txt',
                            RNFS.DocumentDirectoryPath +
                              '/test_' +
                              unixTimestamp +
                              '.txt'
                          )
                          .then((res2: any) => {
                            console.log('read completed ' + res2);
                            readFile();
                          });
                      });
                  })
                  .catch((err: { message: any }) => {
                    console.log(err.message);
                  });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'List' : 'List'}
          onPress={async () => {
            try {
              fula
                .ls('root')
                .then((res: any) => {
                  console.log('tested');
                  console.log(res);
                })
                .catch((e: any) => {
                  console.log('test failed');
                  console.log(e);
                });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Check Failes'}
          onPress={async () => {
            try {
              if (initComplete) {
                console.log('initialization is completed. retry');
                var path = RNFS.DocumentDirectoryPath + '/test_r.txt';
                RNFS.writeFile(path, 'test_r', 'utf8')
                  .then((success: any) => {
                    console.log(
                      'FILE WRITTEN in ' +
                        RNFS.DocumentDirectoryPath +
                        '/test_r.txt'
                    );
                    console.log(success);
                    fula
                      .writeFile(
                        'root/test_r.txt',
                        RNFS.DocumentDirectoryPath + '/test_r.txt'
                      )
                      .then((res: any) => {
                        console.log('upload completed');
                        console.log(res);
                        fula
                          .readFile(
                            'root/test_r.txt',
                            RNFS.DocumentDirectoryPath + '/test_r2.txt'
                          )
                          .then((res2: any) => {
                            console.log('read completed ' + res2);
                            readFile();
                            fula
                              .checkFailedActions()
                              .then((f: any) => {
                                console.log('failed actions');
                                console.log(f);
                              })
                              .catch((e: any) => {
                                console.log(e);
                              });
                          });
                      });
                  })
                  .catch((err: { message: any }) => {
                    console.log(err.message);
                  });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Retry'}
          onPress={async () => {
            try {
              if (initComplete) {
                console.log(
                  'initialization is completed. retrying... first checking connection:'
                );
                fula
                  .checkConnection()
                  .then((r: any) => {
                    console.log('connection cehck passed');
                    console.log(r);
                    if (r) {
                      console.log('check connection is completed. retry');
                      fula
                        .checkFailedActions(true)
                        .then((res: any) => {
                          console.log('retried');
                          console.log(res);
                        })
                        .catch((e: any) => {
                          console.log('retry failed');
                          console.log(e);
                        });
                    }
                  })
                  .catch((e: any) => {
                    console.log('connection cehck failed');
                    console.log(e);
                  });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Join Pool'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection cehck');
                  console.log(r);
                  if (r) {
                    console.log('initialization is completed.');
                    blockchain
                      .joinPool(1)
                      .then((res: any) => {
                        console.log('joined');
                        console.log(res);
                      })
                      .catch((e: any) => {
                        console.log('join failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Cancel join Pool'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection cehck');
                  console.log(r);
                  if (r) {
                    console.log('initialization is completed.');
                    blockchain
                      .cancelPoolJoin(1)
                      .then((res: any) => {
                        console.log('cancel joined');
                        console.log(res);
                      })
                      .catch((e: any) => {
                        console.log('cancel join failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Check Account Balance'}
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                console.log('api created');
                console.log('check account balance');
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .checkAccountBalance(api, accountId)
                  .then((res: any) => {
                    console.log('account balance created');
                    console.log(res);
                  })
                  .catch((e: any) => {
                    console.log('account balance creation failed');
                    console.log(e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={
            inprogress ? 'Putting & Getting...' : 'Check Join Request Status'
          }
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                console.log('api created');
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .checkJoinRequest(api, 1, "5DD9qAHKNUqcYaKf5qgYra9y8s9BtbfLanJrTr3hQsK5XGGP")
                  .then((res: any) => {
                    console.log('join request status created');
                    console.log(res);
                  })
                  .catch((e: any) => {
                    console.log('join request status failed');
                    console.log(e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Get User Pool'}
          onPress={async () => {
            try {
              chainApi.init().then(async (api: any) => {
                console.log('api created');
                let accountId = await chainApi.getAccountIdFromSeed(seed);
                console.log('account ID is ' + accountId);
                chainApi
                  .getUserPool(api, "5CcHZucP2u1FXQW9wuyC11vAVxB3c48pUhc5cc9b3oxbKPL2")
                  .then((res: any) => {
                    console.log('GetUserPool created');
                    console.log(res);
                  })
                  .catch((e: any) => {
                    console.log('GetUserPool failed');
                    console.log(e);
                  });
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Getting...' : 'Get Blox Free Space'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection check');
                  console.log(r);
                  if (r) {
                    console.log(
                      'initialization is completed. get blox free space'
                    );
                    blockchain
                      .bloxFreeSpace()
                      .then((res: any) => {
                        console.log('bloxFreeSpace received');
                        console.log(res);
                      })
                      .catch((e: any) => {
                        console.log('bloxFreeSpace fetch failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Getting...' : 'Remove all Wifis'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection check');
                  console.log(r);
                  if (r) {
                    console.log(
                      'initialization is completed. send remove wifis command'
                    );
                    fxblox
                      .wifiRemoveall()
                      .then((res: any) => {
                        console.log('wifiRemoveall received');
                        console.log(res);
                      })
                      .catch((e: any) => {
                        console.log('wifiRemoveall failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Getting...' : 'Reboot'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection check');
                  console.log(r);
                  if (r) {
                    console.log(
                      'initialization is completed. send reboot command'
                    );
                    fxblox
                      .reboot()
                      .then((res: any) => {
                        console.log('reboot received');
                        console.log(res);
                      })
                      .catch((e: any) => {
                        console.log('reboot failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'List Pools'}
          onPress={async () => {
            try {
              chainApi.init().then((api: any) => {
                console.log('api created');
                console.log(api.rpc);
                if (api) {
                  console.log('getting pools');
                  chainApi
                    .listPools(api, 1, 25)
                    .then((res: any) => {
                      console.log('list pool res received');
                      console.log(res);
                    })
                    .catch((e: any) => {
                      console.log('res failed');
                      console.log(e);
                    });
                }
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
        <Button
          title={inprogress ? 'Putting & Getting...' : 'Upload Manifest'}
          onPress={async () => {
            try {
              chainApi.init().then((api: any) => {
                console.log('api created');
                if (api) {
                  console.log('uploading manifests');
                  chainApi
                    .batchUploadManifest(api, seed, ['Cid6'], 1)
                    .then((res: any) => {
                      console.log('res received');
                      console.log(res);
                    })
                    .catch((e: any) => {
                      console.log('res failed');
                      console.log(e);
                    });
                }
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test Recent CIDs'}
          onPress={async () => {
            try {
              chainApi.init().then((api: any) => {
                console.log('api created');
                if (api && initComplete) {
                  console.log('get the list of cids');
                  fula
                    .listRecentCidsAsString()
                    .then((res: any) => {
                      console.log('res received');
                      console.log(res);
                      if (res) {
                        fula
                          .clearCidsFromRecent(res)
                          .then((res2: any) => {
                            console.log('clear done');
                            console.log(res2);
                          })
                          .catch((e: any) => {
                            console.log('clear failed');
                            console.log(e);
                          });
                      }
                    })
                    .catch((e: any) => {
                      console.log('res failed');
                      console.log(e);
                    });
                }
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test Replicate'}
          onPress={async () => {
            try {
              chainApi.init().then((api: any) => {
                console.log('api created');
                if (api && initComplete) {
                  console.log('replicate');
                  fula
                    .replicateRecentCids(api, seed, 1, 6)
                    .then((res: any) => {
                      console.log('res received');
                      console.log(res);
                    })
                    .catch((e: any) => {
                      console.log('res failed');
                      console.log(e);
                    });
                }
              });
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />

        <Button
          title={inprogress ? 'Getting...' : 'Check Balance'}
          onPress={async () => {
            try {
              if (initComplete) {
                fula.checkConnection().then((r: any) => {
                  console.log('connection check');
                  console.log(r);
                  if (r) {
                    console.log('initialization is completed. get account');
                    blockchain
                      .getAccount()
                      .then((res: any) => {
                        console.log('account received');
                        console.log(res);
                        if (res) {
                          blockchain
                            .assetsBalance(res.account, 110, 100)
                            .then((r2: any) => {
                              console.log('amount received');
                              console.log(r2);
                            });
                        }
                      })
                      .catch((e: any) => {
                        console.log('bloxFreeSpace fetch failed');
                        console.log(e);
                      });
                  }
                });
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'blue'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageShow: {
    width: 200,
    height: 200,
    padding: 5,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  section: {
    marginTop: 20,
  },
  input: { borderWidth: 1, borderColor: 'gray', marginVertical: 5 },
});

export default App;
