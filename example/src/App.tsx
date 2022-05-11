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
  TextInput
} from 'react-native';

import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
} from 'react-native-document-picker';
import { file, fula } from 'react-native-fula';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [boxAddr, setBoxAddr] = useState('/ip4/192.168.0.200/tcp/4002/p2p/12D3KooWCEFLs7C3NpYkp7tJztJ99zcBe3XknMdqG7mwuPqXiW1d');
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [result, setResult] = React.useState<
    DocumentPickerResponse | undefined | null
  >();
  const [cid, setCid] = React.useState<string | undefined | null>();
  const [filePath, setFilePath] = React.useState<string | undefined | null>();

  useEffect(() => {
  });

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
  }, [result]);

  const connectToBox = async () => {
    setConnecting(true)
    const connectStatus = await fula.connect(boxAddr);
    setConnecting(false)
    setConnectionStatus(connectStatus);
    console.log('connected:', connectStatus);
  }
  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered'
      );
    } else {
      throw err;
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <Header/>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Box Address:</Text>
            <TextInput value={boxAddr} style={{ borderWidth: 1, borderColor: "gray", marginVertical: 5 }} />
            <Button
              title={connecting ? "Connecting..." :connectionStatus?"Connected":"STEP 1: Connect to Box"}
              onPress={connectToBox}
              color={connectionStatus ? "green" : "gray"}
            />
          </View>
          <View style={styles.section}>
            <Button
              title="STEP 2: Select a file"
              onPress={async () => {
                try {
                  const pickerResult = await DocumentPicker.pickSingle({
                    presentationStyle: 'fullScreen',
                    copyTo: 'documentDirectory',
                  });
                  setResult(pickerResult);
                } catch (e) {
                  handleError(e);
                }
              }}
            />
            {result?.name?<Text>{result.name}</Text>:null}
          </View>
          <View style={styles.section}>
            <Button
              title="STEP 3: Send the file to Box"
              onPress={async () => {
                try {
                  if (result) {
                    const _filePath = result.fileCopyUri?.split('file:')[1];
                    const _cid = await file.send(decodeURI(_filePath));
                    console.log('file saved with CID: ', _cid);
                    setCid(_cid);
                  }
                } catch (e) {
                  handleError(e);
                }
              }}
            />
          </View>
          <View style={styles.section}>
            <Button
              title="STEP 4: Get the file from Box"
              onPress={async () => {
                try {
                  if (result) {
                    const _filepath = await file.receive(cid);
                    console.log(_filepath);
                    setFilePath(_filepath);
                  }
                } catch (e) {
                  handleError(e);
                }
              }}
            />
          </View>

          <View style={styles.section}>
            {filePath && <Image source={{ uri: `${decodeURI(filePath)}` }}></Image>}
            {filePath && <Text>{decodeURI(filePath)}</Text>}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "white",
    padding: 10
  },
  section: {
    marginTop: 20
  }
});

export default App;
