import Fula from '../interfaces/fulaNativeModule';

/**
 * Register the app's lifecycle listeners to handle foreground, background, and termination states.
 */
export const registerLifecycleListener = (): Promise<void> => {
  console.log('called registerLifecycleListener');
  return Fula.registerLifecycleListener();
};

/**
 * Initializes the Fula client and connects to a blox node.
 * @param identity - privateKey of did identity
 * @param storePath - local store path (can be empty)
 * @param bloxAddr - Blox multiaddr
 * @param exchange - exchange protocol (set to 'noope' for testing)
 * @param autoFlush - write actions to disk after each write
 * @param rootCid - latest rootCid if available
 * @param useRelay - force the use of relay
 * @param refresh - force refresh of the fula object
 * @returns peerId and rootCid
 */
export const init = (
  identity: string,
  storePath: string,
  bloxAddr: string,
  exchange: string,
  autoFlush: boolean = false,
  rootCid: string | null = null,
  useRelay: boolean = true,
  refresh: boolean = false
): Promise<{ peerId: string; rootCid: string }> => {
  console.log(
    'init in react-native started',
    identity,
    storePath,
    bloxAddr,
    exchange,
    autoFlush,
    useRelay
  );
  return Fula.initFula(
    identity,
    storePath,
    bloxAddr,
    exchange,
    autoFlush,
    rootCid,
    useRelay,
    refresh
  );
};

/**
 * Creates a new Fula client without initializing the filesystem.
 * @param identity - privateKey of did identity
 * @param storePath - local store path (can be empty)
 * @param bloxAddr - Blox multiaddr
 * @param exchange - exchange protocol (set to 'noope' for testing)
 * @param autoFlush - write actions to disk after each write
 * @param useRelay - force the use of relay
 * @param refresh - force refresh of the fula object
 * @returns peerId as string
 */
export const newClient = (
  identity: string,
  storePath: string,
  bloxAddr: string,
  exchange: string,
  autoFlush: boolean = false,
  useRelay: boolean = true,
  refresh: boolean = false
): Promise<string> => {
  console.log(
    'newClient in react-native started',
    identity,
    storePath,
    bloxAddr,
    exchange,
    autoFlush,
    useRelay,
    refresh
  );
  return Fula.newClient(
    identity,
    storePath,
    bloxAddr,
    exchange,
    autoFlush,
    useRelay,
    refresh
  );
};

/**
 * Logs out and removes all local data.
 * @param identity - identity key
 * @param storePath - local store path
 * @returns boolean indicating success
 */
export const logout = (
  identity: string,
  storePath: string
): Promise<boolean> => {
  return Fula.logout(identity, storePath);
};

/**
 * Checks the connection to the blox node.
 * @param timeout - timeout in seconds (default 20)
 * @returns boolean indicating connection status
 */
export const checkConnection = (timeout: number = 20): Promise<boolean> => {
  return Fula.checkConnection(timeout);
};

/**
 * Ping sends libp2p pings to the blox peer and returns results.
 * Uses direct -> relay -> DHT fallback for connectivity.
 * @param timeout - timeout in seconds (default 60)
 * @returns {success, successes, avg_rtt_ms, errors}
 */
export const ping = (
  timeout: number = 60
): Promise<{
  success: boolean;
  successes: number;
  avg_rtt_ms: number;
  errors: string[];
}> => {
  return Fula.ping(timeout).then((res: string) => JSON.parse(res));
};

/**
 * Shutdown closes all resources used by Client.
 * After calling this function Client must be discarded.
 */
export const shutdown = (): Promise<void> => {
  return Fula.shutdown();
};

/**
 * isReady checks if the connection is ready to be used.
 * @param filesystemCheck - also check if the filesystem is ready
 * @returns boolean indicating readiness
 */
export const isReady = (filesystemCheck: boolean = true): Promise<boolean> => {
  return Fula.isReady(filesystemCheck);
};
