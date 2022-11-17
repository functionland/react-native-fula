import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ActionSheetIOS,
} from 'react-native';

import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import { fula, Types } from 'react-native-fula';

const App = () => {
  const CID = require('cids');
  const multihashing = require('multihashing-async');

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

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered'
      );
    } else {
      console.log(err);
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Value:</Text>
        <TextInput
          onChangeText={(t) => setValue(t)}
          value={value}
          style={styles.input}
        />

        <Button
          title={inprogress ? 'Putting...' : 'Put'}
          onPress={async () => {
            try {
              if (initComplete) {
                console.log('initialization is completed');
                const cid = 'bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu';
                console.log(cid);
                const res = await fula.putJNI(cid, value);
                console.log(res);
                console.log('here');
                const res2 = await fula.getJNI(cid);
                console.log(res2);
                //setBS64(_bs64)
              } else {
                console.log('wait for init to complete');
              }
            } catch (e) {
              handleError(e);
            }
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
