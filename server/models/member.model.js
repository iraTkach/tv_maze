import { Schema, model } from "mongoose";

// 'Schema' maps to a mongoDB collection and defines the shape of the documents within that collection.
// 'Schema' is the blueprint of the documents.

const memberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: false },
});

// 'model' is a class which we construct document in a collection
export default model("members", memberSchema);

// The first argument is the singular name of the collection that will be created for the model:
// mongoose will create the database collection for the model car.

// The second argument is the Schema to use in creating the model.
