import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { fula, Types } from 'react-native-fula';

const App = () => {
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [inprogress, setInprogress] = React.useState<boolean>(false);

  const [initComplete, setInitComplete] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const config: Types.Config = {
        identity: '',
        storePath: '',
      };
      const initFula = async () => {
        try {
          let f = await fula.initJNI('', '');
          console.log('initialization result', f);

          setInitComplete(f);
        } catch (e) {
          console.log(e);
        }
      };
      try {
        initFula();
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Put & Get</Text>

        <Button
          title={inprogress ? 'Putting & Getting...' : 'Test'}
          onPress={async () => {
            try {
              const jsonvalue = { hello: 'world' };
              const ciduint8 = [
                1, 112, 18, 32, 195, 196, 115, 62, 200, 175, 253, 6, 207, 158,
                159, 245, 15, 252, 107, 205, 46, 200, 90, 97, 112, 0, 75, 183,
                9, 102, 156, 49, 222, 148, 57, 26,
              ];
              const cid =
                'bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea';
              if (initComplete) {

                console.log('initialization is completed. putting key/value');
                const res = await fula.putJNI(
                  ciduint8.toString(),
                  JSON.stringify(jsonvalue)
                );
                console.log(res);
                console.log('Now fetching key...');
                const res2 = await fula.getJNI(ciduint8.toString());
                console.log(JSON.parse(res2));
                //setBS64(_bs64)
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
