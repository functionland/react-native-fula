import Blockchain from '../interfaces/blockchainNativeModule';


export const createAccount = (
  seed: string, //seed that is used to create the account. It must start with "/"
): Promise<{ seed: string; account: string; }> => {
  console.log(
    'createAccount in react-native started',
    seed
  );
  let res = Blockchain.createAccount(seed).then((res) => {
    try{
      let jsonRes: {seed: string, account: string} = JSON.parse(res);
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
  let res = Blockchain.checkAccountExists(account).then((res) => {
    try{
      let jsonRes: {account: string; exists: boolean} = JSON.parse(res);
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

