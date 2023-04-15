// This is for testing/seeding.
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as users_functions from '../data/users.js';
import * as games_functions from '../data/games.js';
import * as games_members_functions from '../data/gameMembers.js';
import * as courts_functions from '../data/courts.js';
import * as court_rev_functions from '../data/courtReviews.js';
const db = await dbConnection();
await db.dropDatabase();

let user1;
let user2;
let user3;

/* ------------------- USERS ------------------- */
try {
	// Creates a band.
	user1 = await users_functions.create(
		'John',
		'Doe',
		'jOhNdOe@gmail.com',
		'Password1$',
		20,
		'KX5Y0eBIdiVOg7EW2AF7RZEgpcRSjFUtgIk2qypGN0dRZGHgVSJUeH5b7rLPZ5OLKTaeM0GcS6NtzgAC4ZP9TCFAT3eSWgDJR1Ca1QVSoYX7W50vAPCJd0aAEvWs9Wc3Vbqd32M3pkXdzbIg7UKDKw8JP9jAS8oqywI0CvUSOlkrrVer5K8fEVGnqJWMAbc7Ra5bGShASldPufIk9xmbneproIElyZiaaGpWpnJCfLwbS21QEbJ4ciHue1L5cp0huH2VFR9bBmUrmeDX7qr1U9PtW538gRKUTP6arcVYwemeiPp3uT1kV69KnPjxmchFpZ0AvghTiaQqzHCqIDuYQmZ8Ljz8PRPjJS5FwjHKdjjjy7aix5NJLbah7ZloZBnjzjNApf2btd42VOVISN1Dm3rVLProUXQcXDnm22D7nl46kYnHERmP5ksNuqY9TWEG0igDGPgzahxFa2S4Y3AEsJwLX0FkjBnpKl22LGRnXzzTKyVnTKHs',
		'https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png'
	);
} catch (e) {
	console.log(e);
}

try {
	// Creates a band.
	user2 = await users_functions.create(
		'Another',
		'Person',
		'joHnDoe@gmail.com',
		'Password1$',
		21,
		'This is my bio.',
		'https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png'
	);
} catch (e) {
	console.log(e);
}

