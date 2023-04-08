import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new user and logs it in the users collection.
const create = async (firstName, lastName, email, password, age, bio, imgLink) => {
	firstName = validation.checkString(firstName, 'firstName');
	lastName = validation.checkString(lastName, 'lastName');
	email = validation.checkEmail(email, 'email');
	// TODO: preform checks for password & use bcrypt to hash it.
	age = validation.checkAge(age, 'age');
	bio = validation.checkBio(bio, 'bio');
	imgLink = validation.checkImgLink(imgLink, 'imgLink');

	// Initalizes a newUser.
	let newUser = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: password,
		age: age,
		bio: bio,
		imgLink: imgLink,
	};
	// Waits for collection and attempts to insert newUser.
	const userCollection = await users();
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
	let userList = await userCollection.find({}).project({ _id: 1, name: 1 }).toArray();
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
const update = async (id, firstName, lastName, email, password, age, bio, imgLink) => {
	firstName = validation.checkString(firstName, 'firstName');
	lastName = validation.checkString(lastName, 'lastName');
	email = validation.checkEmail(email, 'email');
	// TODO: preform checks for password & use bcrypt to hash it.
	age = validation.checkAge(age, 'age');
	bio = validation.checkBio(bio, 'bio');
	imgLink = validation.checkImgLink(imgLink, 'imgLink');

	const user = await get(id);
	if (
		user.firstName === firstName &&
		user.lastName === lastName &&
		user.email === email &&
		user.password === password &&
		user.age === age &&
		user.bio === bio &&
		user.imgLink === imgLink
	)
		throw 'Error: cannot update record with the same set of values.';

	// Preforms an update on the band.
	const updateUser = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: password,
		age: age,
		bio: bio,
		imgLink: imgLink,
	};

	// Await the collection of the user.
	const userCollection = await users();
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

export { create, getAll, get, remove, update };
