import Users from "../models/user.model";
import { getAll } from "../services/axios";
import { userAPI } from "./../services/config/user.config";

const assert = require("assert");

/**
 * @async
 * @private
 */
async function _getAll() {
  const response = await getAll(userAPI.baseUrl);

  if (response.status === 200) {
    return response.data;
  } else {
    console.log("Error!");
  }
}

/**
 * @export
 */
export const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    Users.find({}, async (err, users) => {
      if (err) reject(err);

      if (!users.length) {
        users = await _getAll()
          .then((data) => {
            Users.collection.insertMany(
              data.map((item) => ({
                name: item?.name,
                email: item?.email,
                city: item?.address?.city,
                role: item?.role || "Member",
              })),
              (err, docs) => {
                assert.equal(null, err);
                assert.equal(data.length, docs.insertedCount);
              }
            );
          })
          .catch((err) => console.log(err));
      }

      resolve(users);
    });
  });
};
