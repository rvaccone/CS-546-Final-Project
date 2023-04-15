// This is for testing/seeding.
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as users_functions from '../data/users.js';
import * as games_functions from '../data/games.js';
import * as games_members_functions from '../data/gameMembers.js';
import * as courts_functions from '../data/courts.js';
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
	// Creates a band.
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
	game3 = await games_functions.create(court2._id, '08/22/2023', '9:34 am', 10);
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
		'643a0375ffe511007e88ec6f',
		'11/20/2023',
		'9:34 am',
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

console.log('Done seeding database');

await closeConnection();
