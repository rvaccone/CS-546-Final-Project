import { games } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';
import * as courts_functions from '../data/courts.js';

// Creates a new game and logs it in the games collection.
const create = async (courtID, date, time, maxPlayers) => {
	courtID = courtID.toString();
	courtID = validation.checkID(courtID, 'courtID');
	date = validation.checkDate(date, 'date');
	time = validation.checkTime(time, 'time');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Creates a new game.
	let newGame = {
		courtID: new ObjectId(courtID),
		date: date,
		time: time.toLowerCase(),
		maxPlayers: maxPlayers,
		gameMembers: [],
	};

	// Waits for collection and attempts to insert newGame.
	const gameCollection = await games();

	// Check that courtID exists.
	const court = await courts_functions.get(courtID);

	// Check that no games start at the same time.
	const gameStartTimes = await gameCollection
		.find({})
		.project({ _id: 0, courtID: 1, date: 1, time: 1 })
		.toArray();
	gameStartTimes.forEach((game) => {
		// Checks that games are not on the same court at the same date and time.
		if (
			game.date === newGame.date &&
			game.time === newGame.time &&
			game.courtID === newGame.courtID
		)
			throw 'Error: Cannot schedule games for overlapping times.';
	});

	// Inserts newGame into game collection.
	const insertInfo = await gameCollection.insertOne(newGame);

	// Checks if newGame was inserted properly.
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw 'Error: band could not be inserted.';

	// Sets the id of the newGame to a string and returns user.
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

// Updates a game by its id.
// TODO: Update this.
const update = async (id, courtID, date, time, maxPlayers) => {
	id = validation.checkID(id, 'id');
	courtID = courtID.toString();
	courtID = validation.checkID(courtID, 'courtID');
	date = validation.checkDate(date, 'date');
	time = validation.checkTime(time, 'time');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Check that courtID exists.
	const court = await courts_functions.get(courtID);

	// Checks the upodate values are different from the current values.
	const game = await get(id);
	if (
		game.courtID.toString() === courtID &&
		game.date === date &&
		game.time === time &&
		game.maxPlayers === maxPlayers
	)
		throw 'Error: cannot update record with the same set of values.';

	// Converts the id to an ObjectId.
	let objectCourtID = new ObjectId(courtID);

	// Preforms an update.
	const updateGame = {
		courtID: objectCourtID,
		date: date,
		time: time.toLowerCase(),
		maxPlayers: maxPlayers,
	};

	// Check that no games start at the same time.
	const gameCollection = await games();
	const gameStartTimes = await gameCollection
		.find({})
		.project({ _id: 0, courtID: 1, date: 1, time: 1 })
		.toArray();
	gameStartTimes.forEach((game) => {
		// Checks that games are not on the same court at the same date and time.
		console.log(game);
		console.log(updateGame);
		if (
			game.date === updateGame.date &&
			game.time.toLowerCase() === updateGame.time.toLowerCase() &&
			game.courtID.toString() === updateGame.courtID.toString()
		)
			throw 'Error: Cannot schedule games for overlapping times.';
	});

	// Await the collection of the user.
	const updatedInfo = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: updateGame },
		{ returnDocument: 'after' }
	);

	// Checks if there is an error with updating the record.
	if (updatedInfo.lastErrorObject.n === 0) {
		throw 'Could not update game successfully.';
	}
	updatedInfo.value._id = new ObjectId(updatedInfo.value._id).toString();
	return updatedInfo.value;
};

export { create, getAll, get, update, remove };
