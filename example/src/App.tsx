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
import { file, fula, graph } from 'react-native-fula';

import { Header } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [boxAddr, setBoxAddr] = useState(
    '/ip4/192.168.1.10/tcp/4002/p2p/12D3KooWDVgPHx45ZsnNPyeQooqY8VNesSR2KiX2mJwzEK5hpjpb'
  );
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [result, setResult] = React.useState<
    DocumentPickerResponse | undefined | null
  >();
  const [cid, setCid] = React.useState<string | undefined | null>();
  const [filePath, setFilePath] = React.useState<string | undefined | null>();
  const [bs64, setBS64] = React.useState<string | undefined | null>();
  const [gqlQuery, setGqlQuery] = React.useState<string>(`
  mutation addTodo($values:JSON){
    create(input:{
    collection:"todo",
    values: $values 
    }){
    id
    text
    isComplete
    }
  } 
  `);
  const [gqlValues, setGqlValues] = React.useState<string>(`
  {
    "values": []
  }
  `);
  const [gqlRes, setGqlRes] = React.useState<string>('');

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
  }, [result]);

  const connectToBox = async () => {
    try {
      setConnecting(true);
      const connectStatus = await fula.addBox(boxAddr);
      setConnecting(false);
      setConnectionStatus(connectStatus);
      console.log('connected:', connectStatus);
    } catch (error) {
      setConnecting(false);
      console.log('connected:', false);
    }
  };
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
        <Header />
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Box Address:</Text>
            <TextInput
              onChange={(e) => setBoxAddr(e.target.value)}
              value={boxAddr}
              style={styles.input}
            />
            <Button
              title={
                connecting
                  ? 'Connecting...'
                  : connectionStatus
                  ? 'Connected'
                  : 'STEP 1: Connect to Box'
              }
              onPress={connectToBox}
              color={connectionStatus ? 'green' : 'gray'}
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
            {result?.name ? <Text>{result.name}</Text> : null}
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
            {cid ? <Text>File CID: {cid}</Text> : null}
          </View>
          <View style={styles.section}>
            <Button
              title="STEP 4: Get the file from Box"
              onPress={async () => {
                try {
                  if (result) {
                    const {uri:_filepath,base64:_bs64} = await file.receive(cid,false);
                    console.log(_bs64);
                    setFilePath(_filepath);
                    setBS64(_bs64)
                  }
                } catch (e) {
                  handleError(e);
                }
              }}
            />
          </View>

          <View style={styles.section}>
            {filePath && <Image resizeMode="cover" style={styles.imageShow} source={{ uri: `${decodeURI(filePath)}` }} />}
            {filePath && <Text>{decodeURI(filePath)}</Text>}
          </View>

          <View style={styles.section}>
            <Text>GraphQL query:</Text>
            <TextInput
              onChangeText={(value) => setGqlQuery(value)}
              value={gqlQuery} 
              style={styles.input}
              multiline={true}
            />
            <Text>Variable values:</Text>
            <TextInput
              onChangeText={(value) => setGqlValues(value)}
              value={gqlValues}
              style={styles.input}
              multiline={true}
            />
            <Button
              title="STEP 5: Run graphQL operations"
              onPress={async () => {
                try {
                  const res = await graph.graphql(
                    gqlQuery,
                    JSON.parse(gqlValues)
                  );
                  setGqlRes(res);
                  console.log(res);
                } catch (e) {
                  handleError(e);
                }
              }}
            />
            <Text>{JSON.stringify(gqlRes)}</Text>
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
    padding: 5
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
