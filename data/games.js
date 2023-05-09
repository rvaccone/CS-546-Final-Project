import { games } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';
import * as courts_functions from '../data/courts.js';
import * as game_members_functions from '../data/gameMembers.js';

// Creates a new game and logs it in the games collection.
const create = async (courtID, userID, date, time, maxPlayers) => {
	//****INPUT VALIDATION****//
	courtID = validation.checkID(courtID, 'courtID');
	let courtFound = await courts_functions.get(courtID);
	let courtFoundDetails = [
		courtFound.name,
		courtFound.location,
		courtFound.lat,
		courtFound.long,
	];
	userID = validation.checkID(userID, 'userID');
	date = validation.checkDate(date, 'date');
	time = validation.checkTime(time, 'time');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Combine date and time strings into a single string
	const dateTimeString = `${date} ${time}`;

	// Create a Date object using the concatenated string
	const gameDateofCreation = new Date(dateTimeString);
	// Get the current date
	const currentDate = new Date();

	// Check if the game date is in the past
	if (gameDateofCreation < currentDate) {
		throw 'Error: Cannot schedule games for past dates.';
	}

	// Input validation
	time = validation.checkTime(time, 'time');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Creates a new game.
	let newGame = {
		courtID: new ObjectId(courtID),
		userID: new ObjectId(userID),
		courtName: courtFoundDetails[0],
		date: date,
		time: time.toLowerCase(),
		maxPlayers: maxPlayers,
		gameMembers: [],
	};

	// Waits for collection and attempts to insert newGame.
	const gameCollection = await games();

	// Check that no games start at the same time.
	const gameStartTimes = await gameCollection
		.find({})
		.project({ _id: 1, courtID: 1, date: 1, time: 1 })
		.toArray();

	for (let i = 0; i < gameStartTimes.length; i++) {
		let game = gameStartTimes[i];
		if (
			game.date.toString() === newGame.date.toString() &&
			game.time.toString() === newGame.time.toString() &&
			game.courtID.toString() === newGame.courtID.toString()
		) {
			throw 'Error: Cannot schedule games for overlapping times.';
		}
	}

	// Inserts newGame into game collection.
	const insertInfo = await gameCollection.insertOne(newGame);

	// Checks if newGame was inserted properly.
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw 'Error: game could not be scheduled.';

	// Adds the user to the gameMembers collection
	try {
		let createdMember = await game_members_functions.create(
			newGame._id.toString(),
			userID
		);
	} catch (e) {
		throw e;
	}

	// Sets the id of the newGame to a string and returns game.
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
	const deletionInfo = await gameCollection.findOneAndDelete({
		_id: new ObjectId(id),
	});
	if (deletionInfo.deletedCount === 0) {
		throw `Could not delete game with id of ${id}`;
	}
	return { gameID: id, deleted: true };
};

// Updates a game by its id.
// TODO: Update this.
const update = async (id, courtID, userID, date, time, maxPlayers) => {
	id = validation.checkID(id, 'id');
	courtID = courtID.toString();
	userID = userID.toString();
	courtID = validation.checkID(courtID, 'courtID');
	date = validation.checkDate(date, 'date');
	time = validation.checkTime(time, 'time');
	maxPlayers = validation.checkMaxPlayer(maxPlayers, 'maxPlayers');

	// Check that courtID exists.
	const court = await courts_functions.get(courtID);

	// Checks the update values are different from the current values.
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
		courtID: new ObjectId(objectCourtID),
		userID: new ObjectId(userID),
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

const removeAllPastGames = async () => {
	const gameCollection = await games();

	// This gives us the data as an array of objects from the database.
	let gameList = await gameCollection
		.find({})
		.project({ _id: 1, courtID: 1, date: 1 })
		.toArray();

	const currentDate = new Date();

	let removedGamesCount = 0;
	for (let i = 0; i < gameList.length; i++) {
		if (gameList[i].date) {
			const gameDateofCreation = new Date(gameList[i].date);

			if (gameDateofCreation < currentDate) {
				let game = await remove(gameList[i]._id.toString());
				if (game) {
					removedGamesCount += 1;
				}
			}
		}
	}
	return `removed games: ${removedGamesCount}`;
};

const getAllTrending = async () => {
	let currentDate = new Date();
	let month = String(currentDate.getMonth() + 1).padStart(2, '0');
	let day = String(currentDate.getDate()).padStart(2, '0');
	let year = currentDate.getFullYear();
	let dateString = `${month}/${day}/${year}`;
	dateString = validation.checkDate(dateString);

	const gameCollection = await games();
	let trendingGameList = await gameCollection
		.find({ date: dateString })
		.project({
			_id: 1,
			courtID: 1,
			courtName: 1,
			location: 1,
			date: 1,
			time: 1,
		})
		.toArray();

	return trendingGameList;
};

// Function to check if a user can start a game with the given parameters
const checkUserInGame = async (userID, time, date) => {
	// Validate the input
	userID = validation.checkID(userID, 'userID');
	time = validation.checkTime(time, 'time');
	date = validation.checkDate(date, 'date');

	// Retrieve the games collection
	const gameCollection = await games();

	let gameData = await gameCollection.find({}).toArray();

	// Filter games that have the same time and date
	const gamesWithSameTimeAndDate = gameData.filter((game) => {
		return (
			game.time.toLowerCase() === time.toLowerCase() && game.date === date
		);
	});

	// Filter games with the user as a gameMember
	const gamesWithUser = gamesWithSameTimeAndDate.filter((game) => {
		return (
			game.gameMembers.filter((member) => {
				return member._id.toString() === userID.toString();
			}).length > 0
		);
	});

	// Return true if user has a game conflict
	return gamesWithUser.length > 0;
};

export {
	create,
	getAll,
	get,
	update,
	remove,
	removeAllPastGames,
	getAllTrending,
	checkUserInGame,
};
