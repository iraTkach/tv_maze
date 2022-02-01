/**
 * @async
 * @constant
 */
const stub = async () => {};

/**
 * @export
 * @async
 * @param {*} res 
 * @param {*} success 
 */
export const apiWrapper = async (res, success = stub) => {
  try {
    const data = await success();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};
