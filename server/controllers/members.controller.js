import Member from "../models/member.model";
import { getAll } from "../services/axios";
import { memberAPI } from "../services/config/user.config";

const assert = require("assert");

/**
 * @async
 * @private
 */
async function _getAll() {
  const response = await getAll(memberAPI.baseUrl);

  if (response.status === 200) {
    return response.data;
  } else {
    console.log("Error!");
  }
}

/**
 * @export
 * @async
 */
export const setAllMembers = async () => {
  const members = await getAllMembers();
  !members.length &&
    _getAll()
      .then((data) => {
        console.log(`>>> Massive insert of: ${data.length} members`);
        Member.collection.insertMany(
          data.map((item) => ({
            name: item?.name,
            email: item?.email,
            city: item?.address?.city,
            //role: item?.role || "Member",
          })),
          (err, docs) => {
            assert.equal(null, err);
            assert.equal(data.length, docs.insertedCount);
          }
        );
      })
      .catch((err) => console.log(err));
};

/**
 * @export
 */
export const getAllMembers = async () => {
  return new Promise((resolve, reject) => {
    Member.find({}, async (err, members) => {
      if (err) reject(err);
      resolve(members);
    });
  });
};
/**
 * @export
 * @async
 * @param {*} id
 *
 */
export const getMemberById = (id) => {
  return new Promise((resolve, reject) => {
    Member.findById(id, (err, members) => {
      if (err) {
        reject(err);
      } else {
        resolve(members);
      }
    });
  });
};

/**
 * @export
 * @async
 * @param {*} vewMember
 */
export const addMember = async (newMember) => {
  return new Promise(async (resolve, reject) => {
    const member = new Member(newMember);
    await member.save((err) => {
      if (err) {
        console.warn(err);
        reject(err);
      } else {
        console.info("Added successfully");
      }
    });

    const res = [
      ...(await getAllMembers()),
      {
        _id: member._id,
        ...newMember,
      },
    ];

    resolve(res);
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const updateMember = (id, memberToUpdate) => {
  return new Promise((resolve, reject) => {
    Member.findByIdAndUpdate(id, memberToUpdate, (err) => {
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
export const deleteMember = (id) => {
  return new Promise((resolve, reject) => {
    Member.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};
