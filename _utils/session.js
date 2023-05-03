// Function to return the user session
const userSession = (req, res) => {
	return req.session.user;
};

// Function to return the user session id without crashing
const userSessionID = (req, res) => {
	return userSession(req, res) ? userSession(req, res)._id : null;
};

export { userSession, userSessionID };
