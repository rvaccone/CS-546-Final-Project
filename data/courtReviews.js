import { courts, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../_utils/validation.js';

// Function to calculate the average rating of a court
const calculateAverageRating = (reviews) => {
	// calculate the sum of all the ratings
	let sumRating = reviews.reduce((sum, review) => {
		return sum + review.rating;
	}, 0);

	// Create a variable to store the average rating
	let avgRating = 0;

	// Calculate the average rating
	reviews.length > 0 ? (avgRating = sumRating / reviews.length) : avgRating;

	// Round the average rating to one decimal place
	avgRating = avgRating.toFixed(1);
	avgRating = parseFloat(avgRating);

	// Return the average rating
	return avgRating;
};

// Function to verify the court and user exist
const verifyCourtAndUser = async (courtID, userID) => {
	// Check if the court exists
	const courtCollection = await courts();
	let court = await courtCollection.findOne({ _id: new ObjectId(courtID) });
	if (court === null) throw 'No court with that id';

	// Check if the user exists
	const userCollection = await users();
	let user = await userCollection.findOne({ _id: new ObjectId(userID) });
	if (!user) throw `No user with id ${userID.toString()}`;

	return { court, courtCollection };
};

// Function to update the reviews and overall rating of a court
const updateReviews = async (courtID, courtCollection, reviews) => {
	// Calculate the average rating
	let avgRating = calculateAverageRating(reviews);

	//updating court with updated reviews and overall rating
	const updatedCourt = {
		reviews,
		overallRating: avgRating,
	};

	// Update the court
	const updatedInfo = await courtCollection.findOneAndUpdate(
		{ _id: new ObjectId(courtID) },
		{ $set: updatedCourt },
		{ returnDocument: 'after' }
	);

	if (updatedInfo.lastErrorObject.n === 0) {
		throw 'could not update review in court successfully';
	}
	updatedInfo.value._id = updatedInfo.value._id.toString();
	return updatedInfo.value;
};

// Creates a new review for a court.
const create = async (courtID, userID, rating, comment) => {
	//input validation
	courtID = validation.checkID(courtID, 'courtID');
	userID = validation.checkID(userID, 'userID');
	rating = validation.checkRatingNumber(rating, 'rating');
	comment = validation.checkComment(comment, 'comment');

	// Verify that the court and user exist
	let { court, courtCollection } = await verifyCourtAndUser(courtID, userID);

	// Confirm that the user has not already reviewed the court
	try {
		await get(courtID, userID);
		throw `User with id ${userID.toString()} has already reviewed court with id ${courtID.toString()}`;
	} catch (e) {
		if (e !== 'No review from user with given ID') throw e;
	}

	let pushReview = {
		_id: new ObjectId(),
		userID: new ObjectId(userID),
		rating: rating,
		comment: comment,
	};

	let updatedReviews = court.reviews;
	updatedReviews.push(pushReview);

	return updateReviews(courtID, courtCollection, updatedReviews);
};

// Gets all reviews on a court.
const getAll = async (courtID) => {
	//input validation
	courtID = validation.checkID(courtID, 'courtID');
	//getting all reviews for a courtID
	const courtCollection = await courts();
	const courtList = await courtCollection
		.find({ _id: new ObjectId(courtID) })
		.project({
			_id: 0,
			reviews: 1,
		})
		.toArray();
	//   if (courtList[0].reviews === null) throw "No reviews in the given courtID";
	return courtList[0].reviews;
};

// Gets a review by its review id.
const get = async (courtID, userID) => {
	// Validate the inputs
	courtID = validation.checkID(courtID, 'courtID');
	userID = validation.checkID(userID, 'userID');

	// Retrieve the court collection from mongo
	const courtCollection = await courts();

	// Find the court with the given id
	let court = await courtCollection.findOne({ _id: new ObjectId(courtID) });

	// Check that the court exists
	if (!court) throw `No user with id ${court.toString()}`;

	// Create a variable to store the reviews on the court
	let courtReviews = court.reviews;

	// Check if the user has a review on the court
	let userReview = undefined;
	userReview = courtReviews.find((review) => {
		return review.userID.toString() === userID.toString();
	});

	// Check that the review exists
	if (!userReview) throw 'No review from user with given ID';

	// Return the review if it exists
	return userReview;
};

// Updates a court review.
const update = async (courtID, userID, rating, comment) => {
	//Validate the inputs
	courtID = validation.checkID(courtID, 'courtID');
	userID = validation.checkID(userID, 'userID');
	rating = validation.checkRatingNumber(rating, 'rating');
	comment = validation.checkComment(comment, 'comment');

	// Verify that the court and user exist
	let { court, courtCollection } = await verifyCourtAndUser(courtID, userID);

	// Create a variable to store the reviews on the court
	let courtReviews = court.reviews;

	// Check if the user has a review on the court
	let userReview = undefined;
	userReview = await get(courtID, userID);
	if (!userReview) throw `No review from user with ID ${userID.toString()}`;

	// Replace the old review with the new review
	let updatedReviews = courtReviews.map((review) => {
		if (review.userID.toString() === userID.toString()) {
			review.rating = rating;
			review.comment = comment;
		}
		return review;
	});

	return updateReviews(courtID, courtCollection, updatedReviews);
};

// Removes a review on a court.
const remove = async (courtID, userID) => {
	// Validate the inputs
	courtID = validation.checkID(courtID, 'courtID');
	userID = validation.checkID(userID, 'userID');

	// Verify that the court and user exist
	let { court, courtCollection } = await verifyCourtAndUser(courtID, userID);

	// Create a variable to store the reviews on the court
	let courtReviews = court.reviews;

	// Check if the user has a review on the court
	let userReview = undefined;
	userReview = await get(courtID, userID);
	if (!userReview) throw `No review from user with ID ${userID.toString()}`;

	// Remove the review from the court
	let updatedReviews = courtReviews.filter((review) => {
		return review.userID.toString() !== userID.toString();
	});

	return updateReviews(courtID, courtCollection, updatedReviews);
};

export { create, getAll, get, update, remove };
