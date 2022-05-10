import Fula from '../interfaces/fulaNativeMudole';

/**
 * Connect to the box through the box address
 * @param boxAddr
 * @returns
 */
export const connect = (boxAddr: string): Promise<boolean> => {
  return Fula.connect(boxAddr);
};
