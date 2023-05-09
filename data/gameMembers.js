import { games, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';
import * as users_functions from '../data/users.js';
import * as game_functions from '../data/games.js';
//TODO: cant have a gm join a game on the same time n date

// Creates a new game lobby and logs it in the games collection.
//? Is this the right ID?
const create = async (gameID, userID) => {
	gameID = validation.checkID(gameID, 'gameID');
	userID = validation.checkID(userID, 'userID');

	// Checks user collection to find player existing
	//   const userCollection = await users();
	let userExist = await users_functions.get(userID);
	if (userExist === null) throw 'there is no user in mongo with that id';
	const userCollection = await users();
	const memberName = await userCollection.findOne({
		_id: new ObjectId(userID),
	});

	if (memberName === null) throw 'could not find user in usersCollection';
	const gameCollection = await games();
	const game = await gameCollection.findOne({ _id: new ObjectId(gameID) });
	let gameDate = game.date;
	//Make sure the user is not already in the game.

	let game_details = await game_functions.get(gameID);
	let players_in_this_game = game_details.gameMembers;
	if (players_in_this_game.length === game_details.maxPlayers) {
		throw 'Game is full cannot add players';
	}
	for (let i = 0; i < players_in_this_game.length; i++) {
		if (new ObjectId(userID).equals(players_in_this_game[i]._id))
			throw 'player is already a member of this game';
	}

	// Making sure the player is not in another game at same time
	let playersInSameTimeGames = await gameCollection
		.find({ time: game.time, date: gameDate })
		.project({ gameMembers: 1 })
		.toArray();

	for (let i = 0; i < playersInSameTimeGames.length; i++) {
		let memObj = playersInSameTimeGames[i].gameMembers;
		for (let j = 0; j < memObj.length; j++) {
			if (new ObjectId(userID).equals(memObj[j]._id))
				throw 'user is already in another game starting at same time';
		}
	}
	// Creates fullName variable.
	// let fullName = memberName.firstName + " " + memberName.lastName;
	let fullName = await users_functions.getFullName(userID);
	// Initalizes a newGameMember.
	let newGameMember = {
		_id: new ObjectId(userID),
		fullName: fullName,
	};

	let updatedGameMembers = game.gameMembers;
	updatedGameMembers.push(newGameMember);

	//updating court with updated reviews and overall rating
	const updatedGame = {
		gameMembers: updatedGameMembers,
	};
	//   const gameCollection = await games();
	const updatedInfo = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(gameID) },
		{ $set: updatedGame },
		{ returnDocument: 'after' }
	);

	if (updatedInfo.lastErrorObject.n === 0) {
		throw 'could not update review in court successfully';
	}
	updatedInfo.value._id = updatedInfo.value._id.toString();
	return updatedInfo.value;
};

// Gets all game members from a lobby.
const getAll = async (gameID) => {
	gameID = validation.checkID(gameID, 'gameID');

	const gameCollection = await games();
	const gameMembers = await gameCollection.findOne(
		{ _id: new ObjectId(gameID) },
		{ gameMembers: 1 }
	);
	if (!gameMembers) throw 'Error: No game members for this game';
	if (gameMembers.length === 0) throw 'Error: No game members for this game';
	return gameMembers.gameMembers;
};

// Gets a game member by their id.
const get = async (gameID, userID) => {
	userID = validation.checkID(userID, 'userID');
	gameID = validation.checkID(gameID, 'gameID');

	const gameCollection = await games();
	let game = await gameCollection.findOne({
		_id: new ObjectId(gameID),
	});

	if (game === null) throw 'Game not found';

	let user = null;
	for (let i = 0; i < game.gameMembers.length; i++) {
		if (game.gameMembers[i]._id.toString() === userID) {
			user = game.gameMembers[i];
			break;
		}
	}

	if (user === null) throw 'User not found in game';

	return user;
};

// Removes a game member by their id.
const remove = async (gameID, userID) => {
	userID = validation.checkID(userID, 'userID');
	gameID = validation.checkID(gameID, 'gameID');

	const gameCollection = await games();
	const game = await gameCollection.findOne({ _id: new ObjectId(gameID) });

	if (!game) {
		throw 'Error: Game not found';
	}

	let gameMembers = game.gameMembers;
	let memberIndex = -1;
	for (let i = 0; i < gameMembers.length; i++) {
		if (gameMembers[i]._id.toString() === userID) {
			memberIndex = i;
			break;
		}
	}

	if (memberIndex === -1) {
		throw 'Error: Game member not found';
	}

	gameMembers.splice(memberIndex, 1);

	const updatedGame = await gameCollection.findOneAndUpdate(
		{ _id: new ObjectId(gameID) },
		{ $set: { gameMembers: gameMembers } },
		{ returnDocument: 'after' }
	);

	if (!updatedGame || updatedGame.lastErrorObject.nModified === 0) {
		throw 'Error: Failed to remove game member';
	}

	return updatedGame.value;
};

export { create, getAll, get, remove };
