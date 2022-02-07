import Users from "../models/user.model";
import { getAll } from "../services/axios";
import { userAPI } from "../services/config/user.config";
import { memberAPI } from "./../services/config/user.config";
import { handleJson, readJsonFile } from "./../services/utils";

const assert = require("assert");

/**
 * @async
 * @private
 */
async function _getAll() {
  const response = await getAll(userAPI.baseUrl);

  if (response.status === 200) {
    return response.data;
  }

  console.error("Error!");
}

/**
 * @export
 */
export const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    Users.find({}, async (err, users) => {
      if (err) return reject(err);
      const json = await getUsersJson();
      users = users.map((user) => {
        const _json = json.find((_user) => _user._id === user._id.toString());
        if (_json) {
          return {
            userName: user.userName,
            ..._json
          };
        }
        return {
          _id: user._id.toString(),
          userName: user.userName
        };
      });
      resolve(users);
    });
  });
};

/**
 * @export
 * @returns
 */
export const getUsersJson = async () => {
  return new Promise((resolve, reject) => {
    const json = readJsonFile(memberAPI.usersJson, resolve);
    resolve(json);
  });
};

/**
 * @export
 * @params {string} id
 * @returns
 */
export const getUserJson = async (id) => {
  return new Promise(async (resolve, reject) => {
    const json = await readJsonFile(memberAPI.usersJson, resolve);
    resolve(json.find((user) => user.id === id));
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    Users.findById(id, (err, users) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      resolve(users);
    });
  });
};

/**
 * @export
 * @param {*} _id
 * @param {*} user
 * @returns
 */
export const addUserFile = (_id, user) => {
  return new Promise((resolve) => {
    const userObj = {
      _id,
      name: user.name,
      createdAt: new Date().toLocaleString(),
      timeOut: 120,
    };

    const permObj = {
      _id,
      permissions: {
        viewSub: true,
        createSub: false,
        deleteSub: false,
        viewMovie: true,
        createMovie: false,
        deleteMovie: false,
      },
    };

    handleJson(memberAPI.usersJson, "_id", userObj, resolve);
    handleJson(memberAPI.permJson, "_id", permObj, resolve);
  });
};

/**
 * @export
 * @async
 * @param {*} newUser
 */
export const addUser = async (newUser) => {
  const users = await getAllUsers();
  const exists = users.find((user) => user.userName === newUser.userName);

  if (!exists) {
    return console.warn("User doesn't exist");
  }
  //console.log(newUser.password);
  return await updateUser(newUser.id, {
    ...newUser,
    password: newUser.password,
  });
};

/**
 * @export
 * @async
 * @param {*} newUser
 */
export const addUserAdmin = async (newUser) => {
  const users = await getAllUsers();
  const exists = users.find((user) => user.userName === newUser.userName);

  if (exists) {
    return console.warn("User name already exists");
  }

  const user = new Users({
    userName: newUser.userName,
    password: newUser.password,
  });

  await user.save(async (err) => {
    if (err) {
      return console.error(err);
    }

    console.info("Added successfully");
    //console.info(user._id);
    await addUserFile(user._id, newUser)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  });

  users.push(user);

  return users;
};

/**
 * @export
 * @async
 * @param {String} id
 * @param {*} userToUpdate
 */
export const updateUser = (id, userToUpdate) => {
  return new Promise((resolve, reject) => {
    Users.findByIdAndUpdate(id, userToUpdate, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Updated successfully");
        console.log("Updated successfully");
      }
    });
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    Users.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};
