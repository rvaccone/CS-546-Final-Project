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
	if (!bioVal) throw `Error: You must supply a ${varName}.`;
	if (typeof bioVal !== 'string') throw `Error: ${varName} should be a string.`;
	bioVal = bioVal.trim();
	if (bioVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
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
	// TODO: Check with TA if I should try to connect to image source to see if it exists.
	return imgLinkVal;
}

const editProfileForm = document.getElementById('editProfile-form');

if (editProfileForm) {
	// Get the values from the form.
	const firstName = document.getElementById('firstNameInput');
	const lastName = document.getElementById('lastNameInput');
	const email = document.getElementById('emailAddressInput');
	const password = document.getElementById('passwordInput');
	const age = document.getElementById('ageInput');
	const bio = document.getElementById('bioInput');
	const imgLink = document.getElementById('imgLinkInput');
	const errorContainer = document.getElementById('error-container');
	const routeErrorWrapper = document.getElementById('route-error-wrapper');
	const list = document.createElement('dl');
}
