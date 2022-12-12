import Fula from '../interfaces/fulaNativeModule';

/**
 * Get gets the value corresponding to the given key from the local datastore.
// The key must be a valid ipld.Link.
 * @param config
 * @returns boolean
 */

export const init = (
  identity: string, //privateKey of did identity
  storePath: string,
  bloxAddr: string,
  exchange: string
): Promise<{peerId: string, rootCid: string, private_ref:string}> => {
  console.log('init in react-native started',identity, storePath, bloxAddr, exchange);
  return Fula.init(identity, storePath, bloxAddr, exchange);
};

/**
 * Get gets the value corresponding to the given key from the local datastore.
// The key must be a valid ipld.Link.
 * @param key
 * @returns value
 */
export const get = (key: string): Promise<string> => {
  return Fula.get(key);
};

/**
 * Has checks whether the value corresponding to the given key is present in the local datastore.
// The key must be a valid ipld.Link.
 * @param key
 * @returns boolean
 */
export const has = (key: Uint8Array): Promise<boolean> => {
  return Fula.has(key);
};

/**
 * Push requests the given addr to download the root cid from this node.
// The addr must be a valid multiaddr that includes peer ID.
// this function.
 * @param addr
 * @returns null or error
 */
export const push = (): Promise<string> => {
  return Fula.push();
};

/**
 * Put stores the given key value onto the local datastore.
// The key must be a valid ipld.Link and the value must be the valid encoded ipld.Node corresponding
// to the given key.
 * @param key, value
 * @returns null or string
 */
export const put = (value: string, codec: string): Promise<string> => {
  return Fula.put(value, codec);
};

/**
 * mkdir creates a directory at the given path.
 * @param path
 * @returns string: new cid of the root
 */
export const mkdir = (path: string): Promise<string> => {
  return Fula.mkdir(path);
};

/**
 * writeFileContent writes content at a given path
 * @param path
 * @returns string: new cid of the root
 */
export const writeFileContent = (path: string, content: string): Promise<string> => {
  return Fula.writeFileContent(path, content);
};

/*
    // reads content of the file form localFilename (should include full absolute path to local file with read permission
    // writes content to the specified location by fulaTargetFilename in Fula filesystem
    // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
    // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
    // Returns: new cid of the root after this file is placed in the tree
     */
export const writeFile = (fulaTargetFilename: string, localFilename: string): Promise<string> => {
  return Fula.writeFile(fulaTargetFilename, localFilename);
};

/**
 * ls lists the name of files and folders at a given path
 * @param path
 * @returns string: list of items
 * TODO: Findout how is the string and convert to array
 */
 export const ls = (path: string): Promise<string> => {
  return Fula.ls(path);
};

/**
 * rm removes all files and folders at a given path
 * @param path
 * @returns string: new cid of the root
 */
export const rm = (path: string): Promise<string> => {
  return Fula.rm(path);
};

/*
    // reads content of the file form localFilename (should include full absolute path to local file with read permission
    // writes content to the specified location by fulaTargetFilename in Fula filesystem
    // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
    // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
    // Returns: new cid of the root after this file is placed in the tree
     */
    export const readFile = (fulaTargetFilename: string, localFilename: string): Promise<string> => {
      return Fula.readFile(fulaTargetFilename, localFilename);
    };

/**
 * readFile reads content of a given path
 * @param path
 * @returns string: cotent
 */
 export const readFileContent = (path: string): Promise<string> => {
  return Fula.readFileContent(path);
};

/**
 * Shutdown closes all resources used by Client.
// After calling this function Client must be discarded.
 * @param
 * @returns
 */
export const shutdown = (): Promise<void> => {
  return Fula.shutdown();
};
