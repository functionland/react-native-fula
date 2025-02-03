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

export const findBestAndTargetInLogs = (
  containerName: string,
  tailCount: string
): Promise<BType.FindBestAndTargetInLogsResponse> => {
  console.log('findBestAndTargetInLogs in react-native started');
  let res = Fula.findBestAndTargetInLogs(containerName, tailCount)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.FindBestAndTargetInLogsResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in findBestAndTargetInLogs:', e1);
          throw e1; // Rethrow the error to maintain the rejection state
        }
      }
    })
    .catch((err) => {
      console.error('Error findBestAndTargetInLogs:', err);
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

export const listPlugins = (): Promise<BType.ListPluginsResponse> => {
  console.log('listPlugins in react-native started');
  let res = Fula.listPlugins()
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.ListPluginsResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in listPlugins:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error listPlugins:', err);
      throw err;
    });
  return res;
};

export const listActivePlugins =
  (): Promise<BType.ListActivePluginsResponse> => {
    console.log('listActivePlugins in react-native started');
    let res = Fula.listActivePlugins()
      .then((res1) => {
        try {
          console.log('res1 received');
          console.log(res1);
          let jsonRes: BType.ListActivePluginsResponse = JSON.parse(res1);
          if (jsonRes.status) {
            return jsonRes;
          } else {
            console.error('Error getting listActivePlugins:', jsonRes.msg);
            throw jsonRes;
          }
        } catch (e) {
          try {
            return JSON.parse(res1);
          } catch (e1) {
            console.error('Error parsing res in listActivePlugins:', e1);
            throw e1;
          }
        }
      })
      .catch((err) => {
        console.error('Error listActivePlugins:', err);
        throw err;
      });
    return res;
  };

export const installPlugin = (
  pluginName: string,
  params: string
): Promise<BType.InstallPluginResponse> => {
  console.log('installPlugin in react-native started');
  let res = Fula.installPlugin(pluginName, params)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.InstallPluginResponse = JSON.parse(res1);
        if (jsonRes.status) {
          return jsonRes;
        } else {
          throw jsonRes;
        }
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in installPlugin:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error installPlugin:', err);
      throw err;
    });
  return res;
};

export const uninstallPlugin = (
  pluginName: string
): Promise<BType.UninstallPluginResponse> => {
  console.log('uninstallPlugin in react-native started');
  let res = Fula.uninstallPlugin(pluginName)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.UninstallPluginResponse = JSON.parse(res1);
        if (jsonRes.status) {
          return jsonRes;
        } else {
          throw jsonRes;
        }
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in uninstallPlugin:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error uninstallPlugin:', err);
      throw err;
    });
  return res;
};

export const showPluginStatus = (
  pluginName: string,
  lines: number
): Promise<BType.ShowPluginStatusResponse> => {
  console.log('showPluginStatus in react-native started');
  let res = Fula.showPluginStatus(pluginName, lines)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.ShowPluginStatusResponse = JSON.parse(res1);
        return jsonRes;
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in showPluginStatus:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error showPluginStatus:', err);
      throw err;
    });
  return res;
};

export const getInstallStatus = (
  pluginName: string
): Promise<BType.GetInstallStatusResponse> => {
  console.log('getInstallStatus in react-native started');
  let res = Fula.getInstallStatus(pluginName)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.GetInstallStatusResponse = JSON.parse(res1);
        if (jsonRes.status) {
          return jsonRes;
        } else {
          console.error('Error getting install status:', jsonRes.msg);
          throw jsonRes;
        }
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in getInstallStatus:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error getInstallStatus:', err);
      throw err;
    });
  return res;
};

export const getInstallOutput = (
  pluginName: string,
  params: string
): Promise<BType.GetInstallOutputResponse> => {
  console.log('getInstallOutput in react-native started');
  let res = Fula.getInstallOutput(pluginName, params)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.GetInstallOutputResponse = JSON.parse(res1);
        if (jsonRes.status) {
          return jsonRes;
        } else {
          console.error('Error getting install output:', jsonRes.msg);
          throw jsonRes;
        }
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in getInstallOutput:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error getInstallOutput:', err);
      throw err;
    });
  return res;
};

export const updatePlugin = (
  pluginName: string
): Promise<BType.UpdatePluginResponse> => {
  console.log('updatePlugin in react-native started');
  let res = Fula.updatePlugin(pluginName)
    .then((res1) => {
      try {
        console.log('res1 received');
        console.log(res1);
        let jsonRes: BType.UpdatePluginResponse = JSON.parse(res1);
        if (jsonRes.status) {
          return jsonRes;
        } else {
          console.error('Error updating plugin:', jsonRes.msg);
          throw jsonRes;
        }
      } catch (e) {
        try {
          return JSON.parse(res1);
        } catch (e1) {
          console.error('Error parsing res in updatePlugin:', e1);
          throw e1;
        }
      }
    })
    .catch((err) => {
      console.error('Error updatePlugin:', err);
      throw err;
    });
  return res;
};