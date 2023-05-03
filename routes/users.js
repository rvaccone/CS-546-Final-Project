import { Router } from 'express';
const router = Router();
import { usersData } from '../data/index.js';
import * as users_functions from '../data/users.js';
import * as validation from '../_utils/validation.js';
import xss from 'xss';

// Register Routes
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

// Login Routes
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
			return res.status(400).render('login', {
				title: 'Login',
				error: e,
			});
		}
	});

// Edit User Routes
router
	.get('/logout', async (req, res) => {
		// Destroys the session.
		console.log('you are hitting logout route');
		req.session.destroy();
		return res.status(200).redirect('/');
	})

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
			imgLink: req.session.user.imgLink,
		});
	})

	// TODO: Edit the editProfile page to have correct action, entries, and link back to profile.
	.get('/editProfile/:id', async (req, res) => {
		return res.status(200).render('editProfile', {
			title: 'Edit Profile',
			_id: req.session.user._id,
			firstName: req.session.user.firstName,
			lastName: req.session.user.lastName,
			email: req.session.user.emailAddress,
			age: req.session.user.age,
			bio: req.session.user.bio,
			imgLink: req.session.user.imgLink,
		});
	})

	// Edit Profile Route
	.post('/editProfile/:id', async (req, res) => {
		const updatedUser = req.body;

		// Checks if the req.body is empty.
		if (!updatedUser || Object.keys(updatedUser).length === 0) {
			return res.status(400).json({ error: 'There are no fields in the request body' });
		}

		// XSS Protection on registration form.
		updatedUser.firstNameInput = xss(updatedUser.firstNameInput);
		updatedUser.lastNameInput = xss(updatedUser.lastNameInput);
		updatedUser.emailAddressInput = xss(updatedUser.emailAddressInput);
		updatedUser.passwordInput = xss(updatedUser.passwordInput);
		updatedUser.confirmPasswordInput = xss(updatedUser.confirmPasswordInput);
		updatedUser.ageInput = xss(updatedUser.ageInput);
		updatedUser.bioInput = xss(updatedUser.bioInput);
		updatedUser.imglinkInput = xss(updatedUser.imglinkInput);

		// Validates the input.
		try {
			updatedUser.firstNameInput = validation.checkString(
				updatedUser.firstNameInput,
				'firstName'
			);
			updatedUser.lastNameInput = validation.checkString(
				updatedUser.lastNameInput,
				'lastName'
			);
			updatedUser.emailAddressInput = validation.checkEmail(
				updatedUser.emailAddressInput,
				'email'
			);
			updatedUser.passwordInput = validation.checkPassword(
				updatedUser.passwordInput,
				'password'
			);
			updatedUser.ageInput = Number(updatedUser.ageInput);
			updatedUser.ageInput = validation.checkAge(updatedUser.ageInput, 'age');

			// Makes the bio input optional.
			if (updatedUser.bioInput.trim() == '') {
				updatedUser.bioInput = '';
			} else {
				updatedUser.bioInput = validation.checkBio(updatedUser.bioInput, 'bio');
			}

			// Makes the imgLink input optional.
			if (updatedUser.imglinkInput.trim() == '') {
				updatedUser.imglinkInput =
					'https://img.freepik.com/premium-vector/basketball_319667-191.jpg';
			} else {
				updatedUser.imglinkInput = validation.checkImgLink(
					updatedUser.imglinkInput,
					'imgLink'
				);
			}

			// Checks if the passwords match.
			if (updatedUser.passwordInput != updatedUser.confirmPasswordInput)
				throw 'Passwords do not match.';
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		// Preforms the data function.
		try {
			const updatedUserData = await usersData.update(
				//req.params.id,
				req.session.user._id,
				updatedUser.firstNameInput,
				updatedUser.lastNameInput,
				updatedUser.emailAddressInput,
				updatedUser.passwordInput,
				updatedUser.ageInput,
				updatedUser.bioInput,
				updatedUser.imglinkInput
			);

			console.log('This is the updated user:' + updatedUserData);

			// Reassign the session values.
			req.session.user.firstName = updatedUserData.firstName;
			req.session.user.lastName = updatedUserData.lastName;
			req.session.user.emailAddress = updatedUserData.email;
			req.session.user.age = updatedUserData.age;
			req.session.user.bio = updatedUserData.bio;
			req.session.user.imgLink = updatedUserData.imgLink;

			res.status(200).redirect(`/user/${updatedUserData._id}`);
		} catch (e) {
			res.status(500).json({ error: e });
		}
	});

export default router;
