import Fula from '../interfaces/fulaNativeModule';
import type { FileMeta, FileRef } from '../interfaces';
import 'fastestsmallesttextencoderdecoder';
import { Buffer } from 'buffer';

/**
 * Send (store) a file to the box
 * @param filePath
 * @returns
 */
export const send = (filePath: string): Promise<string> => {
  return Fula.send(filePath);
};

/**
 * Encrypt and Send (store) a file to the box
 * @param filePath
 * @returns
 */
export const encryptSend = async (filePath: string): Promise<FileRef> => {
  let fileRef = await Fula.encryptSend(filePath);

  return base64ToObject<FileRef>(fileRef);
};

/**
 * Get a file from box by fileId (CID)
 * @param fileId
 * @returns
 */
export const receive = async (
  fileId: string,
  fileName?: string
): Promise<[uri: string, meta: FileMeta]> => {
  const meta = await receiveFileInfo(fileId);
  let _fileName;
  if (!fileName) {
    _fileName = fileId + '.' + meta.name.split('.').pop();
  } else {
    _fileName = fileName;
  }
  const uri = await Fula.receiveFile(fileId, _fileName);
  return [uri, meta];
};

/**
 * Get a file info from box by fileId (CID)
 * @param fileId
 * @returns
 */
export const receiveFileInfo = async (fileId: string): Promise<FileMeta> => {
  const meta = await Fula.receiveFileInfo(fileId);
  return base64ToObject<FileMeta>(meta);
};

/**
 * Get a file from box by fileId (CID)
 * @param fileRef
 * @param fileName
 * @returns
 */
export const receiveDecrypt = async (
  fileRef: FileRef,
  fileName?: string
): Promise<[uri: string, meta: FileMeta]> => {
  let _fileName;
  const meta = await receiveFileInfo(fileRef.id);
  if (!fileName) {
    _fileName = fileRef.id + meta.name.split('.').pop();
  } else {
    _fileName = fileName;
  }
  const uri = await Fula.receiveDecryptFile(
    objectToBase64String(fileRef),
    _fileName
  );
  return [uri, meta];
};

export const base64ToObject = <T>(msg: string): T => {
  return JSON.parse(Buffer.from(msg, 'base64').toString());
};

export const objectToBase64String = (obj: object): string => {
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString('base64');
};
