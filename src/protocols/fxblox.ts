import Fula from '../interfaces/fulaNativeModule';
import type * as BType from '../types/blox';

/**
 * send a command to Blox hardware to remove all save wifis.
 * @returns json{status:true if success, false if fails; msg: error message or success log}
 */

export const wifiRemoveall = (): Promise<BType.wifiRemoveallResponse> => {
  console.log(
    'wifiRemoveall in react-native started'
  );
  return Fula.wifiRemoveall();
};
