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

// Validates email inputs.
function checkEmail(emailVal, varName) {
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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

export { checkAge, checkBio, checkEmail, checkID, checkImgLink, checkString };
