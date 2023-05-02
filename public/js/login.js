// Validates email inputs.
function checkEmail(emailVal, varName) {
	let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!emailVal) throw `Error: You must supply a ${varName}.`;
	if (typeof emailVal !== 'string') throw `Error: ${varName} should be a string.`;
	emailVal = emailVal.trim();
	if (emailVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!emailVal.includes('@')) throw `Error: ${varName} is not a valid email.`;
	if (!emailVal.match(mailformat)) throw `Error: ${varName} is not a valid email.`;
	return emailVal;
}

// Validates password inputs.
function checkPassword(passwordVal, varName) {
	// Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.
	let passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
	if (!passwordVal) throw `Error: You must supply a ${varName}.`;
	if (typeof passwordVal !== 'string') throw `Error: ${varName} should be a string.`;
	passwordVal = passwordVal.trim();
	if (passwordVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (passwordVal.length < 8) throw `Error: ${varName} must be at least 8 characters.`;
	if (passwordVal.length > 30) throw `Error: ${varName} cannot be longer than 50 characters.`;
	if (!passwordVal.match(passwordFormat))
		throw `Error: ${varName} must contain at least one lowercase letter, one uppercase letter, one number, and one special character.`;
	return passwordVal;
}

// Get the ID of the registration form.
const loginForm = document.getElementById('login-form');

// If registration form exists.
if (loginForm) {
	// Gets the values from the form.
	const emailAddress = document.getElementById('email');
	const userPassword = document.getElementById('password');
	const errorContainer = document.getElementById('error-container');
	const routeErrorWrapper = document.getElementById('route-error-wrapper');
	const list = document.createElement('dl');
	let error_array = [];

	// Event listener for submit button.
	loginForm.addEventListener('submit', (event) => {
		console.log('Form fires');

		try {
			// Sets error container to empty.
			errorContainer.innerHTML = '';
			list.innerHTML = '';
			routeErrorWrapper.innerHTML = '';
			error_array = [];

			// Validates the email.
			try {
				let email = checkEmail(emailAddress.value, 'email');
			} catch (e) {
				error_array.push(e);
				emailAddress.style.borderColor = 'red';
			}

			// Validates the password.
			try {
				let pass = checkPassword(userPassword.value, 'password');
			} catch (e) {
				error_array.push(e);
				userPassword.style.borderColor = 'red';
			}

			// Throws if there are errors in the validation.
			if (error_array.length > 0) {
				throw 'There are errors.';
			}
		} catch (e) {
			// Prevents the server from getting bad input.
			event.preventDefault();

			// Creates an error message and appends.
			errorContainer.removeAttribute('hidden');
			let errorMessage = null;
			for (let i = 0; i < error_array.length; i++) {
				console.log(error_array[i]);
				errorMessage = document.createElement('dt');
				errorMessage.innerHTML = error_array[i];
				list.appendChild(errorMessage);
				errorMessage.style.color = 'red';
			}
			errorContainer.appendChild(list);
		}
	});
}
