/**
 * @async
 * @export
 * @constant
 */
export const stub = async () => {};

/**
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {function} success
 * @param {string} [method]
 */
export const apiWrapper = async (req, res, success = stub, method = "get") => {
  try {
    const id = req?.params?.id;
    const body = req?.body;
    let data;

    if (method === "get") {
      data = await success(id);
    } else if (method === "post") {
      data = await success(body);
    } else if (method === "put") {
      data = await success(id, body);
    } else if (method === "delete") {
      data = await success(id);
    } else {
      throw new Error("Invalid method", method);
    }

    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
