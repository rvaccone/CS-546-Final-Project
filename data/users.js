import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

const create = async (firstName, lastName, email, password, age, bio, imgLink) => {
	firstName = validation.checkString(firstName, firstName);
	lastName = validation.checkString(lastName, lastName);
	// TODO: preform checks for email.
	// TODO: preform checks for password & use bcrypt to hash it.
	age = validation.checkAge(age, age);
	// TODO: preform checks on bio.

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
	// Waits for collection and attempts to insert newBand.
	const userCollection = await users();
	const insertInfo = await userCollection.insertOne(newUser);
	// Checks if newBand was inserted properly.
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw 'Error: band could not be inserted.';

	const newId = insertInfo.insertedId.toString();
	const user = await get(newId);
	return user;
};

const getAll = async () => {
	const userCollection = await users();
	// This gives us the data as an array of obejcts from the database.
	let userList = await userCollection.find({}).project({ _id: 1, name: 1 }).toArray();
	if (!userList) throw 'Could not get all bands.';
	userList = userList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return userList;
};

const get = async (id) => {
	id = checkId(id);
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (user === null) throw 'Error: No user with that id.';
	user._id = user._id.toString();
	return user;
};

const remove = async (id) => {};

const update = async (id, firstName, lastName, email, password, age, bio, imgLink) => {};
