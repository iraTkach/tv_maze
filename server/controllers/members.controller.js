import Members from "../models/member.model";
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
        Members.collection.insertMany(
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
    Members.find({}, async (err, members) => {
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
    Members.findById(id, (err, members) => {
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
  // const members = await getAllMembers();
  // const exists = members.find(member => member.name === newUser.name);
  
  // if (!exists) {
  //   return console.warn("User doesn't exist");
  // }
  // await updateMember(newMember.id, {...newMember, name: newMember.name})
  const member = new Members(newMember); 
  await member.save((err) => {
    if (err) {
      console.warn(err);
    } else {
      console.info("Added successfully");
    }
  });
}

/**
 * @export
 * @async
 * @param {*} id
 */
  export const updateMember = (id, memberToUpdate) => {
    return new Promise((resolve, reject) => {
      Members.findByIdAndUpdate(id, memberToUpdate, (err) => {
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
      Members.findByIdAndDelete(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Deleted successfully");
        }
      });
    });
  };
