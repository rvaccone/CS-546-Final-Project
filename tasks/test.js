import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as users_functions from "../data/users.js";
import * as games_functions from "../data/games.js";
import * as games_members_functions from "../data/gameMembers.js";
import * as courts_functions from "../data/courts.js";
import * as court_rev_functions from "../data/courtReviews.js";
import { compareSync } from "bcrypt";

// Connect to the database
const db = await dbConnection();
// let court_id = "6443defc36db0666d72e9e42";
// let user_id = "6448d870a99c1b67a0324ec5";
// let g1 = null;
// try {
//   g1 = await games_functions.create(
//     court_id,
//     user_id,
//     "04/27/2023",
//     "10:00 PM",
//     10
//   );
//   console.log("game created");
// } catch (e) {
//   console.log(e);
// }
// let g2;
// try {
//   g2 = await games_functions.create(
//     court_id,
//     user_id,
//     "04/27/2023",
//     "11:30 PM",
//     10
//   );
//   console.log("game created 2");
// } catch (e) {
//   console.log(e);
// }
// let g3;
// let g4;
// try {
//   g3 = await games_functions.create(
//     "6443defc36db0666d72e9e43",
//     user_id,
//     "04/27/2023",
//     "11:50 PM",
//     10
//   );
//   g4 = await games_functions.create(
//     "6443defc36db0666d72e9e43",
//     user_id,
//     "04/27/2023",
//     "10:50 PM",
//     10
//   );
// } catch (e) {
//   console.log(e);
// }
// let trend = null;
// try {
//   trend = await games_functions.getAllTrending();
//   console.log(trend);
// } catch (e) {
//   console.log(e);
// }
// console.log("++++++++++++++++++++++");
// let getAllforCourt = null;
// try {
//   getAllforCourt = await games_functions.getAll(court_id);
//   console.log(getAllforCourt);
// } catch (e) {
//   console.log(e);
// }
// let search;
// try {
//   search = await courts_functions.getCourtsByName("Park");
//   console.log(search);
// } catch (e) {
//   console.log(e);
// }

//testing remove game member
let removed;
try {
  removed = await games_functions.removeAllPastGames();
} catch (error) {
  console.log(error);
}
// try {
//   removed = await games_members_functions.remove(
//     "644d3dc123216c70b7bd3372",
//     "644d3d8a23216c70b7bd3371"
//   );
//   console.log(removed);
// } catch (error) {
//   console.log(error);
// }

await closeConnection();
