import { Types } from "mongoose";
import Subscription from "../models/subscription.model";
import Member from "../models/member.model";

/**
 * @export
 * @param {string} id
 */
 export const getUserSubscriptions = async (id) => {
  return new Promise((resolve, reject) => {
    Subscription.find(
      { memberId: new Types.ObjectId(id) },
      async (err, subscriptions) => {
        if (err) return reject(err);
        resolve(subscriptions);
      }
    );
  });
};

/**
 * @export
 * @param {string} id
 */
 export const getMovieSubscriptions = async (id) => {
  return new Promise((resolve, reject) => {
    Subscription.find(
      { movieId: new Types.ObjectId(id) },
      async (err, subscriptions) => {
        if (err) return reject(err);
        resolve(subscriptions);
      }
    );
  });
};

export const addUserSubscription = (id, subscription) => {
  return new Promise((resolve, reject) => {
    Member.findOne({ _id: id }, async (err, _user) => {
      if (err) {
        return reject(err);
      }

      if (_user) {
        const subs = new Subscription({
          memberId: id,
          movieId: subscription.movieId,
          subscribedAt: subscription.subscribedAt,
        });

        await subs.save((err) => {
          if (err) {
            return console.error(err);
          }

          console.info("Added successfully", subs);
        });

        const res = [
          ...(await getUserSubscriptions(id)),
          {
            _id: subs._id,
            memberId: id,
            movieId: subscription.movieId,
            subscribedAt: subscription.subscribedAt,
          },
        ]

        resolve(res);
      } else {
        reject({ error: "Unable to add user subscription." });
      }
    });
  });
};

/**
 * @export
 * @async
 * @param {*} id
 */
 export const deleteSubscription = (id) => {
  return new Promise((resolve, reject) => {
    Subscription.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};