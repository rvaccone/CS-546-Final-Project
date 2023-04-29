import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as users_functions from '../data/users.js';
import * as games_functions from '../data/games.js';
import * as games_members_functions from '../data/gameMembers.js';
import * as courts_functions from '../data/courts.js';
import * as court_rev_functions from '../data/courtReviews.js';
import fs from 'fs';

import { courts } from '../config/mongoCollections.js';
const data = fs.readFileSync('tasks/DPR_Basketball_001.json');
const courtOpenData = JSON.parse(data);

// Connect to the database
const db = await dbConnection();
// Clear the database
await db.dropDatabase();

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
			court.Accessible === 'Y',
			parseFloat(court.lat),
			parseFloat(court.lon)
		);
		console.log(`Created new court with ID ${insertCourts._id}`);
		courtIds.push(insertCourts._id);
	} catch (err) {
		console.log(`Error creating court "${court.Name}": ${err}`);
	}
}
let user1 = null,
	user2 = null,
	user3 = null,
	user4 = null;
// created 4 Users
try {
	user1 = await users_functions.create(
		'John',
		'Doe',
		'jdoe@gmail.com',
		'Password1$',
		20,
		'Likes long walks on the beach',
		'https://www.patrickhill.nyc/images/logo.jpg'
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
		32,
		'Spikeball fanatic',
		'https://www.patrickhill.nyc/images/logo.jpg'
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
		25,
		'Cool guy',
		'https://www.patrickhill.nyc/images/logo.jpg'
	);
	console.log(user3);
} catch (e) {
	console.log(`Error creating user 3: ${e}`);
}

try {
	user4 = await users_functions.create(
		'Delete',
		'Me',
		'deleteme@gmail.com',
		'd3l3teM&',
		50,
		'uncool guy',
		'https://www.patrickhill.nyc/images/logo.jpg'
	);
	console.log(user4);
} catch (e) {
	console.log(`Error creating user 4: ${e}`);
}

console.log(courtIds);

// added comments and ratings

let review1 = null,
	review2 = null,
	review3 = null,
	review4 = null;
for (let courtId of courtIds) {
	try {
		// User 1 creates a review for the court
		review1 = await court_rev_functions.create(
			courtId.toString(),
			user1._id.toString(),
			5,
			'This is a great court!'
		);

		// User 2 creates a review for the court
		review2 = await court_rev_functions.create(
			courtId.toString(),
			user2._id.toString(),
			4,
			'This court is pretty good.'
		);

		review3 = await court_rev_functions.create(
			courtId.toString(),
			user3._id.toString(),
			2,
			'This court is just okay.'
		);

		review4 = await court_rev_functions.create(
			courtId.toString(),
			user4._id.toString(),
			1,
			'This court is terrible.'
		);
	} catch (err) {
		console.log(`Error creating reviews for court ${courtId}: ${err}`);
	}
}

// Close the connection
await closeConnection();
