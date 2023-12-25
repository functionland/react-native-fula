import Fula from '../interfaces/fulaNativeModule';
import type * as BType from '../types/fxblox';

/**
 * send a command to Blox hardware to remove all save wifis.
 * @returns json{status:true if success, false if fails; msg: error message or success log}
 */

export const wifiRemoveall = (): Promise<BType.wifiRemoveallResponse> => {
  console.log('wifiRemoveall in react-native started');
  let res2 = Fula.wifiRemoveall()
    .then((res) => {
      try {
        let jsonRes: BType.wifiRemoveallResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res2;
};

export const reboot = (): Promise<BType.rebootResponse> => {
  console.log('reboot in react-native started');
  let res2 = Fula.reboot()
    .then((res) => {
      try {
        let jsonRes: BType.rebootResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res2;
};

export const eraseBlData = (): Promise<BType.rebootResponse> => {
  console.log('eraseBlData in react-native started');
  let res2 = Fula.eraseBlData()
    .then((res) => {
      try {
        let jsonRes: BType.eraseBlDataResponse = JSON.parse(res);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res);
        } catch (e2) {
          return res;
        }
      }
    })
    .catch((err) => {
      return err;
    });
  return res2;
};
