import Fula from '../interfaces/fulaNativeModule';
import type * as BType from '../types/blockchain';


export const createAccount = (
  seed: string, //seed that is used to create the account. It must start with "/"
): Promise<{ seed: string; account: string; }> => {
  console.log(
    'createAccount in react-native started',
    seed
  );
  let res = Fula.createAccount(seed).then((res) => {
    try{
      let jsonRes:BType.SeededResponse = JSON.parse(res);
      return jsonRes;
    } catch (e) {
      try {
        return JSON.parse(res)
      } catch (e) {
        return res;
      }
    }
  }).catch((err) => {
    return err;
  });
  return res;
};


export const checkAccountExists = (
  account: string,
): Promise<{ account: string; exists: boolean}> => {
  console.log(
    'checkAccountExists in react-native started',
    account
  );
  let res = Fula.checkAccountExists(account).then((res) => {
    try{
      let jsonRes: BType.AccountExistsResponse = JSON.parse(res);
      return jsonRes;
    } catch (e) {
      try {
        return JSON.parse(res)
      } catch (e) {
        return res;
      }
    }
  }).catch((err) => {
    return err;
  });
  return res;
};

