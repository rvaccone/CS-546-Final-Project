import { Router } from 'express';
const router = Router();
import { gamesData } from '../data/index.js';
import * as validation from '../validation.js';

// TODO: render instead of json. Including data you want to render with it.

router
	.route('/:courtID')

	// Create Game by courtID
	.post(async (req, res) => {
		const courtsPostData = req.body;

		// Checks to see if the req.body is empty.
		if (!courtsPostData || Object.keys(courtsPostData).length === 0) {
			return res.status(400).json({ error: 'There are no fields in the request body' });
		}

		// Checks to see if the correct number of fields were returned.
		if (Object.keys(courtsPostData).length !== 5) {
			return res.status(400).json({ error: 'The schema does not match the database.' });
		}

		// Validates the input.
		try {
			courtsPostData.courtID = validation.checkID(courtsPostData.courtID, 'courtID');
			courtsPostData.date = validation.checkDate(courtsPostData.date, 'date');
			courtsPostData.time = validation.checkTime(courtsPostData.time, 'time');
			courtsPostData.maxPlayers = validation.checkMaxPlayer(
				courtsPostData.maxPlayers,
				'maxPlayers'
			);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		// Creates a new game.
		try {
			console.log(courtsPostData);
			const { courtID, date, time, maxPlayers } = courtsPostData;
			const newGame = await gamesData.create(courtID, date, time, maxPlayers);
			return res.status(200).json(newGame);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ error: e });
		}
	});

router
	.route('/:gameID')

	// Delete Game by gameID
	.delete(async (req, res) => {})

	// Add player to game by gameID using create gameMember.
	.put(async (req, res) => {});
