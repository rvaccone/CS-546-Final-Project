// This is for testing/seeding.
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as users_functions from "../data/users.js";
import * as games_functions from "../data/games.js";
import * as games_members_functions from "../data/gameMembers.js";
import * as courts_functions from "../data/courts.js";
import * as court_rev_functions from "../data/courtReviews.js";

// Connect to the database
const db = await dbConnection();

// Clear the database
// await db.dropDatabase();

/* ------------------- USERS ------------------- */
console.log("/* ------------------- USERS ------------------- */");

// Creating a list of users
let user1 = null,
  user2 = null,
  user3 = null,
  user4 = null; // user4 will be deleted later

// Create the first user
console.log("Creating user 1 with user 1");
try {
  user1 = await users_functions.create(
    "John",
    "Doe",
    "jdoe@gmail.com",
    "Password1$",
    20,
    "Likes long walks on the beach",
    "https://www.patrickhill.nyc/images/logo.jpg"
  );
  console.log(user1);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the second user
console.log("Creating user 2");
try {
  user2 = await users_functions.create(
    "Kevin",
    "Smith",
    "ksmith@gmail.com",
    "Password1$Password1$",
    32,
    "Spikeball fanatic",
    "https://www.patrickhill.nyc/images/logo.jpg"
  );
  console.log(user2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the third user
console.log("Creating user 3");
try {
  user3 = await users_functions.create(
    "Patrick",
    "Hill",
    "iinfo@graffixnyc.com",
    "iNsan3PAss&",
    25,
    "Cool guy",
    "https://www.patrickhill.nyc/images/logo.jpg"
  );
  console.log(user3);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the fourth user
console.log("Creating user 4");
try {
  user4 = await users_functions.create(
    "Delete",
    "Me",
    "deleteme@gmail.com",
    "d3l3teM&",
    50,
    "uncool guy",
    "https://www.patrickhill.nyc/images/logo.jpg"
  );
  console.log(user4);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the first user
console.log("Getting user 1");
try {
  console.log(await users_functions.get(user1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users
console.log("Getting all users");
try {
  console.log(await users_functions.getAll());
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Update the second user
console.log("Updating user 2");
try {
  console.log(
    await users_functions.update(
      user2._id.toString(),
      "Clark",
      "Kent",
      user2.email,
      "Password1$Password1$",
      user2.age,
      user2.bio,
      user2.imgLink
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the second user
console.log("Getting user 2");
try {
  console.log(await users_functions.get(user2._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Delete the last user
console.log("Deleting user 4");
try {
  console.log(await users_functions.remove(user4._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users
console.log("Getting all users");
try {
  console.log(await users_functions.getAll());
} catch (e) {
  console.log(e);
}

/* ------------------- COURTS ------------------- */
console.log("/* ------------------- COURTS ------------------- */");

// Creating a list of users
let court1 = null,
  court2 = null,
  court3 = null,
  court4 = null; // court4 will be deleted later

// Create the first court
console.log("Creating court 1");
try {
  court1 = await courts_functions.create(
    "Court 1",
    "123 Main St",
    10,
    false,
    33,
    -33
  );
  console.log(court1);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the second court
console.log("Creating court 2");
try {
  court2 = await courts_functions.create(
    "Court 2",
    "30 5th Ave",
    8,
    true,
    -33,
    33
  );
  console.log(court2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the third court
console.log("Creating court 3");
try {
  court3 = await courts_functions.create(
    "Court 3",
    "100 Bloomfield Ave",
    3,
    true,
    -10,
    -15
  );
  console.log(court3);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the fourth court
console.log("Creating court 4");
try {
  court4 = await courts_functions.create(
    "Court 4",
    "23 7th St",
    3,
    false,
    73,
    20
  );
  console.log(court4);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the first court
console.log("Getting court 1");
try {
  console.log(await courts_functions.get(court1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all courts
console.log("Getting all courts");
try {
  console.log(await courts_functions.getAll());
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Update the second court
console.log("Updating court 2");
try {
  console.log(
    await courts_functions.update(
      court2._id.toString(),
      "Court 2.0",
      "30 5th Ave",
      13,
      true,
      -33,
      33
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the second court
console.log("Getting court 2");
try {
  console.log(await courts_functions.get(court2._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Delete the last user
console.log("Deleting court 4");
try {
  console.log(await courts_functions.remove(court4._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users
console.log("Getting all courts");
try {
  console.log(await courts_functions.getAll());
} catch (e) {
  console.log(e);
}

/* ------------------- COURTS REVIEWS ------------------- */
console.log("/* ------------------- COURTS REVIEWS ------------------- */");

// Creating a list of reviews
let review1 = null,
  review2 = null,
  review3 = null,
  review4 = null; // review4 will be deleted later

// Create the first review
console.log("Creating review 1 on court 1 with user 1");
try {
  review1 = await court_rev_functions.create(
    court1._id.toString(),
    user1._id.toString(),
    5,
    "This is a great court!"
  );
  console.log(review1);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the second review
console.log("Creating review 2 on court 1 with user 2");
try {
  review2 = await court_rev_functions.create(
    court1._id.toString(),
    user2._id.toString(),
    1,
    "This is a bad court!"
  );
  console.log(review2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the third review
console.log("Creating review 3 on court 2 with user 1");
try {
  review3 = await court_rev_functions.create(
    court2._id.toString(),
    user1._id.toString(),
    5,
    "This court is better than court 1!"
  );
  console.log(review3);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the fourth review
console.log("Creating review 4 on court 2 with user 2");
try {
  review4 = await court_rev_functions.create(
    court2._id.toString(),
    user2._id.toString(),
    1,
    "This court is worse than court 1!"
  );
  console.log(review4);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the first review
console.log("Getting review 1");
try {
  console.log(
    await court_rev_functions.get(court1._id.toString(), user1._id.toString())
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all reviews for court1
console.log("Getting all reviews for court1");
try {
  console.log(await court_rev_functions.getAll(court1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Update the second review
console.log("Updating review 2");
try {
  review2 = await court_rev_functions.update(
    court1._id.toString(),
    user2._id.toString(),
    4,
    "This is a pretty great court!"
  );
  console.log(review2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the second review
console.log("Getting review 2");
try {
  console.log(
    await court_rev_functions.get(court1._id.toString(), user2._id.toString())
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Delete the fourth review
console.log("Deleting review 4 on court 2 with user 2");
try {
  review4 = await court_rev_functions.remove(
    court2._id.toString(),
    user2._id.toString()
  );
  console.log(review4);
} catch (e) {
  console.log(e);
}

/* ------------------- GAMES ------------------- */
console.log("/* ------------------- GAMES ------------------- */");

// Creating a list of games
let game1 = null,
  game2 = null,
  game3 = null; // game3 will be deleted later
let game4 = null;
let game5 =null

// Create the first game
console.log("Creating game 1 on court 1 with user 1");
try {
  game1 = await games_functions.create(
    court1._id.toString(),
    user1._id.toString(),
    "02/21/2024",
    "10:00 PM",
    4
  );
  console.log(game1);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the first game
console.log("Creating game 2 on court 2 with user 2");
try {
  game2 = await games_functions.create(
    court2._id.toString(),
    user2._id.toString(),
    "10/24/2023",
    "2:00 AM",
    8
  );
  console.log(game2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the third game
console.log("Creating game 3 on court 3 with user 3");
try {
  game3 = await games_functions.create(
    court3._id.toString(),
    user3._id.toString(),
    "04/30/2023",
    "8:00 AM",
    4
  );
  console.log(game3);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the forth game
console.log('Creating game 4 on court 1 with user 1');
try {
	game4 = await games_functions.create(
		court1._id.toString(),
		user1._id.toString(),
		'04/27/2023',
		'10:00 PM',
		4
	);
	console.log(game4);
} catch (e) {
	console.log(e);
}
console.log('-'.repeat(10));

// Create the five game
console.log('Creating game 5 on court 2 with user 1');
try {
	game5 = await games_functions.create(
		court2._id.toString(),
		user2._id.toString(),
		'04/27/2023',
		'11:00 PM',
		4
	);
	console.log(game5);
} catch (e) {
	console.log(e);
}
console.log('-'.repeat(10));

console.log('geting trending games')
try{
	console.log(await games_functions.getAllTrending())

}catch (e) {
	console.log(e);
}



// Using the get function for the first game
console.log("Getting game 1");
try {
  console.log(await games_functions.get(game1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users for court1
console.log("Getting all games for court1");
try {
  console.log(await games_functions.getAll(court1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Update the second game
console.log("Updating game 2");
try {
  console.log(
    await games_functions.update(
      game2._id.toString(),
      game2.courtID.toString(),
      game2.userID.toString(),
      "03/19/2020",
      "12:00 PM",
      6
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the second game
console.log("Getting game 2 for court 2");
try {
  console.log(await games_functions.get(game2._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Delete the last game
console.log("Deleting game 3");
try {
  console.log(await games_functions.remove(game3._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users
console.log("Getting all users for court 1");
try {
  console.log(await games_functions.getAll(court1._id.toString()));
} catch (e) {
  console.log(e);
}

/* ------------------- GAME MEMBERS ------------------- */
console.log("/* ------------------- GAME MEMBERS ------------------- */");

// Creating a list of gameMembers
let gameMember1 = null,
  gameMember2 = null,
  gameMember3 = null; // gameMember3 will be deleted later

// Create the first gameMember
console.log("Creating gameMember 1 on game 2 with user 1");
try {
  gameMember1 = await games_members_functions.create(
    game2._id.toString(),
    user1._id.toString()
  );
  console.log(gameMember1);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the first gameMember
console.log("Creating gameMember 2 on game 1 with user 2");
try {
  gameMember2 = await games_members_functions.create(
    game1._id.toString(),
    user2._id.toString()
  );
  console.log(gameMember2);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Create the third gameMember
console.log("Creating gameMember 3 on game 1 with user 3");
try {
  gameMember3 = await games_members_functions.create(
    game1._id.toString(),
    user3._id.toString()
  );
  console.log(gameMember3);
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the first gameMember
console.log("Getting gameMember 1");
try {
  console.log(
    await games_members_functions.get(
      user1._id.toString(),
      game1._id.toString()
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users for game 1
console.log("Getting all gameMembers for game 1");
try {
  console.log(await games_members_functions.getAll(game1._id.toString()));
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Using the get function for the second gameMember
console.log("Getting gameMember 2");
try {
  console.log(
    await games_members_functions.get(
      user2._id.toString(),
      game2._id.toString()
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Delete the last gameMember
console.log("Deleting gameMember 3");
try {
  console.log(
    await games_members_functions.remove(
      user3._id.toString(),
      game1._id.toString()
    )
  );
} catch (e) {
  console.log(e);
}
console.log("-".repeat(10));

// Getting all users for game 1
console.log("Getting all users");
try {
  console.log(await games_members_functions.getAll(game1._id.toString()));
} catch (e) {
  console.log(e);
}

// Close the connection
await closeConnection();
