import Fula from '../interfaces/fulaNativeMudole';

/**
 * Run a graphql operation on the Box using the graph protocol
 * @param query
 * @param variableValues
 * @returns
 */
export const graphql = (query: string, variableValues: Record<string, any>): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try{
        const values = JSON.stringify(variableValues)
        const resJsonStr = await Fula.graphQL(query, values)
        const res = JSON.parse(resJsonStr)
        resolve(res)
    }
    catch (e){
        reject(e)
    }
  })
};
