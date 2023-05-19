import Fula from '../interfaces/fulaNativeModule';

/**
 * listFoundPeers uses mdns discovery mechanism to find libp2p peers that are in the same LAN (only backnd nodes).
// this function.
 * @returns array
 */
export const listFoundPeers = async(): Promise<string[]> => {
  let peers:string[] = [];
  try {
    let foundPeers:string = await Fula.listFoundPeers();
    if (foundPeers != "") {
      peers = foundPeers.split(",");
    }
  } catch (e) {

  }
  return peers;
};
