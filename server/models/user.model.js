import { Schema, model } from "mongoose";

// 'Schema' maps to a mongoDB collection and defines the shape of the documents within that collection.
// 'Schema' is the blueprint of the documents.

const userSchema = new Schema({
  //id:  {type: ObjectId, required: true}, // by-default is not required(false).
  userName: { type: String, required: true },
  password: { type: String, required: true },
  isSignedIn: { type: Boolean, required: false },
  signInAt: { type: Date, required: false },
  signOutAt: { type: Date, required: false },
  isAdmin: { type: Boolean, required: false },
  subscriptions: { type: Array, required: false },
  //role: { type: String, required: true },
});

// 'model' is a class which we construct document in a collection
export default model("users", userSchema);

// The first argument is the singular name of the collection that will be created for the model:
// mongoose will create the database collection for the model car.

// The second argument is the Schema to use in creating the model.
