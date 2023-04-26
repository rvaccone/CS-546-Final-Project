// Import the express router
import { Router } from 'express';
const router = Router();

// Import the routes from the other files
import homeRoutes from './home.js';
import userRoutes from './users.js';
import gameRoutes from './games.js';
import courtRoutes from './courts.js';

const constructorMethod = (app) => {
	// On the / route render the home page.
	app.use('/', homeRoutes);

	// Use the other routes
	app.use('/user', userRoutes);
	app.use('/game', gameRoutes);
	app.use('/courts', courtRoutes);

	// If the route is not found, render the error page.
	app.use('*', (req, res) => {
		return res.status(404).render('error', { errorMessage: 'Error: Route not found' });
	});
};

export default constructorMethod;
