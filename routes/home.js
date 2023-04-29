import { Router } from 'express';
const router = Router();
import {gamesData} from '../data/index.js';

// Main Route
router
	.route('/')

	.get(async (req, res) => {
		try {
			const trendingGameList = await gamesData.getAllTrending();
			res.render('homepage', { title: 'Homepage', trendingGameList });
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

	// Serve the login page
router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});

// Serve the signup page
router.get('/register', (req, res) => {
	res.render('register', { title: 'register' });
});



export default router;
