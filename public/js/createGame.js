// Validation functions
// Validates string inputs.
function checkString(strVal, varName) {
	if (!strVal) throw `Error: You must supply a ${varName}!`;
	if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
	strVal = strVal.trim();
	if (strVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!isNaN(strVal))
		throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
	return strVal;
}

// Validates date inputs.
function checkDate(date, varName) {
	if (!date) throw `Error: You must supply a ${varName}!`;
	if (typeof date !== 'string') throw `Error: ${varName} must be a string!`;
	date = date.trim();
	if (date.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!isNaN(date))
		throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
	let dateRegex = /^20\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

	if (!date.match(dateRegex)) throw 'enter a valid date';

	// checking if 1990 < releaseDate < currentYear+1
	let minYear = 1900;
	let maxYear = new Date();
	maxYear = maxYear.getFullYear() + 1;
	let RD = new Date(date);
	let RY = RD.getFullYear();
	if (RY < minYear || RY > maxYear)
		throw 'releaseDate entered is not within range 1900-2024';
	return date;
}

//checks time
function checkTime(timeVal, varName) {
	if (!timeVal) throw `Error: You must supply a ${varName}!`;
	if (typeof timeVal !== 'string')
		throw `Error: ${varName} must be a string!`;
	timeVal = timeVal.trim();
	if (timeVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!timeVal.match(/^(0?[1-9]|1[0-2]):([0-5][0-9]) ([AP]M)$/i))
		throw `Error: ${varName} is not a valid time!`;
	return timeVal;
}

// Validates number inputs.
function checkMaxPlayer(numberVal, varName) {
	//input from form comes as a str
	if (!numberVal) throw `Error: You must supply a ${varName}.`;
	numberVal = parseInt(numberVal);
	if (typeof numberVal !== 'number')
		throw `Error: ${varName} should be a number.`;
	if (numberVal === NaN) throw `Error: ${varName} cannot be NaN.`;
	if (numberVal < 0 || numberVal > 15)
		throw `Error: invalid range provided for ${varName}.`;
	return numberVal;
}

// Get the create game form
let createGameForm = document.getElementById('createGameForm');

// Create a list for the errors
const list = document.createElement('dl');

// Check that the form exists before adding the event listener
if (createGameForm) {
	// Get the values from the form
	let courtIdInput = document.getElementById('courtId');
	let dateInput = document.getElementById('date');
	let timeInput = document.getElementById('time');
	let maxPlayersInput = document.getElementById('maxPlayers');

	// Get the error container
	const errorContainer = document.getElementById('error-container');

	// Create an array to hold the errors
	let errors = [];

	// Add an event listener for the submit button
	createGameForm.addEventListener('submit', (event) => {
		// Clear the previous errors
		errors = [];

		// Set the error container to empty
		errorContainer.innerHTML = '';
		list.innerHTML = '';

		// Validate the court ID
		let courtId = null;
		try {
			courtId = checkString(courtIdInput.value, 'courtId');
		} catch (e) {
			errors.push(e);
		}

		// Validate the date
		try {
			checkDate(dateInput.value, 'date');
		} catch (e) {
			errors.push(e);
		}

		// Validate the time
		try {
			checkTime(timeInput.value, 'time');
		} catch (e) {
			errors.push(e);
		}

		// Validate the max players
		try {
			checkMaxPlayer(maxPlayersInput.value, 'maxPlayers');
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
			for (let error of errors) {
				// Log the error to the console
				console.log(error);

				// Create a list item for the error
				errorItem = document.createElement('dt');
				errorItem.innerHTML = error;

				// Add the error to the list
				list.appendChild(errorItem);

				// Style the color to red
				errorItem.style.color = 'red';
			}
			// Add the list to the error container
			errorContainer.appendChild(list);
		} else {
			// Redirect back to the court details page
			window.location.href = `http://localhost:3000/courts/${courtID}`;
		}
	});
}
