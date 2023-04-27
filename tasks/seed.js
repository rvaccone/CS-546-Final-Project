// This is for testing/seeding.
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as users_functions from "../data/users.js";
import * as games_functions from "../data/games.js";
import * as games_members_functions from "../data/gameMembers.js";
import * as courts_functions from "../data/courts.js";
import * as court_rev_functions from "../data/courtReviews.js";
import { getRounds } from "bcrypt";
import { ConnectionCheckOutStartedEvent } from "mongodb";
const db = await dbConnection();
// await db.dropDatabase();

let user1;
let user2;
let user3;
let user4;
let user5;
let user6;
/* ------------------- USERS ------------------- */
try {
  // Creates a user.
  user1 = await users_functions.create(
    "John",
    "Doe",
    "johndoe@gmail.com",
    "Password1$",
    20,
    "KX5Y0eBIdiVOg7EW2AF7RZEgpcRSjFUtgIk2qypGN0dRZGHgVSJUeH5b7rLPZ5OLKTaeM0GcS6NtzgAC4ZP9TCFAT3eSWgDJR1Ca1QVSoYX7W50vAPCJd0aAEvWs9Wc3Vbqd32M3pkXdzbIg7UKDKw8JP9jAS8oqywI0CvUSOlkrrVer5K8fEVGnqJWMAbc7Ra5bGShASldPufIk9xmbneproIElyZiaaGpWpnJCfLwbS21QEbJ4ciHue1L5cp0huH2VFR9bBmUrmeDX7qr1U9PtW538gRKUTP6arcVYwemeiPp3uT1kV69KnPjxmchFpZ0AvghTiaQqzHCqIDuYQmZ8Ljz8PRPjJS5FwjHKdjjjy7aix5NJLbah7ZloZBnjzjNApf2btd42VOVISN1Dm3rVLProUXQcXDnm22D7nl46kYnHERmP5ksNuqY9TWEG0igDGPgzahxFa2S4Y3AEsJwLX0FkjBnpKl22LGRnXzzTKyVnTKHs",
    "https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png"
  );
} catch (e) {
  console.log(e);
}
try {
  // Creates a user.
  user6 = await users_functions.create(
    "John",
    "Doe",
    "johndoe@gmail.com",
    "Password1$",
    20,
    "This is John's bio",
    "https://example.com/john.jpg"
  );
  console.log("Created user John Doe");
} catch (e) {
  console.log(e);
}

try {
  // Creates a user.
  user5 = await users_functions.create(
    "Jane",
    "Doe",
    "janedoe@gmail.com",
    "Password2$",
    25,
    "This is Jane's bio",
    "https://example.com/jane.jpg"
  );
  console.log("Created user Jane Doe");
} catch (e) {
  console.log(e);
}
try {
  // Creates a user.
  user2 = await users_functions.create(
    "Another",
    "Person",
    "johndoe345@gmail.com",
    "Password1$",
    21,
    "This is my bio.",
    "https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png"
  );
} catch (e) {
  console.log(e);
}

try {
  // Creates a user.
  user3 = await users_functions.create(
    "Jane",
    "Doe",
    "johndoe211@gmail.com",
    "Password1$",
    20,
    "Hello, my name is Jane Doe.",
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin.jpg"
  );
} catch (e) {
  console.log(e);
}

try {
  // Creates a user.
  user4 = await users_functions.create(
    "Sai",
    "Bandla",
    "saipranav789@gmail.com",
    "Password1789$",
    20,
    "Hello, my name is sai and I can't dunk.",
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin.jpg"
  );
} catch (e) {
  console.log(e);
}

try {
  let allUsers = await users_functions.getAll();
  console.log(allUsers);
} catch (e) {
  console.log(e);
}

// try {
//   // Removes a user.
//   const removal = await users_functions.remove(user3._id);
//   console.log(removal);
// } catch (e) {
//   console.log(e);
// }

try {
  // Renames user
  const rename_user = await users_functions.update(
    user1._id,
    "Jack",
    "Harrington",
    "johndoe@gmail.com",
    "Password1$",
    20,
    "KX5Y0eBIdiVOg7EW2AF7RZEgpcRSjFUtgIk2qypGN0dRZGHgVSJUeH5b7rLPZ5OLKTaeM0GcS6NtzgAC4ZP9TCFAT3eSWgDJR1Ca1QVSoYX7W50vAPCJd0aAEvWs9Wc3Vbqd32M3pkXdzbIg7UKDKw8JP9jAS8oqywI0CvUSOlkrrVer5K8fEVGnqJWMAbc7Ra5bGShASldPufIk9xmbneproIElyZiaaGpWpnJCfLwbS21QEbJ4ciHue1L5cp0huH2VFR9bBmUrmeDX7qr1U9PtW538gRKUTP6arcVYwemeiPp3uT1kV69KnPjxmchFpZ0AvghTiaQqzHCqIDuYQmZ8Ljz8PRPjJS5FwjHKdjjjy7aix5NJLbah7ZloZBnjzjNApf2btd42VOVISN1Dm3rVLProUXQcXDnm22D7nl46kYnHERmP5ksNuqY9TWEG0igDGPgzahxFa2S4Y3AEsJwLX0FkjBnpKl22LGRnXzzTKyVnTKHs",
    "https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png"
  );
  console.log(rename_user);
} catch (e) {
  console.log(e);
}