try {
	// Creates a user.
	user3 = await users_functions.create(
		'Jane',
		'Doe',
		'johndoe2@gmail.com',
		'Password1$',
		20,
		'Hello, my name is Jane Doe.',
		'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin.jpg'
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

try {
	// Removes a user.
	const removal = await users_functions.remove(user3._id);
	console.log(removal);
} catch (e) {
	console.log(e);
}

try {
	// Renames band1.
	const rename_user = await users_functions.update(
		user1._id,
		'John',
		'Doe',
		'jOhNdOe@gmail.com',
		'Password1$',
		20,
		'KX5Y0eBIdiVOg7EW2AF7RZEgpcRSjFUtgIk2qypGN0dRZGHgVSJUeH5b7rLPZ5OLKTaeM0GcS6NtzgAC4ZP9TCFAT3eSWgDJR1Ca1QVSoYX7W50vAPCJd0aAEvWs9Wc3Vbqd32M3pkXdzbIg7UKDKw8JP9jAS8oqywI0CvUSOlkrrVer5K8fEVGnqJWMAbc7Ra5bGShASldPufIk9xmbneproIElyZiaaGpWpnJCfLwbS21QEbJ4ciHue1L5cp0huH2VFR9bBmUrmeDX7qr1U9PtW538gRKUTP6arcVYwemeiPp3uT1kV69KnPjxmchFpZ0AvghTiaQqzHCqIDuYQmZ8Ljz8PRPjJS5FwjHKdjjjy7aix5NJLbah7ZloZBnjzjNApf2btd42VOVISN1Dm3rVLProUXQcXDnm22D7nl46kYnHERmP5ksNuqY9TWEG0igDGPgzahxFa2S4Y3AEsJwLX0FkjBnpKl22LGRnXzzTKyVnTKHs',
		'https://t3.ftcdn.net/jpg/02/95/26/46/360_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.png'
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
console.log('-'.repeat(20) + ' Courts ' + '-'.repeat(20));

// Create the first court
console.log('Creating the first court');
try {
	court1 = await courts_functions.create('court1', '122 Bloomfield Ave', 4, false, 10, 33);
	console.log(court1);
} catch (e) {
	console.log(e);
}

// Create the second court
console.log('Creating the second court');
try {
	court2 = await courts_functions.create('court2', '122 Bloomfield Ave', 2, true, -10, -33);
	console.log(court2);
} catch (e) {
	console.log(e);
}

/* ---------------------- GAMES ---------------------- */
let game1;
let game2;
let game3;

try {
	game1 = await games_functions.create(court1._id, '08/20/2023', '9:34 am', 10);
	console.log(game1);
} catch (e) {
	console.log(e);
}

try {
	game2 = await games_functions.create(court1._id, '08/22/2023', '9:35 am', 10);
	console.log(game1);
} catch (e) {
	console.log(e);
}

try {
	game3 = await games_functions.create(court2._id, '08/22/2023', '9:34 PM', 10);
	console.log(game2);
} catch (e) {
	console.log(e);
}

// console.log('==============================================');
// try {
// 	let allGames = await games_functions.getAll(court1._id);
// 	console.log(allGames);
// } catch (e) {
// 	console.log(e);
// }

// console.log('==============================================');
// try {
// 	let removeGame = await games_functions.remove(game1._id);
// 	console.log(removeGame);
// } catch (e) {
// 	console.log(e);
// }

console.log('==============================================');
try {
	let updateGameOne = await games_functions.update(
		game1._id,
		court1._id,
		'08/22/2023',
		'9:35 AM',
		10
	);
	console.log(updateGameOne);
} catch (e) {
	console.log(e);
}
// console.log('==============================================');
// try {
// 	let gameMember1 = await games_members_functions.create(
// 		game2._id,
// 		user1._id,
// 		user1.firstName,
// 		user1.lastName
// 	);
// 	console.log(gameMember1);
// } catch (e) {
// 	console.log(e);
// }

// try {
// 	let allMembers = await games_members_functions.getAll(game2._id);
// 	console.log(allMembers);
// } catch (e) {
// 	console.log(e);
// }

/* ---------------------- Courts ---------------------- */
// Printing out a spacer for readability
console.log('-'.repeat(20) + ' Courts ' + '-'.repeat(20));

// Create the first court
console.log('Creating the first court');
try {
	court1 = await courts_functions.create('court1', '122 Bloomfield Ave', 4, false, 10, 33);
} catch (e) {
	console.log(e);
}

// Create the second court
console.log('Creating the second court');
try {
	court2 = await courts_functions.create('court2', '122 Bloomfield Ave', 2, true, -10, -33);
} catch (e) {
	console.log(e);
}

// Get all the courts
console.log('Get all the courts for the first time');
try {
	let allCourts = await courts_functions.getAll();
	console.log(allCourts);
} catch (e) {
	console.log(e);
}
console.log('Done getting all courts');

// Get the first court
console.log('Get the first court');
try {
	let court = await courts_functions.get(court1._id.toString());
	console.log(court);
} catch (e) {
	console.log(e);
}

// Remove the first court
console.log('Remove the first court');
try {
	let removeCourt = await courts_functions.remove(court1._id.toString());
	console.log(removeCourt);
} catch (e) {
	console.log(e);
}

// Get all the courts again
console.log('Get all the courts for the second time');
try {
	let allCourts = await courts_functions.getAll();
	console.log(allCourts);
} catch (e) {
	console.log(e);
}
console.log('Done getting all courts');

// Update the second court
console.log('Update the second court');
try {
	let updateCourt = await courts_functions.update(
		court2._id.toString(),
		'court3',
		'55 Bloom Ave',
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
console.log('Get all the courts for the third time');
try {
	let allCourts = await courts_functions.getAll();
	console.log(allCourts);
} catch (e) {
	console.log(e);
}
console.log('Done getting all courts');

console.log('Done seeding database');
//====pranavs court review functions testing=====//
console.log('creating reviews in the courts inorder to do that i first create 2 courts');
let rev_court1 = null;
let rev_court2 = null;
try {
	console.log('review testing court 1');
	rev_court1 = await courts_functions.create(
		'court for review 1',
		'12 webster Ave',
		4,
		false,
		10,
		36
	);
} catch (e) {
	console.log(e);
}

try {
	console.log('review testing court 2');
	rev_court2 = await courts_functions.create(
		'court for review 2',
		'167 field Ave',
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
console.log('Done getting all courts');

console.log('now adding reviews to the courts');
console.log(rev_court1._id);
try {
	let review1 = await court_rev_functions.create(
		rev_court1._id.toString(),
		'sai bandla',
		4,
		'its a damn good court'
	);
	console.log(review1);
} catch (e) {
	console.log(e);
}
let review2 = null;
try {
	review2 = await court_rev_functions.create(
		rev_court1._id.toString(),
		'jack',
		3.5,
		'its was nice but nets need to be fixed to the hoops'
	);
	console.log(review2);
} catch (e) {
	console.log(e);
}

// testing get all reviews function
console.log('+===============================================+');
try {
	let all_rev = await court_rev_functions.getAll(rev_court1._id.toString());
	console.log(all_rev);
} catch (e) {
	console.log(e);
}
//testing get review by id
console.log('+===============================================+');
try {
	let rev = await court_rev_functions.get(review2.reviews[1]._id.toString());
	console.log(rev);
} catch (e) {
	console.log(e);
}
// testing updating a review function
console.log('+===============================================+');
try {
	let updated_rev = await court_rev_functions.update(
		review2.reviews[1]._id.toString(),
		'Sam',
		5,
		'Amazing court!!!'
	);
	console.log(updated_rev);
} catch (e) {
	console.log(e);
}
//testing deletion of a review
console.log('+===============================================+');
try {
	let updated_rev = await court_rev_functions.remove(review2.reviews[1]._id.toString());
	console.log(updated_rev, 'is gone');
} catch (e) {
	console.log(e);
}
console.log('+===============================================+');

await closeConnection();
