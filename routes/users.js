import { Router } from 'express';
const router = Router();
import { usersData } from '../data/index.js';
import * as users_functions from '../data/users.js';
import * as validation from '../validation.js';

// Main Route
router
	.route('/')

	.get(
		// (req, res, next) => {
		// 	if (!req.session.user) {
		// 		return res.redirect('/login');
		// 	} else if (req.session.user.role == 'admin') {
		// 		return res.redirect('/admin');
		// 	} else {
		// 		return res.redirect('/protected');
		// 	}
		// 	next();
		// },
		async (req, res) => {
			//code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
			return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
		}
	);

// Register Route
router
	.route('/register')

	// Render the registration page.
	.get(async (req, res) => {
		//code here for GET
		return res.render('register', { title: 'Register' });
	})

	// Register the new user.
	.post(async (req, res) => {
		// Get the user data from the request body.
		let error_array = [];
		const userRegistration = req.body;
		console.log(userRegistration);
		if (!userRegistration || Object.keys(userRegistration).length === 0) {
			return res
				.status(400)
				.render('register', { title: 'Register', error: 'No user data provided.' });
		}

		try {
			// Validate the first name.
			userRegistration.firstNameInput = validation.checkString(
				userRegistration.firstNameInput,
				'firstNameInput'
			);

			// Validate the last name.

			userRegistration.lastNameInput = validation.checkString(
				userRegistration.lastNameInput,
				'lastNameInput'
			);

			// Validate the email address.
			userRegistration.emailAddressInput = validation.checkEmail(
				userRegistration.emailAddressInput,
				'emailAddressInput'
			);

			// Validate the password.

			userRegistration.passwordInput = validation.checkPassword(
				userRegistration.passwordInput,
				'passwordInput'
			);

			// Validate the age.

			userRegistration.ageInput = validation.checkAge(
				Number(userRegistration.ageInput),
				'ageInput'
			);

			// Validate the bio.

			userRegistration.bioInput = validation.checkBio(userRegistration.bioInput, 'bioInput');

			// Validate the image link.

			userRegistration.imglinkInput = validation.checkImgLink(
				userRegistration.imglinkInput,
				'imglinkInput'
			);
		} catch (e) {
			return res.status(400).render('error', { error: e });
		}

		// Checks that the passwords match.
		if (userRegistration.passwordInput != userRegistration.confirmPasswordInput) {
			error_array.push('Passwords do not match.');
		}

		// Re-renders the page with errors.
		// if (error_array.length > 0) {
		// 	return res.status(400).render('error', { title: 'Register', error: error_array });
		// }
		try {
			const {
				firstNameInput,
				lastNameInput,
				emailAddressInput,
				passwordInput,
				ageInput,
				bioInput,
				imglinkInput,
			} = userRegistration;
			const newUser = await users_functions.create(
				firstNameInput,
				lastNameInput,
				emailAddressInput,
				passwordInput,
				ageInput,
				bioInput,
				imglinkInput
			);
			console.log(newUser);
			return res.status(200).redirect('login');
		} catch (e) {
			console.log(e);
			return res.status(400).render('error', { error: e });
		}
	});

// Login Route
router
	.route('/login')

	// Render the login page.
	.get(async (req, res) => {
		return res.render('login', { title: 'Login' });
	})

	// Get user data from login.
	.post(async (req, res) => {
		// Get the user data from the request body.
		const userLogin = req.body;
		if (!userLogin || Object.keys(userLogin).length === 0) {
			return res
				.status(400)
				.render('login', { title: 'Login', error: 'No user data provided.' });
		}

		// Preform validation on the user input.
		try {
			userLogin.emailAddressInput = validation.validateEmailInputs(
				userLogin.emailAddressInput,
				'email address'
			);
			userLogin.passwordInput = validation.validatePasswordInputs(
				userLogin.passwordInput,
				'password'
			);
		} catch (e) {
			return res.status(400).render('login', { title: 'Login', error: e });
		}

		// Authenticate the user.
		try {
			// Validates the user.
			const validatedUser = await users.checkUser(
				userLogin.emailAddressInput,
				userLogin.passwordInput
			);
			if (validatedUser) {
				// Sets the user session in the cookie.
				req.session.user = validatedUser;

				// Checks the role of the validated user and redirects.
				if (validatedUser.role === 'admin') return res.redirect('/admin');
				if (validatedUser.role === 'user') return res.redirect('/protected');
			}
		} catch (e) {
			return res.status(400).render('login', {
				title: 'Login',
				error: e,
			});
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
