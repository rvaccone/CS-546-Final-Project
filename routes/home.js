import { Router } from 'express';
const router = Router();
import { gamesData } from '../data/index.js';

// Main Route
router
	.route('/')

	.get(async (req, res) => {
		try {
			const trendingGameList = await gamesData.getAllTrending();
			console.log('cookie details', req.session.user);
			res.render('homepage', { title: 'Homepage', trendingGameList });
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});
router.post('/storeLocation', (req, res) => {
	// Get the user's location data from the request body
	const { latitude, longitude } = req.body;

	// Store the user's location in the session
	req.session.latitude = latitude;
	req.session.longitude = longitude;

	// Send a response to the client
	res.send('Location stored in session!');
});

// Serve the login page
router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});

// Serve the signup page
router.get('/register', (req, res) => {
	res.render('register', { title: 'register' });
});

router.get('/error', (req, res) => {
	res.render('error', { title: 'Error' });
});
export default router;
