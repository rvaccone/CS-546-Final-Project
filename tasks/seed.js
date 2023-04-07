// This is for testing/seeding.
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as users_functions from '../data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let user1;

try {
	// Creates a band.
	user1 = await users_functions.create(
		'John',
		'Doe',
		'johndoe@gmail.com',
		'password',
		20,
		'Hello, my name is John Doe.',
		'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin'
	);
} catch (e) {
	console.log(e);
}

console.log('Done seeding database');

await closeConnection();
