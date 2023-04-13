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
	// TODO: write a filter.
	const userCollection = await users();
	const memberFirstName = await userCollection
		.find({})
		.project({ _id: 0, firstName: 1 })
		.toArray();
	// const memberLastName = await userCollection.find({}).project({ _id: 0, lastName: 1 }).toArray();
	// if (!memberFirstName.includes(firstName) || !memberLastName.includes(lastName))
	// 	throw 'Error: Not a registered user.';
	// TODO: Find the user with filter, then check if name equals the functions name input.
	// TODO: Make sure the user is not already in the game.
	// TODO: Make sure the userID matches the firstName and lastName.

	// Creates fullName variable.
	let fullName = firstName + ' ' + lastName;

	// Initalizes a newGameMember.
	// TODO: Make this value store as an ObjectID?
	let newGameMember = {
		userID: new ObjectId(userID),
		fullName: fullName,
	};

	// Pushing the value to the band.
	const gameCollection = await games();
	const newGameMemberInformation = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(gameID) },
		{ $push: { gameMembers: { userID, fullName } } }
	);
	if (newGameMemberInformation.lastErrorObject.n === 0) throw 'Error: could not add player.';
	return { userID: newGameMember.userID.toString(), fullName: fullName };
};

// Gets all game members from a lobby.
const getAll = async (gameID) => {
	gameID = validation.checkID(gameID, 'gameID');

	const gameCollection = await games();
	const gameMembers = await gameCollection.findOne(
		{ _id: new ObjectId(gameID) },
		{ gameMembers: 1 }
	);
	if (!gameMembers) throw 'Error: No players found within game.';
	return gameMembers.gameMembers;
};

// Gets a game member by their id.
const get = async (userID) => {
	id = validation.checkID(userID, 'id');
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (user === null) throw 'No user with that id';
	user._id = user._id.toString();
	return user;
};

// Removes a game member by their id.
const remove = async (userID) => {
	id = validation.checkID(userID, 'id');
	const userCollection = await users();
	const deletionInfo = await userCollection.findOneAndDelete({
		_id: new ObjectId(id),
	});

	// checks for the number of documents affected
	if (deletionInfo.lastErrorObject.n === 0) {
		throw `Could not delete band with id of ${id}`;
	}
	return { userID: id, deleted: true };
};

// Updates a game member by their id.
//? Should this be done by userID or gameID?
// We need both to identify game and then user.
const update = async (id, firstName, lastName) => {};

export { create, getAll, get, remove, update };
