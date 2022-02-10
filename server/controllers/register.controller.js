import Users from "../models/user.model";
import { getUserJson } from "./users.controller";

export const register = async (user) => {
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
          resolve({
            name: userJson.name,
            username: _user.userName,
            isSignedIn: true,
          });
        } else {
          reject("Invalid authentication credentials");
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
