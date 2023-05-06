import { Router } from 'express';
const router = Router();
import { gamesData } from '../data/index.js';
import { checkUserSession } from '../utils/session.js';

// Main Route
router
	.route('/')
	// Get the homepage
	.get(async (req, res) => {
		// Get the trending games
		let trendingGameList = null;
		try {
			// Get the trending games
			trendingGameList = await gamesData.getAllTrending();

			// Limit the number of trending games to four
			if (trendingGameList.length > 4) trendingGameList.length = 4;

			// Render the homepage with the limited trending games
			res.render('homepage', { title: 'Homepage', trendingGameList });
		} catch (e) {
			return res.status(500).render('Error', { errorMessage: e });
		}
	});

// Route to store the user's location
router.post('/storeLocation', (req, res) => {
	// Get the user's location data from the request body
	const { latitude, longitude } = req.body;

	// If the user session exists, update the user's location
	if (checkUserSession(req, res)) {
		req.session.latitude = latitude;
		req.session.longitude = longitude;
	}

	// Send a response to the client
	res.send('Location stored in session!');
});

// Serve the login page
router.get('/login', (req, res) => {
	res.render('Login', { title: 'Login' });
});

// Serve the signup page
router.get('/register', (req, res) => {
	res.render('register', { title: 'register' });
});

// Route to serve the error page
router.get('/error', (req, res) => {
	res.render('Error', { title: 'Error' });
});

// Export the router
export default router;
