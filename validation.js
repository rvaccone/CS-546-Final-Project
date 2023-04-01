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

function checkAge(ageVal, varName) {
	if (!ageVal) throw `Error: You must supply a ${varNmae}.`;
	if (typeof ageVal !== 'number') throw `Error: ${varName} should be a number.`;
	if (ageVal === NaN) throw `Error: ${varName} age cannot be NaN.`;
	if (ageVal < 13 || ageVal > 100) throw `Error: ${varName} is out of valid range.`;
	return ageVal;
}

export { checkAge, checkString };
