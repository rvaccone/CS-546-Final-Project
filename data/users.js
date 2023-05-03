import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../_utils/validation.js';
import bcrypt from 'bcrypt';
const saltRounds = 1;

// Creates a new user and logs it in the users collection.
const create = async (firstName, lastName, email, password, age) => {
	firstName = validation.checkString(firstName, 'firstName');
	lastName = validation.checkString(lastName, 'lastName');
	email = validation.checkEmail(email, 'email');
	password = validation.checkPassword(password, 'password');
	age = validation.checkAge(age, 'age');

	// Hashes password.
	let hashedPassword = await bcrypt.hash(password, saltRounds);

	// Initalizes a newUser.
	let newUser = {
		firstName: firstName,
		lastName: lastName,
		email: email.toLowerCase(),
		password: hashedPassword,
		age: age,
		bio: '',
		imgLink:
			'https://img.freepik.com/premium-vector/basketball_319667-191.jpg',
	};
	// Waits for collection and attempts to insert newUser.
	const userCollection = await users();

	// Checks if email is already registered.
	const userEmails = await userCollection
		.find({})
		.project({ _id: 0, email: 1 })
		.toArray();
	userEmails.forEach((user) => {
		if (user.email.toLowerCase() === newUser.email.toLowerCase())
			throw 'Error: Email already registered.';
	});

	// Inserts new user into collection.
	const insertInfo = await userCollection.insertOne(newUser);

	// Checks if newUser was inserted properly.
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw 'Error: band could not be inserted.';

	// Sets the id of the newUser to a string and returns user.
	const newId = insertInfo.insertedId.toString();
	const user = await get(newId);
	return user;
};

// Gets all users from the users collection.
const getAll = async () => {
	const userCollection = await users();
	// This gives us the data as an array of obejcts from the database.
	let userList = await userCollection
		.find({})
		.project({ _id: 1, name: 1 })
		.toArray();
	if (!userList) throw 'Could not get all users.';
	userList = userList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return userList;
};

// Gets a user from the users collection.
const get = async (id) => {
	id = validation.checkID(id, 'id');
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (user === null) throw 'No user with that id';
	user._id = user._id.toString();
	return user;
};

// Removes a user from the users collection.
const remove = async (id) => {
	id = validation.checkID(id, 'id');
	const userCollection = await users();
	const deletionInfo = await userCollection.findOneAndDelete({
		_id: new ObjectId(id),
	});

	// checks for the number of documents affected
	if (deletionInfo.lastErrorObject.n === 0) {
		throw `Could not delete band with id of ${id}`;
	}
	return { userID: id, deleted: true };
};

// Updates a user in the users collection.
const update = async (
	id,
	firstName,
	lastName,
	email,
	password,
	age,
	bio,
	imgLink
) => {
	firstName = validation.checkString(firstName, 'firstName');
	lastName = validation.checkString(lastName, 'lastName');
	email = validation.checkEmail(email, 'email');
	password = validation.checkPassword(password, 'password');
	age = validation.checkAge(age, 'age');

	// Makes the bio input optional.
	if (bio.trim() == '') {
		bio = '';
	} else {
		bio = validation.checkBio(bio, 'bio');
	}

	imgLink = validation.checkImgLink(imgLink, 'imgLink');

	const user = await get(id);
	let isSamePassword = await bcrypt.compare(password, user.password);
	if (
		user.firstName === firstName &&
		user.lastName === lastName &&
		user.email === email &&
		isSamePassword &&
		user.age === age &&
		user.bio === bio &&
		user.imgLink === imgLink
	)
		throw 'Error: cannot update record with the same set of values.';

	// Hashes password.
	let hashedPassword = await bcrypt.hash(password, saltRounds);

	// Preforms an update on the band.
	const updateUser = {
		firstName: firstName,
		lastName: lastName,
		email: email.toLowerCase(),
		password: hashedPassword,
		age: age,
		bio: bio,
		imgLink: imgLink,
	};

	// Await the collection of the user.
	const userCollection = await users();

	// Checks if email is already registered.
	if (user.email.toLowerCase() !== updateUser.email.toLowerCase()) {
		const userEmails = await userCollection
			.find({})
			.project({ _id: 0, email: 1 })
			.toArray();
		userEmails.forEach((user) => {
			if (user.email.toLowerCase() === updateUser.email.toLowerCase())
				throw 'Error: Email already registered.';
		});
	}

	const updatedInfo = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: updateUser },
		{ returnDocument: 'after' }
	);

	// Checks if there is an error with updating the record.
	if (updatedInfo.lastErrorObject.n === 0) {
		throw 'could not update band successfully';
	}
	updatedInfo.value._id = new ObjectId(updatedInfo.value._id).toString();
	return updatedInfo.value;
};

// Checks user credentials.
const checkUser = async (emailAddress, password) => {
	// Validates the inputs.
	emailAddress = validation.checkEmail(emailAddress, 'email address');
	password = validation.checkPassword(password, 'password');

	// Gets the users collection.
	const usersCollection = await users();

	// Gets the user with the matching email.
	const user = await usersCollection.findOne({
		email: emailAddress.toLowerCase(),
	});
	if (user == null) {
		throw 'Error: Either the email address or password is invalid.';
	}

	// Checks if the password matches the hashed password.
	const match = await bcrypt.compare(password, user.password);
	if (match) {
		// Returns user information.
		return {
			_id: user._id.toString(),
			firstName: user.firstName,
			lastName: user.lastName,
			emailAddress: user.email,
			age: user.age,
			bio: user.bio,
			imgLink: user.imgLink,
		};
	} else {
		throw 'Error: Either the email address or password is invalid.';
	}
};

// Function to retrieve a user's first and last name
const getFullName = async (userID) => {
	// Validate the input
	userID = validation.checkID(userID, 'userID');

	// Check that the user exists
	const user = await get(userID);
	if (!user) throw `Error: No user with id ${userID} exists`;

	// Return the user's full name
	return `${user.firstName} ${user.lastName}`;
};

export { create, getAll, get, remove, update, checkUser, getFullName };
