import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { fula } from '@functionland/react-native-fula';

const App = () => {
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [inprogress, setInprogress] = React.useState<boolean>(false);

  const [initComplete, setInitComplete] = React.useState<{peerId: string, rootCid: string, private_ref:string} | {}>({});

  React.useEffect(() => {
    const initFula = async () => {
      try {
        const privateKey = [
          183, 7, 117, 9, 159, 132, 170, 235, 215, 34, 145, 181, 60, 207, 4, 27,
          27, 17, 17, 167, 100, 89, 157, 218, 73, 200, 183, 145, 104, 151, 204,
          142, 241, 94, 225, 7, 153, 168, 239, 94, 7, 187, 123, 158, 149, 149,
          227, 170, 32, 54, 203, 243, 211, 78, 120, 114, 199, 1, 197, 134, 6,
          91, 87, 152,
        ];
        return fula.init(
          privateKey.toString(),
          '',
          '',
          'noop',
          null,
		      Promise
        );
      } catch (e) {
        console.log(e);
        return Promise.reject(e);
      }
    };

    initFula()
      .then((res) => {        
        console.log("OK",res);
        setInitComplete(res);
      })
      .catch((e) => {
        console.log('error', e);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Put & Get</Text>

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test'}
          onPress={async () => {
            try {

              if (initComplete) {
                console.log('initialization is completed. putting key/value');
                
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {}
          }}
          color={inprogress ? 'green' : 'gray'}
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
