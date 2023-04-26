import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as courts_functions from "../data/courts.js";
import { getRounds } from "bcrypt";

const db = await dbConnection();
//await db.dropDatabase();

try {
  // searching by keyword
  let searchedCourt = await courts_functions.getCourtsByName("cla");
  console.log(searchedCourt);
} catch (e) {
  console.log(e);
}

await closeConnection();
