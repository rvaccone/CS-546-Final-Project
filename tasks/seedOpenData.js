import fs from "fs";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as users_functions from "../data/users.js";
import * as games_functions from "../data/games.js";
import * as games_members_functions from "../data/gameMembers.js";
import * as courts_functions from "../data/courts.js";
import * as court_rev_functions from "../data/courtReviews.js";
import { courts } from "../config/mongoCollections.js";

// Read the data from the JSON file
const data = fs.readFileSync("tasks/DPR_Basketball_001.json");
const courtOpenData = JSON.parse(data);

// Iterate over the courts and insert them into the database
const insertCourts = async () => {
  for (const court of courtOpenData) {
    // console.log(court);
    let numOfCourts = 1;
    // if (
    //   court.Num_of_Courts !== null ||
    //   typeof court.Num_of_Courts === "number"
    // ) {
    //   numOfCourts = court.Num_of_Courts;
    // }
    try {
      await courts_functions.create(
        court.Name,
        court.Location,
        numOfCourts,
        court.Accessible === "Y",
        parseFloat(court.lat),
        parseFloat(court.lon)
      );
      console.log(`Court ${court.Name} inserted successfully.`);
    } catch (err) {
      console.error(`Error inserting court ${court.Name}: ${err}`);
    }
  }
};
const db = await dbConnection();
await db.dropDatabase();
await insertCourts();
await closeConnection();
