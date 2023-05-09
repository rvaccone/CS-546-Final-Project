// Import the data functions from games
import * as games_functions from '../data/games.js';

// Creating variables for the document elements
let gamesDiv = document.getElementById('pickUpDiv');
let gamesButton = document.getElementById('pick-up-games-btn');

// Checking that the button exists
if (gamesButton) {
	// Adding an event listener to the button
	gamesButton.addEventListener('submit', (e) => {
		// Preventing the default action of the button
		e.preventDefault();

		// Get all the trending games
		let trendingGames = games_functions.getAllTrending();
	});
}
