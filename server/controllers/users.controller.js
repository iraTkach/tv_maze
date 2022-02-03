import Users from "../models/user.model";
import { getAll } from "../services/axios";
import { userAPI } from "../services/config/user.config";
import { memberAPI } from "./../services/config/user.config";
import { handleJson } from './../services/utils';

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
      resolve(users);
    });
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
 * @param {*} id
 * @param {*} user
 * @returns
 */
export const addUserFile = (id, user) => {
  return new Promise((resolve) => {
    const userObj = {
      id,
      name: user.name,
      createdAt: new Date().toLocaleString(), 
      timeOut: 120,
    };

    handleJson(memberAPI.usersJson, 'name', userObj, resolve);
  });
};

/**
 * @export
 * @async
 * @param {*} newUser
 */
export const addUser = async (newUser) => {
  //const numOfUsers = await User.count({})
  //const user = new User({...newUser, id: numOfUsers+1});

  const users = await getAllUsers();

  const exists = users.find(user => user.userName === newUser.userName);
  
  if (exists) {
    return console.warn('User name already exists');
  }

  const user = new Users({
    userName: newUser.userName,
    password: newUser.password,
  });
  //const user = new Users(newUser); //{...newUser, id: numOfUsers+1});

  await user.save((err) => {
    if (err) {
      return console.error(err);
    }

    console.info("Added successfully");
    //console.info(user._id);
    addUserFile(user._id, newUser)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const updateUser = (id, userToUpdate) => {
  return new Promise((resolve, reject) => {
    Users.findByIdAndUpdate(id, userToUpdate, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Updated successfully");
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

// module.exports = {
//   getAllUsers,
//   getUserById,
//   addUser,
//   updateUser,
//   deleteUser
// }
