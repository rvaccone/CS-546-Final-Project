import { Router } from 'express';
const router = Router();
import { usersData } from '../data/index.js';
import * as users_functions from '../data/users.js';
import * as validation from '../validation.js';
import xss from 'xss';

// Register Route
router
	// Render the registration page.
	.get('/register', async (req, res) => {
		return res.render('register', { title: 'Register' });
	})

	// Register the new user.
	.post('/register', async (req, res) => {
		// Get the user data from the request body.
		let error_array = [];
		const userRegistration = req.body;
		console.log(userRegistration);
		if (!userRegistration || Object.keys(userRegistration).length === 0) {
			return res
				.status(400)
				.render('register', { title: 'Register', error: 'No user data provided.' });
		}

		// XSS Protection on registration form.
		userRegistration.firstNameInput = xss(userRegistration.firstNameInput);
		userRegistration.lastNameInput = xss(userRegistration.lastNameInput);
		userRegistration.emailAddressInput = xss(userRegistration.emailAddressInput);
		userRegistration.passwordInput = xss(userRegistration.passwordInput);
		userRegistration.confirmPasswordInput = xss(userRegistration.confirmPasswordInput);
		userRegistration.ageInput = xss(userRegistration.ageInput);
		userRegistration.bioInput = xss(userRegistration.bioInput);
		userRegistration.imglinkInput = xss(userRegistration.imglinkInput);

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
			return res.status(200).redirect('/user/login');
		} catch (e) {
			console.log(e);
			return res.status(400).render({ title: 'Error', error: e });
		}
	});

// Login Route
router

	// Render the login page.
	.get('/login', async (req, res) => {
		return res.render('login', { title: 'Login' });
	})

	// Get user data from login.
	.post('/login', async (req, res) => {
		// Get the user data from the request body.
		const userLogin = req.body;
		if (!userLogin || Object.keys(userLogin).length === 0) {
			return res
				.status(400)
				.render('login', { title: 'Login', error: 'No user data provided.' });
		}

		// XSS Protection on login form.
		userLogin.email = xss(userLogin.email);
		userLogin.password = xss(userLogin.password);

		// Preform validation on the user input.
		try {
			userLogin.email = validation.checkEmail(userLogin.email, 'email address');
			userLogin.password = validation.checkPassword(userLogin.password, 'password');
		} catch (e) {
			return res.status(400).render('login', { title: 'Login', error: e });
		}

		// Authenticate the user.
		try {
			// Validates the user.
			const validatedUser = await users_functions.checkUser(
				userLogin.email,
				userLogin.password
			);
			console.log(validatedUser);
			if (validatedUser) {
				// Sets the user session in the cookie.
				req.session.user = validatedUser;
				return res.redirect(`/user/:${validatedUser._id}`);
			}
		} catch (e) {
			console.log('Here is the error:' + e);
			return res.status(400).render('login', {
				title: 'Login',
				error: e,
			});
		}
	});

router

	// TODO: get route for user to display profile.
	//! Should you be printing the user's ID in the URL?
	.get('/:id', async (req, res) => {
		// Send the user's session information to the page.
		return res.render('profile', {
			title: 'My Profile',
			_id: req.session.user._id,
			firstName: req.session.user.firstName,
			lastName: req.session.user.lastName,
			email: req.session.user.emailAddress,
			age: req.session.user.age,
			bio: req.session.user.bio,
			imglink: req.session.user.imglink,
		});
	})

	// TODO: Get the profile pic to work
	// TODO: Edit the editProfile page to have correct action, entries, and link back to profile.
	.get('/editProfile/:id', async (req, res) => {
		return res.status(200).render('editProfile', {
			title: 'Edit Profile',
		});
	})

	// TODO: Adjust this shit to work
	// Edit Profile Route
	.put('/:id', async (req, res) => {
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