/* ---------------------- Courts ---------------------- */
// Create two courts to be used later
let court1 = null;
let court2 = null;

// Printing out a spacer for readability
console.log("-".repeat(20) + " Courts " + "-".repeat(20));

// Create the first court
console.log("Creating the first court");
try {
  court1 = await courts_functions.create(
    "court1",
    "122 Bloomfield Ave",
    4,
    false,
    10,
    33
  );
} catch (e) {
  console.log(e);
}

// Create the second court
console.log("Creating the second court");
try {
  court2 = await courts_functions.create(
    "court2",
    "122 Bloomfield Ave",
    2,
    true,
    -10,
    -33
  );
} catch (e) {
  console.log(e);
}

// Get all the courts
console.log("Get all the courts for the first time");
try {
  let allCourts = await courts_functions.getAll();
  console.log(allCourts);
} catch (e) {
  console.log(e);
}
console.log("Done getting all courts");

// Get the first court
console.log("Get the first court");
try {
  let court = await courts_functions.get(court1._id.toString());
  console.log(court);
} catch (e) {
  console.log(e);
}

// Remove the first court
console.log("Remove the first court");
try {
  let removeCourt = await courts_functions.remove(court1._id.toString());
  console.log(removeCourt);
} catch (e) {
  console.log(e);
}

// Get all the courts again
console.log("Get all the courts for the second time");
try {
  let allCourts = await courts_functions.getAll();
  console.log(allCourts);
} catch (e) {
  console.log(e);
}
console.log("Done getting all courts");

// Update the second court
console.log("Update the second court");
try {
  let updateCourt = await courts_functions.update(
    court2._id.toString(),
    "court3",
    "55 Bloom Ave",
    3,
    false,
    -15,
    -35
  );
  console.log(updateCourt);
} catch (e) {
  console.log(e);
}

// Get all the courts one last time
console.log("Get all the courts for the third time");
try {
  let allCourts = await courts_functions.getAll();
  console.log(allCourts);
} catch (e) {
  console.log(e);
}
console.log("Done getting all courts");

console.log("Done seeding database");
//====pranavs court review functions testing=====//
console.log(
  "creating reviews in the courts inorder to do that i first create 2 courts"
);
let rev_court1 = null;
let rev_court2 = null;
try {
  console.log("review testing court 1");
  rev_court1 = await courts_functions.create(
    "court for review 1",
    "12 webster Ave",
    4,
    false,
    10,
    36
  );
} catch (e) {
  console.log(e);
}

try {
  console.log("review testing court 2");
  rev_court2 = await courts_functions.create(
    "court for review 2",
    "167 field Ave",
    4,
    false,
    10,
    30
  );
} catch (e) {
  console.log(e);
}

try {
  let allCourts = await courts_functions.getAll();
  console.log(allCourts);
} catch (e) {
  console.log(e);
}
console.log("Done getting all courts");

console.log("now adding reviews to the courts");
console.log(rev_court1._id);
try {
  let review1 = await court_rev_functions.create(
    rev_court1._id.toString(),
    "sai bandla",
    4,
    "its a damn good court"
  );
  console.log(review1);
} catch (e) {
  console.log(e);
}
let review2 = null;
try {
  review2 = await court_rev_functions.create(
    rev_court1._id.toString(),
    "jack",
    3.5,
    "its was nice but nets need to be fixed to the hoops"
  );
  console.log(review2);
} catch (e) {
  console.log(e);
}

// testing get all reviews function
console.log("+===============================================+");
try {
  let all_rev = await court_rev_functions.getAll(rev_court1._id.toString());
  console.log(all_rev);
} catch (e) {
  console.log(e);
}
//testing get review by id
console.log("+===============================================+");
try {
  let rev = await court_rev_functions.get(review2.reviews[1]._id.toString());
  console.log(rev);
} catch (e) {
  console.log(e);
}
// testing updating a review function
console.log("+===============================================+");
try {
  let updated_rev = await court_rev_functions.update(
    review2.reviews[1]._id.toString(),
    "Sam",
    5,
    "Amazing court!!!"
  );
  console.log(updated_rev);
} catch (e) {
  console.log(e);
}
//testing deletion of a review
console.log("+===============================================+");
try {
  let updated_rev = await court_rev_functions.remove(
    review2.reviews[1]._id.toString()
  );
  console.log(updated_rev, "is gone");
} catch (e) {
  console.log(e);
}
console.log("+===============================================+");
//creating a court for game
let game_court1 = null;
try {
  game_court1 = await courts_functions.create(
    "court to host game",
    "122 Bloomfield Ave",
    4,
    false,
    10,
    33
  );
  console.log("court is created now creating game");
} catch (e) {
  console.log(e);
}

