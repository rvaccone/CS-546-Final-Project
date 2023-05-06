// Import the database connection
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { courts } from '../config/mongoCollections.js';

// Import the data functions
import * as users_functions from '../data/users.js';
import * as games_functions from '../data/games.js';
import * as games_members_functions from '../data/gameMembers.js';
import * as courts_functions from '../data/courts.js';
import * as court_rev_functions from '../data/courtReviews.js';

// Import the file system module
import fs from 'fs';

// Parse the open data
const data = fs.readFileSync('tasks/DPR_Basketball_001.json');
const courtOpenData = JSON.parse(data);

// Connect to the database
const db = await dbConnection();

// Clear the database
await db.dropDatabase();

// Create an array to store the court ids for later use
const courtIds = [];

// Function to generate a random number equal to or between the min and max
const randomNum = (min, max, float = false) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return float
		? Math.random() * (max - min + 1) + min
		: Math.floor(Math.random() * (max - min + 1) + min);
};

// Loop through each object in the dataset and create a new court for each one
for (const court of courtOpenData) {
	// Create a new court in the database using the data from the current court object
	try {
		const insertCourts = await courts_functions.create(
			court.Name === null ? 'Unknown Name' : court.Name,
			court.Location === null ? 'Unknown Location' : court.Location,
			court.Num_of_Courts !== null ? parseInt(court.Num_of_Courts) : 1,
			court.Accessible === 'Y',
			court.lat === null ? null : parseInt(court.lat),
			court.lon === null ? null : parseInt(court.lon)
		);
		courtIds.push(insertCourts._id);
		console.log(`Created new court with ID ${insertCourts._id}`);
	} catch (err) {
		console.log(`Error creating court "${court.Name}": ${err}`);
		console.log(court);
	}
}

// Store variables for the users
let user1 = null,
	user2 = null,
	user3 = null,
	user4 = null;

// Create the users
try {
	user1 = await users_functions.create(
		'John',
		'Doe',
		'jdoe@gmail.com',
		'Password1$',
		randomNum(14, 100)
	);
	console.log(user1);
} catch (e) {
	console.log(`Error creating user 1: ${e}`);
}

try {
	user2 = await users_functions.create(
		'Kevin',
		'Smith',
		'ksmith@gmail.com',
		'Password1$Password1$',
		randomNum(14, 100)
	);
	console.log(user2);
} catch (e) {
	console.log(`Error creating user 2: ${e}`);
}

try {
	user3 = await users_functions.create(
		'Patrick',
		'Hill',
		'iinfo@graffixnyc.com',
		'iNsan3PAss&',
		randomNum(14, 100)
	);
	console.log(user3);
} catch (e) {
	console.log(`Error creating user 3: ${e}`);
}

try {
	user4 = await users_functions.create(
		'Indiana',
		'Jones',
		'deleteme@gmail.com',
		'd3l3teM&',
		randomNum(14, 100)
	);
	console.log(user4);
} catch (e) {
	console.log(`Error creating user 4: ${e}`);
}

console.log(courtIds);

// Store variables for the reviews
let review1 = null,
	review2 = null,
	review3 = null,
	review4 = null;

// List of fun responses depending on the reviews
const funResponses = [
	', HATE THIS COURT! >:(',
	', dislike this court :(',
	', think this court is okay :/',
	', actually like this court :)',
	', REALLY LOVE THIS COURT! >:D',
];

// Store the rating for future use
let rating = null;

