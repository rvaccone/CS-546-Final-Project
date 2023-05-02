//* File Completed
// This file should set up the express server as shown in the lecture code
import express from 'express';
import session from 'express-session';
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// import session from "express-session";
const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
	// If the user posts to the server with a property called _method, rewrite the request's method
	// To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
	// rewritten in this middleware to a PUT route
	if (req.body && req.body._method) {
		req.method = req.body._method;
		delete req.body._method;
	}
	// let the next middleware run:
	next();
};

// Sets a cookie.
app.use(
	session({
		name: 'AuthCookie',
		user: {},
		secret: 'secret',
		saveUninitialized: true,
		resave: true,
	})
);

app.use('/', (req, res, next) => {
	if (req.session.user) {
		res.locals.user = req.session.user;
	}
	next();
});

// Protects login from signed in user.
//* This works.
app.use('/user/login', (req, res, next) => {
	if (req.session.user) {
		res.redirect(`/user/:${req.session.user._id}`);
	} else {
		next();
	}
});

// Protects register from signed in user.
//* This works.
app.use('/user/register', (req, res, next) => {
	if (req.session.user) {
		res.redirect(`/user/:${req.session.user._id}`);
	} else {
		next();
	}
});

// Protects logout from unsigned in user.
//* This works.
app.use('/user/logout', (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		return res.redirect('/user/login');
	}
});

// Protects user/:id from unsigned in user.
// app.use('/user/:id', (req, res, next) => {
// 	if (req.session.user) {
// 		next();
// 	} else {
// 		return res.redirect('/user/login');
// 	}
// });

// Protects user/:id from unsigned in user.
// TODO: test this middleware. Might not even need it as the user seemingly cannot enter other profiles...
// app.use('/user/:id', (req, res, next) => {
// 	// Prevents logged in user from accessing other user's pages.
// 	let idCompareString = ':' + req.session.user._id;
// 	if (idCompareString != req.params.id) {
// 		res.redirect('/error');
// 		// Prevents unsigned in user from accessing user pages.
// 	} else if (!req.session.user) {
// 		res.redirect('/user/login');
// 	} else {
// 		next();
// 	}
// 	if (!req.session.user) {
// 		res.redirect('/');
// 	} else {
// 		next();
// 	}
// });

app.use('/public', staticDir);
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
configRoutes(app);
