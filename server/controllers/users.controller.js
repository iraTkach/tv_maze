import Users from "../models/user.model";
import { memberAPI } from "./../services/config/user.config";
import {
  handleJson,
  readJsonFile,
  mergeUsersWithJson,
  mergeUserWithJson,
  updateJson,
} from "./../services/utils";

const assert = require("assert");

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
 * @returns
 */
export const getPermsJson = async () => {
  return new Promise((resolve, reject) => {
    const json = readJsonFile(memberAPI.permJson, resolve);
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
    const perms = json.find((user) => user._id === _id);
    resolve(perms);
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    Users.findById(id, (err, user) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      resolve(user);
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
      abilities: { ...user.abilities },
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
        const permissionJson = await getPermsJson();

        const userData = { ...data };
        delete userData.abilities;
        delete userData.userName;

        if (user) {
          await updateJson(memberAPI.usersJson, userData, id, usersJson);

          await updateJson(
            memberAPI.permJson,
            { abilities: data.abilities },
            id,
            permissionJson
          );

          const users = await getAllUsers();
          const userJson = await getUserJson(id.toString());
          const mergedUser = await mergeUserWithJson(user, userJson);

          resolve(
            users.map((user) => {
              if (user._id === id.toString()) {
                return {
                  ...user,
                  ...mergedUser,
                };
              }

              return user;
            })
          );
        }
      }
    });
  });
};

export const updateUserSubs = (id, subscriptions) => {
  return new Promise((resolve, reject) => {
    Users.findOneAndUpdate(
      { _id: id },
      { $set: { subscriptions } },
      async (err, _user) => {
        if (err) {
          return reject(err);
        }

        if (_user) {
          const userJson = await getUserJson(_user._id.toString());
          const permission = await getUserPermsJson(_user._id.toString());
          
          resolve({
            name: userJson.name,
            username: _user.userName,
            isSignedIn: true,
            isAdmin: _user?.isAdmin,
            permission,
            subscriptions,
          });
        } else {
          reject({ error: "Unable to update user subscriptions." });
        }
      }
    );
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
