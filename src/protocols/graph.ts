import Fula from '../interfaces/fulaNativeModule';
import { Result } from '@functionland/graph-protocol';
import 'fastestsmallesttextencoderdecoder';

/**
 * Run a graphql operation on the Box using the graph protocol
 * @param query
 * @param variableValues
 * @returns
 */
export const graphql = (
  query: string,
  variableValues: Record<string, any>
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = JSON.stringify(variableValues);
      const buf = await Fula.graphQL(query, values);
      const res = Result.fromBinary(Uint8Array.from(buf));
      
      if (res.dataOrError.oneofKind === 'error') {
        reject(Result.toJson(res));
        return
      }
      else {
        resolve(Result.toJson(res));
      }
    } catch (e) {
      reject(e);
    }
  });
};
