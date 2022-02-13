import { stub } from "./request";
import { readFileSync, readFile, writeFile } from "fs";

/**
 * @constant
 * @param {string} path
 * @param {string} data
 * @param {function} [callback]
 * @param {boolean} [create]
 */
const updateFile = (path, data, callback = stub, create = true) => {
  writeFile(path, data, "utf-8", (writeError) => {
    if (writeError) throw writeError;
    console.log(`A file: ${path} was ${create ? "created" : "updated"}`);
    return callback();
  });
};

/**
 * @export
 * @param {string} path
 * @param {string} validateBy
 * @param {*} [data]
 * @param {function} [resolve]
 */
export const handleJson = (path, validateBy, data = {}, resolve = stub) => {
  /**
   * @function
   * @private
   * @param readError
   * @param {function} [fallback]
   */
  function _createIfNotExists(readError, fallback = stub) {
    if (readError) {
      if (readError.code === "ENOENT") {
        console.info(`File: ${path} does not exist`);
        fallback();
        return false;
      }

      throw readError;
    }
  }

  readFile(path, (readError, content) => {
    if (readError) {
      return _createIfNotExists(readError, () =>
        updateFile(
          path,
          JSON.stringify([], null, 4),
          () => {
            return handleJson(path, validateBy, data, resolve);
          },
          true
        )
      );
    }

    let parsedJson = [];

    try {
      parsedJson = JSON.parse(content);
    } catch (parseJsonError) {
      console.log(`Empty file`, parseJsonError);
    }

    const _exists = parsedJson.find(
      (item) => item[validateBy] === data[validateBy]
    );

    if (_exists) {
      return console.warn("Entity already exists");
    }

    parsedJson.push(data);

    updateFile(
      path,
      JSON.stringify(parsedJson, null, 4),
      () => {
        resolve("A file was updated");
      },
      false
    );
  });
};

/**
 * @export
 * @param {string} path
 */
export const readJsonFile = async (path) => {
  const content = readFileSync(path);
  try {
    return JSON.parse(content);
  } catch (parseJsonError) {
    console.error(parseJsonError);
  }
};

/**
 * @export
 * @param {array} [users]
 * @param {array} [usersJson]
 * @returns {array}
 */
export const mergeUsersWithJson = async (users = [], usersJson = []) => {
  return users?.map((user) => {
    const _usersJson = usersJson.find(
      (_user) => _user._id === user._id.toString()
    );
    if (_usersJson) {
      return {
        userName: user.userName,
        subscriptions: user.subscriptions,
        ..._usersJson,
      };
    }
    return {
      _id: user._id.toString(),
      userName: user.userName,
    };
  });
};

/**
 * @export
 * @param {*} userJson
 * @returns
 */
export const mergeUserWithJson = async (user, userJson) => {
  // const usersJson = await getUsersJson();
  // const userJson = usersJson.find((user) => user._id === _id);
  if (userJson) {
    return {
      userName: user.userName,
      ...userJson,
    };
  }
};

/**
 * @export
 * @param {string} path
 * @param {*} data
 * @param {string} _id
 * @param {array} [json]
 * @returns
 */
export const updateJson = async (path, data, _id, json = []) => {
  const idx = json.findIndex((item) => item._id === _id);

  if (idx > -1) {
    json[idx] = {
      ...json[idx],
      ...data,
    };

    return updateFile(
      path,
      JSON.stringify(json, null, 4),
      () => {
        return "A file was updated";
      },
      false
    );
  }

  throw new Error(`Unable to find item: ${_id}`);
};