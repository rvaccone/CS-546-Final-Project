import { games } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new game and logs it in the games collection.
const create = async (courtID, startTime, endTime, maxPlayers) => {
	courtID = courtID.toString();
	courtID = validation.checkID(courtID, 'courtID');
	startTime = validation.checkDate(startTime, 'startTime');
	endTime = validation.checkDate(endTime, 'endTime');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Check that endTime is after startTime.
	if (endTime <= startTime) {
		throw 'Error: startTime cannot be after endTime.';
	}

	let newGame = {
		courtID: new ObjectId(courtID),
		startTime: startTime,
		endTime: endTime,
		maxPlayers: maxPlayers,
		gameMembers: [],
	};

	// Waits for collection and attempts to insert newUser.
	const gameCollection = await games();

	// Check that no game times overlap.
	// TODO: Check for addditional cases.
	const gameStartTimes = await gameCollection
		.find({})
		.project({ _id: 0, startTime: 1, endTime: 1 })
		.toArray();
	gameStartTimes.forEach((game) => {
		if (game.startTime <= newGame.startTime && game.endTime >= newGame.endTime)
			throw 'Error: Cannot schedule games for overlapping times.';
	});

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
const getAll = async (courtID) => {
	courtID = courtID.toString();
	courtID = validation.checkID(courtID, 'courtID');
	const gameCollection = await games();
	// This gives us the data as an array of obejcts from the database.
	let gameList = await gameCollection
		.find({ courtID: new ObjectId(courtID) })
		.project({ _id: 1, courtID: 1 })
		.toArray();
	if (!gameList) throw 'Could not get all games.';
	gameList = gameList.map((element) => {
		element._id = element._id.toString();
		element.courtID = element.courtID.toString();
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

// Updates a game by its id.\
const update = async (id, courtID, startTime, endTime, maxPlayers) => {
	// TODO: Validation / Compare start and end times.
	id = validation.checkID(id, 'id');
	courtID = validation.checkID(courtID, 'courtID');
	startTime = validation.checkDate(startTime, 'startTime');
	endTime = validation.checkDate(endTime, 'endTime');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Check that endTime is after startTime.
	if (endTime <= startTime) {
		throw 'Error: startTime cannot be after endTime.';
	}

	const gameStartTimes = await gameCollection
		.find({})
		.project({ _id: 0, startTime: 1, endTime: 1 })
		.toArray();
	gameStartTimes.forEach((game) => {
		if (game.startTime <= newGame.startTime && game.endTime >= newGame.endTime)
			throw 'Error: Cannot schedule games for overlapping times.';
	});

	const game = await get(id);
	if (
		game.courtID === courtID &&
		game.startTime === startTime &&
		game.endTime === endTime &&
		game.maxPlayers === maxPlayers
	)
		throw 'Error: cannot update record with the same set of values.';

	// Preforms an update.
	const updateGame = {
		courtID: courtID,
		startTime: startTime,
		endTime: endTime,
		maxPlayers: maxPlayers,
	};

	// Await the collection of the user.
	const gameCollection = await games();
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
