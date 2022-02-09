import Users from "../models/user.model";
import { getAll } from "../services/axios";
import { userAPI } from "../services/config/user.config";
import { memberAPI } from "./../services/config/user.config";
import {
  handleJson,
  readJsonFile,
  mergeUsersWithJson,
  mergeUserWithJson,
  updateUserJson,
} from "./../services/utils";

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
      const usersJson = await getUsersJson();
      resolve(mergeUsersWithJson(users, usersJson));
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
export const getUserJson = async (_id) => {
  return new Promise(async (resolve, reject) => {
    const json = await readJsonFile(memberAPI.usersJson, resolve);
    resolve(json.find((user) => user._id === _id));
  });
};

/**
 * @export
 * @params {string} _id
 * @returns
 */
export const getUserPermsJson = async (_id) => {
  return new Promise(async (resolve, reject) => {
    const json = await readJsonFile(memberAPI.permJson, resolve);
    resolve(json.find((user) => user._id === _id));
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
      abilities: {
        viewSub: true,
        createSub: false,
        deleteSub: false,
        updateSub: false,
        viewMovie: false,
        createMovie: false,
        deleteMovie: false,
        updateMovie: false,
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

  await user.save((err) => {
    if (err) {
      return console.error(err);
    }

    console.info("Added successfully");
  });

  await addUserFile(user._id.toString(), newUser)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));

  const userJson = await getUserJson(user._id.toString());
  const _user = await mergeUserWithJson(user, userJson);
  users.push({ ..._user });

  return users;
};

/**
 * @export
 * @async
 * @param {String} id
 * @param {*} userToUpdate
 */
export const updateUser = async (id, data) => {
  return new Promise((resolve, reject) => {
    Users.findById(id, async (err, user) => {
      if (err) {
        reject(err);
      } else {
        const usersJson = await getUsersJson();
        const _user =
          user && (await updateUserJson(memberAPI.usersJson, data, id, usersJson));
        // console.log(userToUpdate);

        resolve(_user);
        //console.log("Updated successfully for ", _user);
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
