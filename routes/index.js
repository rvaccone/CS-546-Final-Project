// Import the routes from the other files
import userRoutes from './users.js';
import gameRoutes from './games.js';
import courtRoutes from './courts.js';

const constructorMethod = (app) => {
	// On the / route, render the Login page
	router.route('/').get(async (req, res) => {
		res.render('Login');
	});

	// Use the other routes
	app.use('/user', userRoutes);
	app.use('/game', gameRoutes);
	app.use('/courts', courtRoutes);

	// If the route is not found, render the error page.
	app.use('*', (req, res) => {
		return res
			.status(404)
			.render('Error', { errorMessage: 'Error: Route not found' });
	});
};

export default constructorMethod;
