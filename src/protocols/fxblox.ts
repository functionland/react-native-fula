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

export const partition = (): Promise<BType.partitionResponse> => {
  console.log('partition in react-native started');
  let res2 = Fula.partition()
    .then((res) => {
      try {
        let jsonRes: BType.partitionResponse = JSON.parse(res);
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

export const fetchContainerLogs = (
  containerName: string,
  tailCount: string
): Promise<BType.FetchContainerLogsResponse> => {
  console.log('fetchContainerLogs in react-native started');
  let res = Fula.fetchContainerLogs(containerName, tailCount)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.FetchContainerLogsResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in fetchContainerLogs:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error fetchContainerLogs:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};

export const getFolderSize = (
  folderPath: string
): Promise<BType.GetFolderPathResponse> => {
  console.log('getFolderSize in react-native started');
  let res = Fula.getFolderSize(folderPath)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.GetFolderPathResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in getFolderSize:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error getFolderSize:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};


export const getDatastoreSize = (): Promise<BType.GetDatastoreSizeResponse> => {
  console.log('getDatastoreSize in react-native started');
  let res = Fula.getDatastoreSize()
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.GetDatastoreSizeResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in getDatastoreSize:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error getDatastoreSize:', err);
      throw err; // Rethrow the error to maintain the rejection state
    });
  return res;
};
