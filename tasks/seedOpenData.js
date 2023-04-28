import fs from "fs";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as courts_functions from "../data/courts.js";
import { courts } from "../config/mongoCollections.js";
const db = await dbConnection();

const data = fs.readFileSync("tasks/DPR_Basketball_001.json");
const courtOpenData = JSON.parse(data);

const courtIds = [];

// Loop through each object in the dataset and create a new court for each one
for (const court of courtOpenData) {
    let numOfCourts = 1;
  try {
    // Create a new court in the database using the data from the current object
    const insertCourts = await courts_functions.create(
        court.Name,
        court.Location,
        numOfCourts,
        court.Accessible === "Y",
        parseFloat(court.lat),
        parseFloat(court.lon)
    );
    console.log(`Created new court with ID ${insertCourts._id}`);
    courtIds.push(insertCourts._id);
  } catch (err) {
    console.log(`Error creating court "${court.Name}": ${err}`);
  }
  
}

//await db.dropDatabase();
await closeConnection();
export {courtIds};