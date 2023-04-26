import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

// Creates a new court and logs it in the courts collection.
const create = async (name, location, numCourts, accessible, lat, long) => {
  // Validate the inputs
  name = validation.checkString(name, "name");
  location = validation.checkString(location, "location");
  numCourts = validation.checkNumber(numCourts, "numCourts");
  accessible = validation.checkBoolean(accessible, "accessible");
  lat = validation.checkNumber(lat, "lat");
  long = validation.checkNumber(long, "long");

  // Create the court object to be inserted
  let newCourt = {
    name,
    location,
    numCourts,
    accessible,
    lat,
    long,
    reviews: [],
    overallRating: 0,
  };

  // Retrieve the courts collection
  const courtCollection = await courts();

  // Insert the court into the courts collection
  const insertInfo = await courtCollection.insertOne(newCourt);

  // Checking if the insert was successful
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not add court";

  // Return the new court
  return await get(insertInfo.insertedId.toString());
};

// Gets all courts from the courts collection.
const getAll = async () => {
  // Retrieve the courts collection
  const courtCollection = await courts();

  // Create an empty array to hold the courts
  const courtList = await courtCollection.find({}).toArray();

  // Return the court list
  return courtList;
};

// Gets a court by its id.
const get = async (courtID) => {
  // Validate the inputs
  courtID = validation.checkID(courtID, "courtID");

  // Retrieve the courts collection
  const courtCollection = await courts();

  // Find the court that has the same id as courtID
  const court = await courtCollection.findOne({ _id: new ObjectId(courtID) });

  // Check if the court exists
  if (!court) throw "Error: Could not get court";

  // Return the court
  return court;
};

// Updates a court by its id.
const update = async (
  courtID,
  name,
  location,
  numCourts,
  accessible,
  lat,
  long
) => {
  // Validate the inputs
  courtID = validation.checkID(courtID, "courtID");
  name = validation.checkString(name, "name");
  location = validation.checkString(location, "location");
  numCourts = validation.checkNumber(numCourts, "numCourts");
  accessible = validation.checkBoolean(accessible, "accessible");
  lat = validation.checkNumber(lat, "lat");
  long = validation.checkNumber(long, "long");

  // Retrieve the courts collection
  const courtCollection = await courts();

  // Find the court that has the same id as courtID
  const court = await get(courtID);

  // // Create the court object to replace the old one
  let updatedCourt = {
    name,
    location,
    numCourts,
    accessible,
    lat,
    long,
    reviews: court.reviews,
    overallRating: court.overallRating,
  };

  // Update the court
  const updateInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(courtID) },
    { $set: updatedCourt },
    { returnDocument: "after" }
  );

  // Check if the update was successful
  if (updateInfo.lastErrorObject.n === 0)
    throw `Could not update court with id ${courtID.toSring()}`;

  // Return the updated court
  return await updateInfo.value;
};

// Removes a court by its id.
const remove = async (courtID) => {
  // Validate the inputs
  courtID = validation.checkID(courtID, "courtID");

  // Retrieve the courts collection
  const courtCollection = await courts();

  // Delete the court
  const deleteInfo = await courtCollection.findOneAndDelete({
    _id: new ObjectId(courtID),
  });

  // Check if the delete was successful
  if (deleteInfo.lastErrorObject.n === 0)
    throw `Could not delete court with id ${courtID.toSring()}`;

  // Return the deleted court
  return { ...deleteInfo.value, deleted: true };
};

const getCourtsByName = async (courtName) => {
  courtName = validation.checkString(courtName, "courtName");
  const courtCollection = await courts();

  // find all courts with a name that matches the search query
  const query = { name: { $regex: new RegExp(courtName, "i") } };
  const courtSearched = await courtCollection.find(query).toArray();

  // check if any courts were found
  if (!courtSearched || courtSearched.length === 0)
    throw `Could not find courts for search term: ${courtName}`;

  return courtSearched;
};

export { create, getAll, get, update, remove, getCourtsByName };
