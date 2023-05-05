// Import the validation functions
import * as validation from '../../validation.js';

// Get the unjoin button
const unjoinButton = document.getElementById('unjoinButton');

// Create an array to hold the errors
let errors = [];

// Check that the button exists
if (unjoinButton) {
	// Create an array to hold the errors
	errors = [];

	// Add an event listener for the unjoin button
	unjoinButton.addEventListener('click', async (event) => {
		// Get the game ID from the URL
		const currPath = window.location.pathname;
		const gameId = currPath.replace('/game/gameDetails/', '');
		console.log(gameId);

		// Validate the game ID
		try {
			validation.checkID(gameId, 'gameID');
		} catch (e) {
			errors.push(e);
		}

		// Send a DELETE request to the server
		try {
			const response = await fetch(`/game/addUser/${gameId}`, {
				method: 'DELETE',
			});
			//   const result = await response.json();
			console.log(response);
			// Reload the page to update the button
			window.location.reload();
		} catch (error) {
			console.log(error);
			errors.push(e);
		}

		// If there are errors, prevent the form from submitting and display the errors
		if (errors.length > 0) {
			// Prevent the form from submitting
			event.preventDefault();
		}
	});
}
