import Fula from '../interfaces/fulaNativeMudole';

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
export const receive = (fileId: string): Promise<any> => {
  return Fula.receive(fileId);
};
