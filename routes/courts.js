// Importing express and setting up the router
import { Router } from 'express';
const router = Router();

// Importing the data functions
import { usersData, courtsData, gamesData } from '../data/index.js';

// Importing the validation functions
import * as validation from '../validation.js';

//get courtById handlebar page
router.route('/:courtID').get(async (req, res) => {
	// Store the id from the url
	let courtID = req.params.courtID;

	// Validate the courtID
	try {
		courtID = validation.checkID(courtID, 'courtID');
	} catch (e) {
		return res.status(400).render('Error', { errorMessage: e });
	}

	// Get the court
	let court = null;
	try {
		court = await courtsData.get(courtID);
	} catch (e) {
		return res.status(400).render('Error', { errorMessage: e });
	}

	// Get the pick up games
	let pickUpGames = null;
	try {
		pickUpGames = await gamesData.getAll(courtID);
		console.log('gotem', pickUpGames);
	} catch (e) {
		return res.status(400).render('Error', { errorMessage: e });
	}

	// Check that the court exists
	if (!court)
		return res
			.status(400)
			.render('Error', { errorMessage: 'Error: Court not found' });

	// Iterate through the reviews to add more information
	for (let review of court.reviews) {
		// Get the full name
		let fullName = null;
		try {
			fullName = await usersData.getFullName(review.userID.toString());
		} catch (e) {}

		// Add the full name to the review
		review.fullName = fullName;
	}

	// Render the courtByID page with the court details
	res.render('courtById', {
		court,
		pickUpGames,
	});
});
// TODO court review route
router.route('/:courtID/review').get(async (req, res) => {
	// Store the courtID from the url
    let courtID = req.params.courtID;
    
	//user who should write a review
    let userId = req.session.user._id;
    
	// Validate the courtID
	try {
		courtID = validation.checkID(courtID, 'courtID');
	} catch (e) {
		return res.status(400).render('Error', { errorMessage: e });
	}

	// Get the court details
	let court = null;
	try {
		court = await courtsData.get(courtID);
	} catch (e) {
		return res.status(400).render('Error', { errorMessage: e });
	}

	//rending court review page
	res.render('Error', { errorMessage: 'Error: Court not found' });
});

export default router;
