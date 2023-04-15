import { ObjectId } from 'mongodb';

// Validates age inputs.
function checkAge(ageVal, varName) {
	if (!ageVal) throw `Error: You must supply a ${varNmae}.`;
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

//Validates boolean inputs
function checkBoolean(boolVal, varName) {
	if (boolVal === 'undefined') throw `Error: You must supply a ${varName}.`;
	if (typeof boolVal !== 'boolean') throw `Error: ${varName} should be a boolean.`;
	return boolVal;
}

// Validates comment inputs.
function checkComment(comment, varName) {
	if (!comment) throw `Error: You must supply a ${varName}.`;
	if (typeof comment !== 'string') throw `Error: ${varName} should be a string.`;
	comment = comment.trim();
	if (comment.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	if (comment.length > 300) throw `Error: ${varName} cannot be longer than 300 characters.`;
	return comment;
}

// Validates date inputs.
function checkDate(dateVal, varName) {
	if (!dateVal) throw `Error: You must supply a ${varName}.`;
	if (typeof dateVal !== 'string') throw `Error: ${varName} should be a string.`;
	dateVal = dateVal.trim();
	if (dateVal.length === 0)
		throw `Error: ${varName} cannot be an empty string or string with just spaces`;
	let date_array = dateVal.split('/');
	if (date_array[0].length !== 2 || date_array[1].length !== 2 || date_array[2].length !== 4)
		throw 'Error: invalid date format.';
	if (date_array.length !== 3) throw 'Error: invalid date format.';
	let month = Number(date_array[0]);
	let day = Number(date_array[1]);
	let year = Number(date_array[2]);
	if (year == NaN || month == NaN || day == NaN) throw 'Error: invalid date format.';

	// Checks the valid range of values for month.
	if (month < 1 || month > 12) throw 'Error: invalid month.';

	// Checks the correct number of days based on the month.
	if (month === 1) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 2) {
		if (day > 28 || day < 1) throw 'Error: day range.';
	}
	if (month === 3) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 4) {
		if (day > 30 || day < 1) throw 'Error: day range.';
	}
	if (month === 5) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 6) {
		if (day > 30 || day < 1) throw 'Error: day range.';
	}
	if (month === 7) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 8) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 9) {
		if (day > 30 || day < 1) throw 'Error: day range.';
	}
	if (month === 10) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}
	if (month === 11) {
		if (day > 30 || day < 1) throw 'Error: day range.';
	}
	if (month === 12) {
		if (day > 31 || day < 1) throw 'Error: day range.';
	}

	// Checks that the year is valid format (current - current yr. + 1)
	let current_year = new Date().getFullYear();
	if (!Number.isInteger(year) || year > current_year + 1 || year < current_year)
		throw 'Error: year outside of allowed range.';
	return dateVal;
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

// Validates id inputs.
function checkID(idVal, varName) {
	if (!idVal) throw `Error: You must provide an ${varName} to search for`;
	if (typeof idVal !== 'string') throw `Error: ${varName} must be a string`;
	if (idVal.trim().length === 0)
		throw `Error: ${varName} cannot be an empty string or just spaces`;
	idVal = idVal.trim();
	if (!ObjectId.isValid(idVal)) throw 'Error: invalid object ID';
	return idVal;
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

// Validates number inputs.
function checkMaxPlayer(numberVal, varName) {
	if (!numberVal) throw `Error: You must supply a ${varName}.`;
	if (typeof numberVal !== 'number') throw `Error: ${varName} should be a number.`;
	if (numberVal === NaN) throw `Error: ${varName} cannot be NaN.`;
	if (numberVal < 0 || numberVal > 10) throw `Error: invalid range provided for ${varName}.`;
	return numberVal;
}

// Validates number inputs
function checkNumber(numVal, varName) {
	if (!numVal) throw `Error: You must supply a ${varName}.`;
	if (typeof numVal !== 'number') throw `Error: ${varName} should be a number.`;
	if (numVal === NaN) throw `Error: ${varName} age cannot be NaN.`;
	return numVal;
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

// Validates ratings.
function checkRatingNumber(numVal, varName) {
	if (!numVal) throw `Error: You must supply a ${varName}!`;
	if (typeof numVal !== 'number') throw `Error: ${varName} must be a number!`;
	if (numVal > 5 || numVal < 1) throw `Error: ${varName} must be a number between 1-5!`;
	if (isNaN(numVal))
		throw `Error: ${numVal} is not a valid value for ${varName} as it only contains digits`;
	if (numVal !== numVal) throw `Error ${numVal} cannot be NaN`;
	return numVal;
}

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

export {
	checkAge,
	checkBio,
	checkBoolean,
	checkComment,
	checkDate,
	checkEmail,
	checkID,
	checkImgLink,
	checkMaxPlayer,
	checkNumber,
	checkPassword,
	checkRatingNumber,
	checkString,
	checkTime,
};
