import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { fula } from '@functionland/react-native-fula';

const App = () => {
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [inprogress, setInprogress] = React.useState<boolean>(false);

  const [initComplete, setInitComplete] = React.useState<
    { peerId: string; rootCid: string; private_ref: string } | {}
  >({});
  var RNFS = require('react-native-fs');
  const readFile = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result) => {
        console.log('GOT RESULT', result);
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          return RNFS.readFile(statResult[1], 'utf8');
        }
        return 'no file';
      })
      .then((contents) => {
        console.log(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  };
  const privateKey = [
    183, 7, 117, 9, 159, 132, 170, 235, 215, 34, 145, 181, 60, 207, 4, 27, 27,
    17, 17, 167, 100, 89, 157, 218, 73, 200, 183, 145, 104, 151, 204, 142, 241,
    94, 225, 7, 153, 168, 239, 94, 7, 187, 123, 158, 149, 149, 227, 170, 32, 54,
    203, 243, 211, 78, 120, 114, 199, 1, 197, 134, 6, 91, 87, 152,
  ];
  const newClient = async () => {
    try {
      return fula.newClient(
        privateKey.toString(),
        '',
        '/ip4/192.168.2.14/tcp/40001/p2p/12D3KooWBdzmgXe9uyYoxaeLLKTLWM7mG3ZtBiKHAnSVxtrVJc2A',
        ''
      );
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };
  const initFula = async () => {
    try {
      return fula.init(
        privateKey.toString(),
        '',
        '/ip4/192.168.2.14/tcp/40001/p2p/12D3KooWBdzmgXe9uyYoxaeLLKTLWM7mG3ZtBiKHAnSVxtrVJc2A',
        ''
      );
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };
  React.useEffect(() => {
    //fula.logout(privateKey.toString(),'').then((a) => {
    initFula()
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
      });
    //});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Put & Get</Text>

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test'}
          onPress={async () => {
            try {
              let resinit = await initFula();
              if (resinit) {
                console.log('initialization is completed. putting key/value');
                var path = RNFS.DocumentDirectoryPath + '/test.txt';
                RNFS.writeFile(path, 'test', 'utf8')
                  .then((success) => {
                    console.log(
                      'FILE WRITTEN in ' +
                        RNFS.DocumentDirectoryPath +
                        '/test.txt'
                    );
                    fula
                      .writeFile(
                        'root/test.txt',
                        RNFS.DocumentDirectoryPath + '/test.txt'
                      )
                      .then((res) => {
                        console.log('upload completed');
                        console.log(res);
                        fula
                          .readFile(
                            'root/test.txt',
                            RNFS.DocumentDirectoryPath + '/test2.txt'
                          )
                          .then((res) => {
                            console.log('read completed');
                            readFile();
                            /*fula
                              .mv('root/test.txt', 'root/testmv.txt')
                              .then((resmv) => {
                                console.log('mv complete');
                                console.log(resmv);
                                fula
                                  .cp('root/testmv.txt', 'root/testcp.txt')
                                  .then((rescp) => {
                                    console.log('cp complete');
                                    console.log(rescp);

                                    fula.ls('root').then((res2) => {
                                      console.log('ls2 complete');
                                      console.log(res2);
                                      fula.shutdown();
                                    });
                                  });
                              });*/
                          });
                      });
                  })
                  .catch((err) => {
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
          title={inprogress ? 'Putting & Getting...' : 'Check Failes'}
          onPress={async () => {
            try {
              if (initComplete) {
                console.log('initialization is completed. retry');
                var path = RNFS.DocumentDirectoryPath + '/test_r.txt';
                RNFS.writeFile(path, 'test_r', 'utf8')
                  .then((success) => {
                    console.log(
                      'FILE WRITTEN in ' +
                        RNFS.DocumentDirectoryPath +
                        '/test_r.txt'
                    );
                    fula
                      .writeFile(
                        'root/test_r.txt',
                        RNFS.DocumentDirectoryPath + '/test_r.txt'
                      )
                      .then((res) => {
                        console.log('upload completed');
                        console.log(res);
                        fula
                          .readFile(
                            'root/test_r.txt',
                            RNFS.DocumentDirectoryPath + '/test_r2.txt'
                          )
                          .then((res) => {
                            console.log('read completed');
                            readFile();
                            fula
                              .checkFailedActions()
                              .then((f) => {
                                console.log('failed actions');
                                console.log(f);
                              })
                              .catch((e) => {
                                console.log(e);
                              });
                            /*fula
                              .mv('root/test.txt', 'root/testmv.txt')
                              .then((resmv) => {
                                console.log('mv complete');
                                console.log(resmv);
                                fula
                                  .cp('root/testmv.txt', 'root/testcp.txt')
                                  .then((rescp) => {
                                    console.log('cp complete');
                                    console.log(rescp);

                                    fula.ls('root').then((res2) => {
                                      console.log('ls2 complete');
                                      console.log(res2);
                                      fula.shutdown();
                                    });
                                  });
                              });*/
                          });
                      });
                  })
                  .catch((err) => {
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
                fula.checkConnection().then((r) => {
                  console.log('connection cehck');
                  console.log(r);
                  if (r) {
                    console.log('initialization is completed. retry');
                    fula
                      .checkFailedActions(true)
                      .then((res) => {
                        console.log('retried');
                        console.log(res);
                      })
                      .catch((e) => {
                        console.log('retry failed');
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