// Iterate through each court id to create reviews for each court
for (let courtId of courtIds) {
	try {
		// User 1 creates a review for the court
		rating = randomNum(1, 5);
		review1 = await court_rev_functions.create(
			courtId.toString(),
			user1._id.toString(),
			rating,
			'I, ' + user1.firstName + funResponses[rating - 1]
		);

		// User 2 creates a review for the court
		rating = randomNum(1, 5);
		review2 = await court_rev_functions.create(
			courtId.toString(),
			user2._id.toString(),
			rating,
			'I, ' + user2.firstName + funResponses[rating - 1]
		);

		// User 3 creates a review for the court
		rating = randomNum(1, 5);
		review3 = await court_rev_functions.create(
			courtId.toString(),
			user3._id.toString(),
			rating,
			'I, ' + user3.firstName + funResponses[rating - 1]
		);

		// User 4 creates a review for the court
		rating = randomNum(1, 5);
		review4 = await court_rev_functions.create(
			courtId.toString(),
			user4._id.toString(),
			rating,
			'I, ' + user4.firstName + funResponses[rating - 1]
		);
	} catch (err) {
		console.log(`Error creating reviews for court ${courtId}: ${err}`);
	}

	// Store the time for the game
	let time = null;
	let temp = null;

	// Variable to store the game
	let game = null;

	// Get the court
	let court = await courts_functions.get(courtId.toString());

	// Date for today
	let date = new Date();
	let day, month, year;
	// let today = day-mont-2023

	// If a user loves the court have them create a game for today or soon
	for (let review of court.reviews) {
		if (parseInt(review.rating) === 5) {
			// Create the time
			temp = randomNum(1, 12);
			time =
				(temp < 10 ? '0' + temp.toString() : temp.toString()) +
				':00 ' +
				(randomNum(0, 1) === 0 ? 'AM' : 'PM');

			// Create the date
			day = date.getDay() + randomNum(0, 2);
			if (day < 10) day = '0' + day.toString();
			month = date.getMonth() + randomNum(0, 2) + 1;
			if (month < 10) month = '0' + month.toString();
			year = date.getFullYear();

			try {
				game = await games_functions.create(
					courtId.toString(),
					review.userID.toString(),
					`${month}/${day}/${year}`,
					time,
					randomNum(2, 10)
				);
				console.log(`Created game for court ${courtId} at ${time}`);
			} catch (err) {}
		}
		// Else if they liked the court have them join a game
		else if (parseInt(review.rating) === 4) {
			// Get all games for the court
			game = await games_functions.getAll(courtId.toString());

			// If there are no games for the court, skip
			if (game.length === 0) continue;

			// Get a random game
			game = game[randomNum(0, game.length - 1)];

			// Join the game
			try {
				await games_members_functions.create(
					game._id.toString(),
					review.userID.toString()
				);
				console.log(`User ${review.userID} joined game ${game._id}`);
			} catch (e) {}
		}
	}
}

// Get the current day
let date = new Date();
let day, month, year;
day = date.getDay();
if (day < 10) day = '0' + day.toString();
month = date.getMonth() + 1;
if (month < 10) month = '0' + month.toString();
year = date.getFullYear();

// Store the court
let court = null;

// Creating trending games just in case they are not created
console.log('Creating trending games');
try {
	court = await courts_functions.get(
		courtIds[randomNum(0, courtIds.length - 1)].toString()
	);
	await games_functions.create(
		court._id.toString(),
		user1._id.toString(),
		`${month}/${day}/${year}`,
		'11:59 PM',
		randomNum(2, 10)
	);
} catch (e) {
	console.log(e);
}
try {
	court = await courts_functions.get(
		courtIds[randomNum(0, courtIds.length - 1)].toString()
	);
	await games_functions.create(
		court._id.toString(),
		user2._id.toString(),
		`${month}/${day}/${year}`,
		'11:59 PM',
		randomNum(2, 10)
	);
} catch (e) {
	console.log(e);
}
try {
	court = await courts_functions.get(
		courtIds[randomNum(0, courtIds.length - 1)].toString()
	);
	await games_functions.create(
		court._id.toString(),
		user3._id.toString(),
		`${month}/${day}/${year}`,
		'11:59 PM',
		randomNum(2, 10)
	);
} catch (e) {
	console.log(e);
}
try {
	court = await courts_functions.get(
		courtIds[randomNum(0, courtIds.length - 1)].toString()
	);
	await games_functions.create(
		court._id.toString(),
		user4._id.toString(),
		`${month}/${day}/${year}`,
		'11:59 PM',
		randomNum(2, 10)
	);
} catch (e) {
	console.log(e);
}

// Close the connection
await closeConnection();
