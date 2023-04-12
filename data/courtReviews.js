import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

// Creates a new review for a court.
const create = async (courtID, name, rating, comment) => {
  //input validation
  courtID = validation.checkID(courtID, "courtID");
  name = validation.checkString(name, "name");
  rating = validation.checkRatingNumber(rating, "rating");
  comment = validation.checkComment(comment, "comment");
  const courtCollection = await courts();
  let court = await courtCollection.findOne({ _id: new ObjectId(courtID) });
  if (court === null) throw "No court with that id";

  let pushReview = {
    _id: new ObjectId(),
    name: name,
    rating: rating,
    comment: comment,
  };

  let updatedReviews = court.reviews;
  updatedReviews.push(pushReview);

  //avgRating of the court:
  //getting rating of reviews for a court to update overall rating
  let sumRating = 0;
  for (let i = 0; i < updatedReviews.length; i++) {
    sumRating += updatedReviews[i].rating;
  }
  let avgRating = sumRating / updatedReviews.length;
  avgRating = avgRating.toFixed(1);
  avgRating = parseFloat(avgRating);

  //updating court with updated reviews and overall rating
  const updatedCourt = {
    reviews: updatedReviews,
    overallRating: avgRating,
  };

  const updatedInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(courtID) },
    { $set: updatedCourt },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "could not update review in court successfully";
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};

// Gets all reviews on a court.
const getAll = async (courtID) => {
  //input validation
  courtID = validation.checkID(courtID, "courtID");
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
const get = async (reviewId) => {
  reviewId = validation.checkID(reviewId, "reviewId");
  const courtCollection = await courts();

  let court_review = await courtCollection.findOne({
    "reviews._id": new ObjectId(reviewId),
  });

  let reviewList = court_review.reviews;
  let result = "reviews should be here";
  for (let i = 0; i < reviewList.length; i++) {
    if (reviewList[i]._id.toString() === reviewId) {
      result = reviewList[i];
      break;
    }
  }
  return result;
};

// Updates a court review.
const update = async (reviewId, name, rating, comment) => {
  //input validation
  reviewId = validation.checkID(reviewId, "reviewId");
  name = validation.checkString(name, "name");
  rating = validation.checkRatingNumber(rating, "rating");
  comment = validation.checkComment(comment, "comment");
  //getting courtCollection from mongo
  const courtCollection = await courts();
  let court_review = await courtCollection.findOne({
    "reviews._id": new ObjectId(reviewId),
  });
  if (court_review === null) throw "found no review to update";
  let reviewList = court_review.reviews;
  let result = "reviews should be here";
  let index = undefined;
  let flag = false;
  for (let i = 0; i < reviewList.length; i++) {
    if (reviewList[i]._id.toString() === reviewId) {
      result = reviewList[i];
      index = i;
      flag = true;
      break;
    }
  }
  if (flag === false) throw "could not find a review to edit";
  let editedReview = {
    _id: new ObjectId(reviewId),
    name: name,
    rating: rating,
    comment: comment,
  };

  //replacing review object list with edited review object
  reviewList[index] = editedReview;

  //updating overall rating after editing the review
  let sumRating = 0;
  for (let i = 0; i < reviewList.length; i++) {
    sumRating += reviewList[i].rating;
  }
  let avgRating = 0;
  if (reviewList.length > 0) {
    avgRating = sumRating / reviewList.length;
  }

  //after updating after editing of review from list
  let editReviewUpdate = {
    reviews: reviewList,
    overallRating: avgRating,
  };

  const updatedInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(court_review._id) },
    { $set: editReviewUpdate },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "could not edit review and update court details successfully";
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};

// Removes a review on a court.
const remove = async (reviewId) => {
  reviewId = validation.checkID(reviewId, "reviewId");
  const courtCollection = await courts();

  let court_review = await courtCollection.findOne({
    "reviews._id": new ObjectId(reviewId),
  });

  if (court_review === null) throw "no review found to delete for given id";
  //iterating through court reviews and poping the review from list
  let reviewList = court_review.reviews;
  let flag = false;
  for (let i = 0; i < reviewList.length; i++) {
    if (reviewList[i]._id.toString() === reviewId) {
      flag = true;
      reviewList.splice(i, 1);
      break;
    }
  }
  if (flag === false) throw "could not find a review to delete";

  // updating ratings after removal

  let sumRating = 0;
  for (let i = 0; i < reviewList.length; i++) {
    sumRating += reviewList[i].rating;
  }
  let avgRating = 0;
  if (reviewList.length > 0) {
    avgRating = sumRating / reviewList.length;
  }

  //after updating after removal of court from list
  let removedReviewUpdate = {
    reviews: reviewList,
    overallRating: avgRating,
  };

  const updatedInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(court_review._id) },
    { $set: removedReviewUpdate },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw "could not delete review and update court successfully";
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  return updatedInfo.value;
};

export { create, getAll, get, update, remove };
