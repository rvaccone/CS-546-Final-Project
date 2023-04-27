import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as users_functions from "../data/users.js";
import * as games_functions from "../data/games.js";
import * as games_members_functions from "../data/gameMembers.js";
import * as courts_functions from "../data/courts.js";
import * as court_rev_functions from "../data/courtReviews.js";

const db = await dbConnection();
// await db.dropDatabase();
//courts for trending game testing
let court1;
let court2;
try {
  court1 = await courts_functions.create(
    "court 1 for trending game",
    "122 Bloomfield Ave",
    4,
    false,
    10,
    33
  );
} catch (e) {
  console.log(e);
}

try {
  court2 = await courts_functions.create(
    "court 2 for trending game",
    "90 field Ave",
    4,
    false,
    10,
    33
  );
} catch (e) {
  console.log(e);
}

let game3 = null;
let game1 = null;
let game2 = null;
try {
  game1 = await games_functions.create(
    court1._id.toString(),
    "04/26/2023",
    "10:00 PM",
    10
  );
  console.log("game 1 created");
} catch (e) {
  console.log(e);
}
try {
  game2 = await games_functions.create(
    court1._id.toString(),
    "04/26/2023",
    "11:00 PM",
    10
  );
  console.log("game 2 created");
} catch (e) {
  console.log(e);
}

try {
  game3 = await games_functions.create(
    court1._id.toString(),
    "04/26/2023",
    "10:00 PM",
    10
  );
  console.log("game 3 created");
} catch (e) {
  console.log(e);
}
let game4 = null;
try {
  game4 = await games_functions.create(
    court1._id.toString(),
    "04/26/2023",
    "9:00 PM",
    10
  );
  console.log("game 4 created");
} catch (e) {
  console.log(e);
}

try {
  let gamelist = await games_functions.getAllTrending();
  console.log("trending games");
  console.log(gamelist);
} catch (e) {
  console.log(e);
}
await closeConnection();
