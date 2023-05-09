// Validates string inputs.
function checkString(strVal, varName) {
	let string_format = /^[a-zA-Z]+$/;
	if (!strVal.match(string_format)) throw `Error: ${varName} must be a valid string!`;
	if (!strVal) throw `Error: You must supply a ${varName}!`;
	if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
	strVal = strVal.trim();
	if (strVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!isNaN(strVal))
		throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
	return strVal;
}

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

// Validates age inputs.
function checkAge(ageVal, varName) {
	if (!ageVal) throw `Error: You must supply a ${varName}.`;
	if (typeof ageVal !== 'number') throw `Error: ${varName} should be a number.`;
	if (ageVal === NaN) throw `Error: ${varName} age cannot be NaN.`;
	if (ageVal < 13 || ageVal > 100) throw `Error: ${varName} is out of valid range.`;
	return ageVal;
}

// Validates bio inputs.
function checkBio(bioVal, varName) {
	bioVal = bioVal.trim();
	if (bioVal.length > 500) throw `Error: ${varName} cannot be longer than 500 characters.`;
	return bioVal;
}

// Validates image link inputs.
function checkImgLink(imgLinkVal, varName) {
	if (!imgLinkVal) throw `Error: You must supply a ${varName}.`;
	if (typeof imgLinkVal !== 'string') throw `Error: ${varName} should be a string.`;
	imgLinkVal = imgLinkVal.trim();
	if (imgLinkVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (!imgLinkVal.match(/^https?:\/\/.+\.(jpg|jpeg|png)$/))
		throw `Error: ${varName} is not a valid link.`;
	return imgLinkVal;
}

const editProfileForm = document.getElementById('edit-profile-form');

if (editProfileForm) {
	// Get the values from the form.
	const firstName = document.getElementById('firstNameInput');
	const lastName = document.getElementById('lastNameInput');
	const emailAddress = document.getElementById('emailAddressInput');
	const userPassword = document.getElementById('passwordInput');
	const userPasswordConfirm = document.getElementById('confirmPasswordInput');
	const age = document.getElementById('ageInput');
	const bio = document.getElementById('bioInput');
	const imgLink = document.getElementById('imglinkInput');
	const errorContainer = document.getElementById('error-container');
	const routeErrorWrapper = document.getElementById('route-error-wrapper');
	const list = document.createElement('dl');
	let error_array = [];

	// Add event listener to the form.
	editProfileForm.addEventListener('submit', async (event) => {
		try {
			// Sets error container to empty.
			errorContainer.innerHTML = '';
			list.innerHTML = '';
			routeErrorWrapper.innerHTML = '';
			error_array = [];

			// Validates the first name.
			try {
				let first_name = checkString(firstName.value, 'firstName');
			} catch (e) {
				error_array.push(e);
				firstName.style.borderColor = 'red';
			}

			// Validates the last name.
			try {
				let last_name = checkString(lastName.value, 'lastName');
			} catch (e) {
				error_array.push(e);
				lastName.style.borderColor = 'red';
			}

			// Validates the email.
			try {
				let user_email = checkEmail(emailAddress.value, 'email');
			} catch (e) {
				error_array.push(e);
				emailAddress.style.borderColor = 'red';
			}

			// Validates the password.
			try {
				let user_password = checkPassword(userPassword.value, 'password');
			} catch (e) {
				error_array.push(e);
				userPassword.style.borderColor = 'red';
				userPasswordConfirm.style.borderColor = 'red';
			}

			// Makes sure the passwords match.
			try {
				if (userPassword.value.trim() !== userPasswordConfirm.value.trim())
					throw `Error: Passwords do not match.`;
			} catch (e) {
				error_array.push(e);
				userPassword.style.borderColor = 'red';
			}

			// Validates the age.
			try {
				let user_age = checkAge(parseInt(age.value), 'age');
			} catch (e) {
				error_array.push(e);
			}

			// Validates the bio.
			if (bio !== null) {
				try {
					let user_bio = checkBio(bio.value, 'bio');
				} catch (e) {
					error_array.push(e);
					bio.style.borderColor = 'red';
				}
			}
			// Validates the image link.
			try {
				let user_imgLink = checkImgLink(imgLink.value, 'imgLink');
			} catch (e) {
				error_array.push(e);
				imgLink.style.borderColor = 'red';
			}

			// Trips the catch block if there are errors from above validation.
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
				errorMessage.style.color = '#ee0000';
			}
			errorContainer.appendChild(list);
		}
	});
}
