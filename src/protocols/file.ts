import Fula from '../interfaces/fulaNativeModule';
import { SchemaProtocol } from '@functionland/file-protocol';
import 'fastestsmallesttextencoderdecoder';
import { Buffer } from 'buffer'

/**
 * Send (store) a file to the box
 * @param filePath
 * @returns
 */
export const send = (filePath: string): Promise<any> => {
  return Fula.send(filePath);
};

/**
 * Encrypt and Send (store) a file to the box
 * @param filePath
 * @returns
 */
export const encryptSend = async (filePath: string): Promise<FileRef> => {
  let fileRef = await Fula.encryptSend(filePath);
  
  return fileRefFactory(fileRef)
}

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

/**
 * Get a file from box by fileId (CID)
 * @param fileId
 * @returns
 */
 export const receiveDecrypt = async (fileRef: FileRef, include64:boolean,fileName?: string): Promise<any> => {
  const buf = await Fula.receiveFileInfo(fileRef.id)
  const meta = SchemaProtocol.Meta.fromBinary(Uint8Array.from(buf))
  let _fileName
  if(!fileName){
    _fileName = fileRef.id + "." + meta.name.split(".").pop()
  } else {
    _fileName = fileName
  }
  const {uri,base64} = await Fula.receiveDecryptFile(fileRefToMessage(fileRef), _fileName, include64)
  return {meta,uri,base64};
};


export interface FileRef {
  id: string
  iv: string
  key: string
}

export type FileRefMessage = string

export const fileRefFactory = (msg: FileRefMessage): FileRef => {
  return JSON.parse(Buffer.from(msg,'base64').toString())
}

export const fileRefToMessage = (fileRef:FileRef): FileRefMessage => {
  const json = JSON.stringify(fileRef)
  return Buffer.from(json).toString('base64')
}
