// Import the validation functions
import * as validation from '../../validation.js';

// Get the create comment form
const createReviewForm = document.getElementById('reviewForm');

// Check that the form exists before adding the event listener
if (createReviewForm) {
	// Get the values from the form
	const courtReview = document.getElementById('courtReview');
	const courtRating = document.getElementById('rating');

	// Get the error container
	const errorContainer = document.getElementById('error-container');

	// Create a list for the errors
	const list = document.createElement('dl');

	// Create an array to hold the errors
	let errors = [];

	// Add an event listener for the submit button
	createReviewForm.addEventListener('submit', (event) => {
		// Clear previous errors
		errors = [];

		// Set the error container to empty
		errorContainer.innerHTML = '';
		list.innerHTML = '';

		// Validate the review
		try {
			validation.checkComment(courtReview.value, 'courtReview');
		} catch (e) {
			errors.push(e);
		}

		// Validate the rating
		try {
			validation.checkRatingNumber(courtRating.value, 'courtRating');
		} catch (e) {
			errors.push(e);
		}

		// If there are errors, prevent the form from submitting and display the errors
		if (errors.length > 0) {
			// Prevent the form from submitting
			event.preventDefault();

			// Remove the hidden attribute from the error container
			errorContainer.removeAttribute('hidden');

			// Create an error dt for later use
			let errorItem = null;

			// Display the errors
			for (let error in errors) {
				// Log the error to the console
				console.log(error);

				// Create a list item for the error
				errorItem = document.createElement('dt');
				errorItem.innerHTML = error;

				// Add the error to the list
				list.appendChild(errorItem);
			}
			// Add the list to the error container
			errorContainer.appendChild(list);
		}
	});
}
