import models from "../models/index.js";
import db from "../config/connection.js";
import { Model } from "mongoose";

interface Models {
  [key: string]: Model<any>;
}

export default async (modelName: "Question", collectionName: string) => {
  try {
    const model = (models as Models)[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }
    let modelExists = await (model.db as any).db
      .listCollections({
        name: collectionName,
      })
      .toArray();

    if (modelExists.length) {
      await db.dropCollection(collectionName);
    }
  } catch (err) {
    throw err;
  }
};
