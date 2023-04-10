import { games, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new game lobby and logs it in the games collection.
//? Is this the right ID?
const create = async (gameID, userID, firstName, lastName) => {
	gameID = validation.checkID(gameID, 'gameID');
	userID = validation.checkID(userID, 'userID');
	firstName = validation.checkString(firstName, 'firstName');
	lastName = validation.checkString(lastName, 'lastName');

	// Checks user collection to determine if firstName and lastName are registered users.
	const userCollection = await users();
	const memberFirstName = await userCollection
		.find({})
		.project({ _id: 0, firstName: 1 })
		.toArray();
	// const memberLastName = await userCollection.find({}).project({ _id: 0, lastName: 1 }).toArray();
	// if (!memberFirstName.includes(firstName) || !memberLastName.includes(lastName))
	// 	throw 'Error: Not a registered user.';

	// TODO: Make sure the user is not already in the game.
	// TODO: Make sure the userID matches the firstName and lastName.

	// Creates fullName variable.
	let fullName = firstName + ' ' + lastName;

	// Initalizes a newGameMember.
	// TODO: Make this value store as an ObjectID?
	let newGameMember = {
		userID: userID,
		fullName: fullName,
	};

	// Pushing the value to the band.
	const gameCollection = await games();
	const newGameMemberInformation = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(gameID) },
		{ $push: { gameMembers: { userID, fullName } } }
	);
	if (newGameMemberInformation.lastErrorObject.n === 0) throw 'Error: could not insert album.';
	return newGameMember;
};

// Gets all game members from a lobby.
const getAll = async (gameID) => {
	gameID = validation.checkID(gameID, 'gameID');

	const gameCollection = await games();
	const gameMembers = await gameCollection.findOne(
		{ _id: new ObjectId(gameID) },
		{ gameMembers: 1 }
	);
	if (!gameMembers) throw 'Error: Album not found within any band.';
	return gameMembers.gameMembers;
};

// Gets a game member by their id.
const get = async (userID) => {};

// Removes a game member by their id.
const remove = async (userID) => {};

// Updates a game member by their id.
//? Should this be done by userID or gameID?
const update = async (id, firstName, lastName) => {};

export { create, getAll, get, remove, update };
