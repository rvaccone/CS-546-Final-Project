import { Router } from 'express';
const router = Router();
import {
	gamesData,
	usersData,
	courtsData,
	gameMembersData,
} from '../data/index.js';
import * as validation from '../validation.js';
import { xssProtectObject } from '../utils/input.js';
import { userSessionID, checkUserSession } from '../utils/session.js';

//route to get the create game form page
router
	.route('/:courtID')
	.get(async (req, res) => {
		// Get the courtID
		let courtID = null;
		try {
			courtID = validation.checkID(req.params.courtID, 'courtID');
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Verify that the court exists
		try {
			await courtsData.get(courtID);
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}
		return res.status(200).render('createGame', { courtId: courtID });
	})

	// Post to create a game by courtID
	.post(async (req, res) => {
		// If the user session does not exist, redirect to the error page
		if (!checkUserSession(req, res))
			return res.status(400).render('Error', {
				errorMessage: 'User is not logged in',
			});

		// Get the post data from the request body
		const courtsPostData = req.body;

		// XSS Protection for the create game form
		req.body = xssProtectObject(req.body);

		// Get the courtID from the url
		let courtID = null;
		try {
			courtID = validation.checkID(req.params.courtID, 'courtID');
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Checks to see if the req.body is empty.
		if (!courtsPostData || Object.keys(courtsPostData).length === 0) {
			return res.status(400).render('Error', {
				errorMessage: 'There are no fields in the request body',
			});
		}

		// Checks to see if the correct number of fields were returned.
		if (Object.keys(courtsPostData).length < 3) {
			return res.status(400).render('Error', {
				errorMessage: `The schema does not match the database. The current body's keys are ${Object.keys(
					courtsPostData
				)}`,
			});
		}
		let dateStr = courtsPostData.date;
		let dateFormatted = `${dateStr.substring(5, 7)}/${dateStr.substring(
			8,
			10
		)}/${dateStr.substring(0, 4)}`;

		// Validates the input.
		try {
			//todo create a check court id validation function
			courtID = validation.checkID(courtID, 'courtID');
			dateFormatted = validation.checkDate(dateFormatted, 'date');
			courtsPostData.time = validation.checkTime(
				courtsPostData.time,
				'time'
			);
			courtsPostData.maxPlayers = validation.checkMaxPlayer(
				courtsPostData.maxPlayers,
				'maxPlayers'
			);
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Creates a new game.
		try {
			const { time, maxPlayers } = courtsPostData;
			const newGame = await gamesData.create(
				courtID,
				userSessionID(req, res),
				dateFormatted,
				time,
				maxPlayers
			);
			return res.render('createConfirmation', {
				courtName: newGame.courtName,
				date: newGame.date,
				time: newGame.time,
				maxPlayers: newGame.maxPlayers,
				gameMembers: newGame.gameMembers,
			});
		} catch (e) {
			res.status(400).render('createConfirmation', {
				errorMessage: e,
			});
		}
	});

// Route to get the game details page
router
	.route('/gameDetails/:gameID')

	.get(async (req, res) => {
		// Store the gameID from the url and validate it
		let gameID = null;
		try {
			gameID = validation.checkID(gameID, 'gameID');
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Get the game using the gameID
		let gameDetails = null;
		try {
			gameDetails = await gamesData.get(gameID);
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}
		// checking if the user viewing this page is already a member

		// Check if the current user is already a member of the game
		let userIsGameMember = false;
		try {
			gameDetails.gameMembers.forEach((member) => {
				if (member._id.equals(userSessionID(req, res))) {
					userIsGameMember = true;
				}
			});
		} catch (e) {}

		let Host;
		try {
			Host = await usersData.getFullName(gameDetails.userID.toString());
		} catch (e) {
			Host = 'NO HOST';
		}
		// Check that the game exists
		if (!gameDetails)
			return res
				.status(400)
				.render('Error', { errorMessage: 'Game not found' });

		// Return the game details
		if (userIsGameMember) {
			return res.status(200).render('pickUpGame', {
				gameDetails: gameDetails,
				Host: Host,
				userIsGameMember,
			});
		} else {
			return res.status(200).render('pickUpGame', {
				gameDetails: gameDetails,
				Host: Host,
			});
		}
	})

	// Delete Game by gameID
	.delete(async (req, res) => {
		// Store the gameID from the url and validate it
		let gameID = null;
		try {
			gameID = validation.checkID(req.params.gameID, 'gameID');
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Call the delete data function for the game
		try {
			let deletedGame = await gamesData.remove(gameID);
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}
	})

	// Add player to game by gameID using create gameMember
	.put(async (req, res) => {
		// Get the request body
		const gameMemberPutData = req.body;

		// Checks to see if the req.body is empty
		if (!gameMemberPutData || Object.keys(gameMemberPutData).length === 0)
			return res
				.status(400)
				.render('Error', { errorMessage: 'The request was empty' });

		// Check to see if the correct number of fields were returned
		if (Object.keys(gameMemberPutData).length !== 2)
			return res.status(400).render('Error', {
				errorMessage:
					'The request contained the wrong number of fields',
			});

		// Validate the IDs
		try {
			gameMemberPutData.gameID = validation.checkID(
				gameMemberPutData.gameID,
				'gameID'
			);
			gameMemberPutData.userID = validation.checkID(
				gameMemberPutData.userID,
				'userID'
			);
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}

		// Call the create gameMember create data function
		try {
			// Variable to store the return value of the create gameMember function
			const createGameMemberData = await gamesData.createGameMember(
				gameMemberPutData.gameID,
				gameMemberPutData.userID
			);

			// Checking if the create gameMember function was successful
			if (!createGameMemberData)
				throw `Error: Could not add user to game with ID ${gameMemberPutData.gameID}`;
		} catch (e) {
			return res.status(400).render('Error', { errorMessage: e });
		}
	});

// Post route to add a member to the game
router
	.route('/addUser/:gameID')
	.post(async (req, res) => {
		// Get the gameID from the url
		let gameID = null;
		try {
			gameID = validation.checkID(req.params.gameID, 'gameID');
		} catch (e) {
			return res.status(400).render('Error', {
				errorMessage: `Invalid gameID`,
			});
		}

		// XSS Protection for the join form
		req.body = xssProtectObject(req.body);

		// Get the game details
		let game = null;
		try {
			game = await gamesData.get(gameID);
		} catch (e) {
			return res.status(400).render('Error', {
				errorMessage: `Getting the game failed with error ${e}`,
			});
		}

		// Check if the game exists
		if (!game)
			return res.status(400).render('Error', {
				errorMessage: `There is no game with id`,
			});

		// Check if the user is signed in or not
		if (checkUserSession(req, res)) {
			let addedMember;
			// Try to call the gameMembersData create function
			try {
				addedMember = await gameMembersData.create(
					gameID,
					userSessionID(req, res)
				);
				res.render('joinConfirmation', {
					courtName: game.courtName,
					courtId: game.courtID,
				});
			} catch (e) {
				return res.status(400).render('Error', {
					errorMessage: e,
				});
			}
		} else {
			return res.status(400).render('Error', {
				errorMessage: `User must be signed in to join`,
			});
		}
	})

	// Delete route to remove member in game
	.delete(async (req, res) => {
		// Get the gameID from the url and validate it
		let gameID = null;
		try {
			gameID = validation.checkID(req.params.gameID, 'gameID');
		} catch (e) {
			return res.status(400).render('Error', {
				errorMessage: `Invalid gameID`,
			});
		}

		// Get the game details
		let game = null;
		try {
			game = await gamesData.get(gameID);
		} catch (e) {
			return res.status(400).render('Error', {
				errorMessage: `Getting the game failed with error ${e}`,
			});
		}

		// Check if the game exists
		if (!game)
			return res.status(400).render('Error', {
				errorMessage: `There is no game with id`,
			});

		// Check if the user is signed in or not
		let removedResult;
		if (checkUserSession(req, res)) {
			// Try to call the gameMembersData remove function
			try {
				removedResult = await gameMembersData.remove(
					req.params.gameID,
					userSessionID(req, res)
				);
				res.json(removedResult);
			} catch (e) {
				return res.status(400).render('Error', {
					errorMessage: e,
				});
			}
		} else {
			return res.status(400).render('Error', {
				errorMessage: `User must be signed in to join`,
			});
		}
	});

// Export the router
export default router;