let game_court2 = null;
try {
  game_court2 = await courts_functions.create(
    "court to host game2",
    "124 Webster Ave",
    4,
    false,
    10,
    33
  );
  console.log("court is created for testing now creating game");
} catch (e) {
  console.log(e);
}
/* ---------------------- GAMES ---------------------- */
let game3 = null;
let game1 = null;
let game2 = null;
try {
  game1 = await games_functions.create(
    game_court1._id.toString(),
    "06/13/2023",
    "10:00 AM",
    10
  );
  console.log("game 1 created");
} catch (e) {
  console.log(e);
}

try {
  game2 = await games_functions.create(
    game_court1._id.toString(),
    "06/13/2023",
    "11:00 PM",
    10
  );
  console.log("game 2 created");
} catch (e) {
  console.log(e);
}

try {
  game3 = await games_functions.create(
    game_court1._id.toString(),
    "06/13/2023",
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
    game_court1._id.toString(),
    "06/13/2023",
    "10:00 AM",
    10
  );
  console.log("game 4 created");
} catch (e) {
  console.log(e);
}
let game5 = null;
try {
  game5 = await games_functions.create(
    game_court2._id.toString(),
    "06/13/2023",
    "10:00 AM",
    10
  );
  console.log("game 5 created");
} catch (e) {
  console.log(e);
}

//adding a member to a game
let game_w_member = null;
try {
  game_w_member = await games_members_functions.create(
    game1._id.toString(),
    user1._id
  );
  console.log("created member in game");
} catch (e) {
  console.log(e);
}

let game_w_member2 = null;
try {
  game_w_member2 = await games_members_functions.create(
    game5._id.toString(),
    user1._id
  );
  console.log("created member in game");
} catch (e) {
  console.log(e);
}
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
console.log("I am trying to add the same player to the same game to see error");
try {
  game_w_member = await games_members_functions.create(
    game1._id.toString(),
    user1._id
  );
  console.log("created member in game");
} catch (e) {
  console.log(e);
}

let game_w_member3 = null;
try {
  game_w_member3 = await games_members_functions.create(
    game1._id.toString(),
    user2._id
  );
  console.log("created member in game");
} catch (e) {
  console.log(e);
}

let game_w_member4 = null;
try {
  game_w_member4 = await games_members_functions.create(
    game1._id.toString(),
    user3._id
  );
  console.log("created member in game");
} catch (e) {
  console.log(e);
}
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
try {
  let allGames = await games_functions.getAll(game_court1._id);
  console.log(allGames);
} catch (e) {
  console.log(e);
}

//testing get and removing game member function:

console.log("*********TESTING GET AND REMOVE GAMEMEMBERS ***************");
let getGM = null;
let getGM2 = null;
console.log(`game id: ${game1._id}`);
try {
  getGM = await games_members_functions.get(user3._id, game1._id.toString());
  console.log("got 1st member in game1");
  console.log(getGM);
} catch (e) {
  console.log(e);
}

try {
  getGM2 = await games_members_functions.get(user2._id, game1._id.toString());
  console.log("got 2nd member in game1");
  console.log(getGM2);
} catch (e) {
  console.log(e);
}

try {
  getGM2 = await games_members_functions.remove(
    user2._id,
    game1._id.toString()
  );
  console.log("removing 2nd member in game1");
  console.log(getGM2);
} catch (e) {
  console.log(e);
}

//creating a game in the past

let past_game = null;
try {
  past_game = await games_functions.create(
    game_court2._id.toString(),
    "02/13/2023",
    "10:00 AM",
    10
  );
  console.log("game in past created");
  console.log(past_game);
} catch (e) {
  console.log(e);
}

//testing delete all past games
try {
  past_game = await games_functions.removeAllPastGames();
  console.log("removing past games");
  console.log(past_game);
} catch (e) {
  console.log(e);
}
//TO TEST LATER
// try {
//   let removedList = await games_functions.removeAllPastGames();
//   console.log(removedList);
// } catch (e) {
//   console.log(e);
// }

// removing game
// try {
//   let removeGame = await games_functions.remove(game1._id);
//   console.log(removeGame);
//   console.log("removed game successfully");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let gameMember1 = await games_members_functions.create(
//     game2._id,
//     user1._id,
//     user1.firstName,
//     user1.lastName
//   );
//   console.log(gameMember1);
// } catch (e) {
//   console.log(e);
// }

// try {
//   let allMembers = await games_members_functions.getAll(game2._id);
//   console.log(allMembers);
// } catch (e) {
//   console.log(e);
// }

await closeConnection();
