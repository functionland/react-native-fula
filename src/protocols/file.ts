import Fula from '../interfaces/fulaNativeModule';
import { SchemaProtocol } from '@functionland/file-protocol';
import 'fastestsmallesttextencoderdecoder';

/**
 * Send (store) a file to the box
 * @param filePath
 * @returns
 */
export const send = (filePath: string): Promise<any> => {
  return Fula.send(filePath);
};

/**
 * Get a file from box by fileId (CID)
 * @param fileId
 * @returns
 */
export const receive = async (fileId: string, include64:boolean,fileName?: string): Promise<any> => {
    const buf = await Fula.receiveFileInfo(fileId)
    const meta = SchemaProtocol.Meta.fromBinary(Uint8Array.from(buf))
    let _fileName
    if(!fileName){
      _fileName = fileId + "." + meta.name.split(".").pop()
    } else {
      _fileName = fileName
    }
    const {uri,base64} = await Fula.receiveFile(fileId, _fileName, include64)
    return {meta,uri,base64};
};
