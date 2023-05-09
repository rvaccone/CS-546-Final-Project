// Function to return the user session
const userSession = (req, res) => {
	return req.session.user ? req.session.user : null;
};

// Function to return the user session id without crashing
const userSessionID = (req, res) => {
	return userSession(req, res) ? userSession(req, res)._id : null;
};

// Function to check if there is a user session
const checkUserSession = (req, res) => {
	return userSession(req, res) != null;
};

export { userSession, userSessionID, checkUserSession };
