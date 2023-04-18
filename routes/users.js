import { Router } from 'express';
const router = Router();
import { usersData } from '../data/index.js';
import * as validation from '../validation.js';

// TODO: router.route("/login") and router.route("/logout")

router
	.route('/')

	// Sign-Up Route
	.post(async (req, res) => {
		const newUserData = req.body;

		// Checks to see if the req.body is empty.
		if (!newUserData || Object.keys(newUserData).length === 0) {
			return res.status(400).json({ error: 'There are no fields in the request body' });
		}

		// Checks to see if the correct number of fields were returned.
		if (Object.keys(newUserData).length !== 7) {
			return res.status(400).json({ error: 'The schema does not match the database.' });
		}

		// Validates the input.
		try {
			newUserData.firstName = validation.checkString(newUserData.firstName, 'firstName');
			newUserData.lastName = validation.checkString(newUserData.lastName, 'lastName');
			newUserData.email = validation.checkEmail(newUserData.email, 'email');
			newUserData.password = validation.checkPassword(newUserData.password, 'password');
			newUserData.age = validation.checkAge(newUserData.age, 'age');
			newUserData.bio = validation.checkBio(newUserData.bio, 'bio');
			newUserData.imgLink = validation.checkImgLink(newUserData.imgLink, 'imgLink');
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		// Creates a new user.
		try {
			const { firstName, lastName, email, password, age, bio, imgLink } = newUserData;
			const newUser = await usersData.create(
				firstName,
				lastName,
				email,
				password,
				age,
				bio,
				imgLink
			);
			res.status(200).json(newUser);
		} catch (e) {
			console.log(e);
			res.status(500).json({ error: e });
		}
	});

router
	.route('/:id')

	// Edit Profile Route
	.put(async (req, res) => {
		const updatedUser = req.body;

		// Checks if the req.body is empty.
		if (!updatedUser || Object.keys(updatedUser).length === 0) {
			return res.status(400).json({ error: 'There are no fields in the request body' });
		}

		// Checks to see if the correct number of fields were returned.
		if (Object.keys(updatedUser).length !== 7) {
			return res.status(400).json({ error: 'The schema does not match the database.' });
		}

		// Validates the input.
		try {
			updatedUser.firstName = validation.checkString(updatedUser.firstName, 'firstName');
			updatedUser.lastName = validation.checkString(updatedUser.lastName, 'lastName');
			updatedUser.email = validation.checkEmail(updatedUser.email, 'email');
			updatedUser.password = validation.checkPassword(updatedUser.password, 'password');
			updatedUser.age = validation.checkAge(updatedUser.age, 'age');
			updatedUser.bio = validation.checkBio(updatedUser.bio, 'bio');
			updatedUser.imgLink = validation.checkImgLink(updatedUser.imgLink, 'imgLink');
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		// Preforms the data function.
		try {
			const updatedUserData = await usersData.update(
				req.params.id,
				updatedUserData.firstName,
				updatedUserData.lastName,
				updatedUserData.email,
				updatedUserData.password,
				updatedUserData.age,
				updatedUserData.bio,
				updatedUserData.imgLink
			);
			res.status(200).json(updatedUserData);
		} catch (e) {
			res.status(500).json({ error: e });
		}
	});

export default router;
