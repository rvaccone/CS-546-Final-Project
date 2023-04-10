import { games } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new game and logs it in the games collection.
const create = async (courtID, startTime, endTime) => {
	// TODO: Validation

	let newGame = {
		courtID: courtID,
		startTime: startTime,
		endTime: endTime,
		gameMembers: [],
	};
	// Waits for collection and attempts to insert newUser.
	const gameCollection = await games();

	// Inserts new user into collection.
	const insertInfo = await gameCollection.insertOne(newGame);

	// Checks if newUser was inserted properly.
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw 'Error: band could not be inserted.';

	// Sets the id of the newUser to a string and returns user.
	const newId = insertInfo.insertedId.toString();
	const game = await get(newId);
	return game;
};

// Gets all games from the games collection.
const getAll = async () => {
	const gameCollection = await games();
	// This gives us the data as an array of obejcts from the database.
	let gameList = await gameCollection.find({}).project({ _id: 1, name: 1 }).toArray();
	if (!gameList) throw 'Could not get all games.';
	gameList = gameList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return gameList;
};

// Gets a game by its id.
const get = async (id) => {
	id = validation.checkID(id, 'id');
	const gameCollection = await games();
	const game = await gameCollection.findOne({ _id: new ObjectId(id) });
	if (!game) throw 'Game not found';
	game._id = game._id.toString();
	return game;
};

// Removes a game by its id.
const remove = async (id) => {
	id = validation.checkID(id, 'id');
	const gameCollection = await games();
	const deletionInfo = await gameCollection.findOneAndDelete({ _id: new ObjectId(id) });
	if (deletionInfo.deletedCount === 0) {
		throw `Could not delete game with id of ${id}`;
	}
	return { gameID: id, deleted: true };
};

// Updates a game by its id.
const update = async (id, courtID, startTime, endTime) => {
	// TODO: Validation / Compare start and end times.

	const game = await get(id);
	if (game.courtID === courtID && user.startTime === startTime && user.endTime === endTime)
		throw 'Error: cannot update record with the same set of values.';

	// Preforms an update on the band.
	const updateGame = {
		courtID: courtID,
		startTime: startTime,
		endTime: endTime,
	};

	// Await the collection of the user.
	const gameCollection = await users();

	const updatedInfo = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: updateGame },
		{ returnDocument: 'after' }
	);

	// Checks if there is an error with updating the record.
	if (updatedInfo.lastErrorObject.n === 0) {
		throw 'could not update band successfully';
	}
	updatedInfo.value._id = new ObjectId(updatedInfo.value._id).toString();
	return updatedInfo.value;
};

export { create, getAll, get, update, remove };
