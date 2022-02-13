import Users from "../models/user.model";
import { getUserJson, getUsersJson, getUserPermsJson } from "./users.controller";
import { updateJson } from "./../services/utils";
import { memberAPI } from './../services/config/user.config';

export const login = async (user) => {
  return new Promise((resolve, reject) => {
    const { username, password } = user;

    Users.findOneAndUpdate(
      {
        userName: username,
        password,
      },
      {
        $set: {
          isSignedIn: true,
          signInAt: new Date(),
        },
      },
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
            subscriptions: _user.subscriptions
          });
        } else {
          reject({ error: "Invalid authentication credentials" });
        }
      }
    );
  });
};

export const logout = async (user) => {
  return new Promise((resolve, reject) => {
    const { username } = user;

    Users.findOneAndUpdate(
      {
        userName: username,
        isSignedIn: true,
      },
      {
        $set: {
          isSignedIn: false,
          signOutAt: new Date(),
        },
      },
      async (err, _user) => {
        if (err) {
          return reject(err);
        }

        if (_user) {
          resolve({ isSignedIn: false });
        } else {
          reject("No user credentials found");
        }
      }
    );
  });
};

export const register = async (user) => {
  return new Promise((resolve, reject) => {
    const { username, password, name } = user;
    Users.findOneAndUpdate(
      {
        userName: username,
      },
      {
        $set: {
          password,
          isSignedIn: false
        },
      },
      async (err, _user) => {
        if (err) {
          return reject(err);
        }

        if (_user) {
          const usersJson = await getUsersJson();

          await updateJson(
            memberAPI.usersJson,
            { name },
            _user._id.toString(),
            usersJson
          );

          resolve({
            name,
            username: _user.userName,
            isSignedIn: false,
          });

        } else {
          reject({error: "Unable to register user"});
        }
      }
    );
  });
};
