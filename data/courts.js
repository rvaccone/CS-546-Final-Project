import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { courtsData } from "./index.js";
import axios from "axios";

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
  if (!court) throw `Error: Could not get court with id ${courtID}`;

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

const getCourtsByName = async (courtName, longitude, latitude) => {
  courtName = validation.checkString(courtName, "courtName");
  const courtCollection = await courts();

  // find all courts with a name or location that matches the search query
  const query = {
    //todo account for escape characters

    $or: [
      { name: { $regex: new RegExp(courtName, "i") } },
      { location: { $regex: new RegExp(courtName, "i") } },
    ],
  };
  console.log(query);
  // add geospatial search based on the user's location
  if (longitude && latitude) {
    query.location = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 10000,
      },
    };
  }

  const courtSearched = await courtCollection.find(query).toArray();
  console.log(courtSearched);
  // check if any courts were found
  if (!courtSearched || courtSearched.length === 0)
    throw `Could not find courts for search term: ${courtName}`;

  return courtSearched;
};

const getCoordinatesForZipCode = async (zipCode) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search.php?postalcode=${zipCode}&country=US&format=json`
    );
    const { lat, lon } = response.data[0];
    return { latitude: lat, longitude: lon };
  } catch (error) {
    console.log(error);
  }
};

const getCourtsByZipCode = async (zipCode) => {
  console.log("inside the zipcode data function");
  // Convert the zip code to a string and validate it
  zipCode = validation.isValidNYCZipCode(zipCode, "zipcode");

  // Use the getCoordinatesForZipCode function to get the longitude and latitude coordinates for the zip code
  const { latitude, longitude } = await getCoordinatesForZipCode(zipCode);
  // Connect to the courts collection in the database
  const courtCollection = await courts();

  const nearbyCourts = await courtCollection
    .find({
      lat: { $exists: true },
      long: { $exists: true },
      $and: [
        {
          lat: {
            $gt: Number(latitude) - 0.1,
            $lt: Number(latitude) + 0.1,
          },
        },
        {
          long: {
            $gt: Number(longitude) - 0.1,
            $lt: Number(longitude) + 0.1,
          },
        },
      ],
    })
    .toArray();

  // Check if any courts were found
  if (!nearbyCourts || nearbyCourts.length === 0) {
    throw `Could not find any basketball courts near ${zipCode}`;
  }

  return nearbyCourts;
};
export {
  create,
  getAll,
  get,
  update,
  remove,
  getCourtsByName,
  getCourtsByZipCode,
};
