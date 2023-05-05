
// Validates date inputs.
function checkDate(date, varName) {
	if (!date) throw `Error: You must supply a ${varName}!`;
	if (typeof date !== 'string') throw `Error: ${varName} must be a string!`;
	date = date.trim();
	if (date.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!isNaN(date))
		throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
	let dateRegex = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;

	if (!date.match(dateRegex)) throw 'enter a valid date format of mm/dd/yyyy';

	if (!Moment(date, 'MM/DD/YYYY', true).isValid()) throw 'enter a valid date';
	// checking if 1990 < releaseDate < currentYear+1
	let minYear = 1900;
	let maxYear = new Date();
	maxYear = maxYear.getFullYear() + 1;
	let RD = new Date(date);
	let RY = RD.getFullYear();
	if (RY < minYear || RY > maxYear) throw 'releaseDate entered is not within range 1900-2024';
	return date;
}

// Validates number inputs.
function checkMaxPlayer(numberVal, varName) {
	//input from form comes as a str
	if (!numberVal) throw `Error: You must supply a ${varName}.`;
	numberVal = parseInt(numberVal);
	if (typeof numberVal !== 'number') throw `Error: ${varName} should be a number.`;
	if (numberVal === NaN) throw `Error: ${varName} cannot be NaN.`;
	if (numberVal < 0 || numberVal > 10) throw `Error: invalid range provided for ${varName}.`;
	return numberVal;
}

//checks time
function checkTime(timeVal, varName) {
	if (!timeVal) throw `Error: You must supply a ${varName}!`;
	if (typeof timeVal !== 'string') throw `Error: ${varName} must be a string!`;
	timeVal = timeVal.trim();
	if (timeVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!timeVal.match(/^(0?[1-9]|1[0-2]):([0-5][0-9]) ([AP]M)$/i))
		throw `Error: ${varName} is not a valid time!`;
	return timeVal;
}

// Get the form element
// Get the form element
document.addEventListener('DOMContentLoaded', () => {
  const creategameForm = document.getElementById('createGame-form');
  if (creategameForm) {
    // Get the form inputs
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const maxPlayersInput = document.getElementById('maxPlayers');
    const errorContainer = document.getElementById('error-container');
    let error_array = [];

    console.log('Adding event listener for form submission');

    // Add an event listener for form submission
    creategameForm.addEventListener('submit', (event) => {
      console.log('Form fires creategame');

      try {
        // Clear previous error messages
        errorContainer.innerHTML = '';
        // Keep track of any errors
        error_array = [];

        try {
          // Validate the date input
          const date = checkDate(dateInput.value, 'date');
        } catch (e) {
          error_array.push(e);
          dateInput.style.borderColor = 'red';
        }

        try {
          // Validate the time input
          const time = checkTime(timeInput.value, 'time');
        } catch (e) {
          error_array.push(e);
          timeInput.style.borderColor = 'red';
        }

        try {
          // Validate the maximum players input
          const maxPlayers = checkMaxPlayer(maxPlayersInput.value, 'maxPlayers');
        } catch (e) {
          error_array.push(e);
          maxPlayersInput.style.borderColor = 'red';
        }

        // If there are errors, prevent form submission and display them
        if (error_array.length > 0) {
          throw 'There are errors.';
        }
      } catch (e) {
        event.preventDefault();

        // Creates an error message and appends.
        errorContainer.removeAttribute('hidden');
        let errorMessage = null;
        let list = document.createElement('ul');
        for (let i = 0; i < error_array.length; i++) {
          errorMessage = document.createElement('li');
          errorMessage.innerHTML = error_array[i];
          errorMessage.style.color = 'red';
          list.appendChild(errorMessage);
        }
        errorContainer.appendChild(list);
      }
    });
  }
});
