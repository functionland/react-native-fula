import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  View,
  Button,
  TextInput,
} from 'react-native';

import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
} from 'react-native-document-picker';
import {
  fula,
  get,
  pull,
  put,
  push,
  has,
  shutdown,
  Types,
} from 'react-native-fula';

import { Header } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [result, setResult] = React.useState<
    DocumentPickerResponse | undefined | null
  >();
  const [fileRef, setFileRef] = React.useState<
    Types.FileRef | undefined | null
  >();
  const [filePath, setFilePath] = React.useState<string | undefined | null>();
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [inprogress, setInprogress] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
  }, [result]);

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
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Key:</Text>
            <TextInput
              onChangeText={(t) => setKey(t)}
              value={key}
              style={styles.input}
            />

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
                  if (result) {
                    const res = await fula.put(key, value);
                    console.log(res);
                    //setBS64(_bs64)
                  }
                } catch (e) {
                  handleError(e);
                }
              }}
              color={inprogress ? 'green' : 'gray'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
