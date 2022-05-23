import Fula from '../interfaces/fulaNativeModule';

/**
 * Add Box to peer store
 * @param boxAddr
 * @returns
 */
export const addBox = (boxAddr: string): Promise<boolean> => {
  return Fula.addBox(boxAddr);
};
