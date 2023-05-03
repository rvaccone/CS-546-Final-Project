import { Router } from "express";
const router = Router();
import {
  usersData,
  courtsData,
  gamesData,
  gameMembersData,
  courtReviewsData,
} from "../data/index.js";
import * as validation from "../validation.js";
//get courtbyid handlebar page
router.route("/:id").get(async (req, res) => {
  // Store the id from the url
  let id = req.params.id;

  // Validate the id
  try {
    id = validation.checkID(id, "id");
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }

  // Get the court details
  let courtDetails = null;
  try {
    courtDetails = await courtsData.get(id);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  let pickUpGames = null;
  try {
    pickUpGames = await gamesData.getAll(id);
    console.log("gotem", pickUpGames);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }

  // Check that the court exists
  if (!courtDetails)
    return res
      .status(400)
      .render("Error", { errorMessage: "Error: Court not found" });

  // Adding the full name to the reviews
  for (let review of courtDetails.reviews) {
    // Creating a variable to store the full name
    let fullName = null;

    // Try to get the full name
    try {
      fullName = await usersData.getFullName(review.userID.toString());
    } catch (e) {}

    // Add the full name to the review
    review.fullName = fullName;
  }
  //added now

  let userId;
  try {
    userId = req.session.user._id;
  } catch (error) {
    console.log(error);
  }
  let reviews = courtDetails.reviews;
  let fullName;
  for (let i = 0; i < reviews.length; i++) {
    try {
      fullName = await usersData.getFullName(reviews[i].userID.toString());
    } catch (e) {
      console.log(e);
    }
    reviews[i].fullName = fullName;
    if (reviews[i].userID.equals(userId)) {
      reviews[i].isOwner = true;
    }
  }

  // Render the courtByID page with the court details
  res.render("courtById", {
    courtName: courtDetails.name,
    address: courtDetails.location,
    overallRating: courtDetails.overallRating,
    latitude: courtDetails.lat,
    longitude: courtDetails.long,
    pickUpGames: pickUpGames,
    courtId: id,
    //reviews: courtDetails.reviews,
    reviews: reviews,
  });
});
// TODO court review route
router.route("/:id/review").post(async (req, res) => {
  // Store the id from the url
  let courtId = req.params.id;
  console.log(req.body);
  let rating = req.body.rating;
  console.log("rating", rating);
  //converting rating into a number
  rating = parseInt(rating);
  let courtReview = req.body.courtReview;
  //user who should write a review
  let userId = req.session.user._id;
  if (!userId) {
    return res.status(400).render("Error", {
      errorMessage: "User must be signed in to write a review",
    });
  }
  console.log(userId);
  // Validate the id
  try {
    courtId = validation.checkID(courtId, "courtId");
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }

  // Get the court details
  let courtDetails = null;
  try {
    courtDetails = await courtsData.get(courtId);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  //store the review in database
  //const create = async (courtID, userID, rating, comment) => {
  try {
    courtDetails = await courtReviewsData.create(
      courtId,
      userId,
      rating,
      courtReview
    );
    let reviews = courtDetails.reviews;
    let fullName;
    for (let i = 0; i < reviews.length; i++) {
      try {
        fullName = await usersData.getFullName(reviews[i].userID.toString());
      } catch (e) {
        console.log(e);
      }
      reviews[i].fullName = fullName;
      if (reviews[i].userID.equals(userId)) {
        reviews[i].isOwner = true;
      }
    }
    courtDetails.reviews = reviews;
    console.log(courtDetails.reviews);
    res.json(courtDetails);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
});
router.route("/:id/review/delete").delete(async (req, res) => {
  // Store the id from the url
  let courtId = req.params.id;
  //user who should write a review
  let userId = req.session.user._id;
  if (!userId) {
    return res.status(400).render("Error", {
      errorMessage: "User must be signed in to write a review",
    });
  }
  console.log(userId);
  // Validate the id
  try {
    courtId = validation.checkID(courtId, "courtId");
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  // Get the court details
  let courtDetails = null;
  try {
    courtDetails = await courtsData.get(courtId);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  //const remove = async (courtID, userID) => {
  //remove the review
  let updatedData;
  try {
    updatedData = await courtReviewsData.remove(courtId, userId);
  } catch (e) {}
  res.json(updatedData);
});

export default router;
