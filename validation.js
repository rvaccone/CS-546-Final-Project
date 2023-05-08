import { ObjectId } from "mongodb";
import Moment from "moment";

// Validates age inputs.
function checkAge(ageVal, varName) {
  if (!ageVal) throw `Error: You must supply a ${varNmae}.`;
  if (typeof ageVal !== "number") throw `Error: ${varName} should be a number.`;
  if (ageVal === NaN) throw `Error: ${varName} age cannot be NaN.`;
  if (ageVal < 13 || ageVal > 100)
    throw `Error: ${varName} is out of valid range.`;
  return ageVal;
}

// Validates bio inputs.
function checkBio(bioVal, varName) {
  if (!bioVal) throw `Error: You must supply a ${varName}.`;
  if (typeof bioVal !== "string") throw `Error: ${varName} should be a string.`;
  bioVal = bioVal.trim();
  if (bioVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (bioVal.length > 500)
    throw `Error: ${varName} cannot be longer than 500 characters.`;
  return bioVal;
}

//Validates boolean inputs
function checkBoolean(boolVal, varName) {
  if (boolVal === "undefined") throw `Error: You must supply a ${varName}.`;
  if (typeof boolVal !== "boolean")
    throw `Error: ${varName} should be a boolean.`;
  return boolVal;
}

// Validates comment inputs.
function checkComment(comment, varName) {
  if (!comment) throw `Error: You must supply a ${varName}.`;
  if (typeof comment !== "string")
    throw `Error: ${varName} should be a string.`;
  comment = comment.trim();
  if (comment.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (comment.length > 280)
    throw `Error: ${varName} cannot be longer than 280 characters.`;
  return comment;
}

// Validates date inputs.
function checkDate(date, varName) {
  if (!date) throw `Error: You must supply a ${varName}!`;
  if (typeof date !== "string") throw `Error: ${varName} must be a string!`;
  date = date.trim();
  if (date.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(date))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  let dateRegex =
    /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;

  if (!date.match(dateRegex)) throw "enter a valid date format of mm/dd/yyyy";

  if (!Moment(date, "MM/DD/YYYY", true).isValid()) throw "enter a valid date";
  // checking if 1990 < releaseDate < currentYear+1
  let minYear = 1900;
  let maxYear = new Date();
  maxYear = maxYear.getFullYear() + 1;
  let RD = new Date(date);
  let RY = RD.getFullYear();
  if (RY < minYear || RY > maxYear)
    throw "releaseDate entered is not within range 1900-2024";
  return date;
}

// Validates email inputs.
function checkEmail(emailVal, varName) {
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailVal) throw `Error: You must supply a ${varName}.`;
  if (typeof emailVal !== "string")
    throw `Error: ${varName} should be a string.`;
  emailVal = emailVal.trim();
  if (emailVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!emailVal.includes("@")) throw `Error: ${varName} is not a valid email.`;
  if (!emailVal.match(mailformat))
    throw `Error: ${varName} is not a valid email.`;
  return emailVal;
}

// Validates id inputs.
function checkID(idVal, varName) {
  if (!idVal) throw `Error: You must provide an ${varName} to search for`;
  if (typeof idVal !== "string") throw `Error: ${varName} must be a string`;
  if (idVal.trim().length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  idVal = idVal.trim();
  if (!ObjectId.isValid(idVal)) throw "Error: invalid object ID";
  return idVal;
}

// Validates image link inputs.
function checkImgLink(imgLinkVal, varName) {
  if (!imgLinkVal) throw `Error: You must supply a ${varName}.`;
  if (typeof imgLinkVal !== "string")
    throw `Error: ${varName} should be a string.`;
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
  //input from form comes as a str
  if (!numberVal) throw `Error: You must supply a ${varName}.`;
  numberVal = parseInt(numberVal);
  if (typeof numberVal !== "number")
    throw `Error: ${varName} should be a number.`;
  if (numberVal === NaN) throw `Error: ${varName} cannot be NaN.`;
  if (numberVal < 0 || numberVal > 10)
    throw `Error: invalid range provided for ${varName}.`;
  return numberVal;
}

// Validates number inputs
function checkNumber(numVal, varName) {
  if (!numVal) throw `Error: You must supply a ${varName}.`;
  if (typeof numVal !== "number") throw `Error: ${varName} should be a number.`;
  if (numVal === NaN) throw `Error: ${varName} age cannot be NaN.`;
  return numVal;
}

// Validates the number of courts
function checkNumCourts(numVal, varName) {
  // Check that the numVal is a number
  numVal = checkNumber(numVal, varName);

  // Check that the number is between 1 and 10
  if (numVal < 1 || numVal > 10) throw `Invalid range provided for ${varName}`;

  // Return the number
  return numVal;
}

// Validates password inputs.
function checkPassword(passwordVal, varName) {
  // Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.
  let passwordFormat =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
  if (!passwordVal) throw `Error: You must supply a ${varName}.`;
  if (typeof passwordVal !== "string")
    throw `Error: ${varName} should be a string.`;
  passwordVal = passwordVal.trim();
  if (passwordVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (passwordVal.length < 8)
    throw `Error: ${varName} must be at least 8 characters.`;
  if (passwordVal.length > 30)
    throw `Error: ${varName} cannot be longer than 50 characters.`;
  if (!passwordVal.match(passwordFormat))
    throw `Error: ${varName} must contain at least one lowercase letter, one uppercase letter, one number, and one special character.`;
  return passwordVal;
}

// Validates ratings.
function checkRatingNumber(numVal, varName) {
  if (!numVal) throw `Error: You must supply a ${varName}!`;
  if (typeof numVal !== "number") throw `Error: ${varName} must be a number!`;
  if (numVal > 5 || numVal < 1)
    throw `Error: ${varName} must be a number between 1-5!`;
  if (isNaN(numVal))
    throw `Error: ${numVal} is not a valid value for ${varName} as it only contains digits`;
  if (numVal !== numVal) throw `Error ${numVal} cannot be NaN`;
  return numVal;
}

// Validates string inputs.
function checkString(strVal, varName) {
  if (!strVal) throw `You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

// Validates name inputs
function checkName(nameVal, varName) {
  // Check that the name is a proper string
  nameVal = checkString(nameVal, varName);

  // Check that the name only contains letters
  let string_format = /^[a-zA-Z]+$/;
  if (!strVal.match(string_format))
    throw `Error: ${varName} must be a valid string!`;

  // Return the name
  return nameVal;
}

//checks time
function checkTime(timeVal, varName) {
  if (!timeVal) throw `Error: You must supply a ${varName}!`;
  if (typeof timeVal !== "string") throw `Error: ${varName} must be a string!`;
  timeVal = timeVal.trim();
  if (timeVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!timeVal.match(/^(0?[1-9]|1[0-2]):([0-5][0-9]) ([AP]M)$/i))
    throw `Error: ${varName} is not a valid time!`;
  return timeVal;
}

function isValidNYCZipCode(zipCode, varName) {
  if (!zipCode) throw `You must supply a ${varName}!`;
  if (typeof zipCode !== "string") throw `${varName} must be a string!`;
  zipCode = zipCode.trim();
  if (zipCode.length === 0)
    throw `${varName} cannot be an empty string or string with just spaces`;
  if (!/^\d{5}$/.test(zipCode)) throw `${varName} is not a valid zip code!`;
  function isZipCodeInRange(zipCode) {
    const zip = parseInt(zipCode);
    if (
      (zip >= 10001 && zip <= 10282) ||
      (zip >= 10301 && zip <= 10314) ||
      (zip >= 10451 && zip <= 10475) ||
      (zip >= 11004 && zip <= 11109) ||
      (zip >= 11351 && zip <= 11697) ||
      (zip >= 11201 && zip <= 11256)
    ) {
      return true;
    }
    return false;
  }
  if (!isZipCodeInRange(zipCode))
    throw `${varName} is not a valid zip code for New York City!`;
  return zipCode;
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
  checkNumCourts,
  checkPassword,
  checkRatingNumber,
  checkString,
  checkTime,
  isValidNYCZipCode,
};
