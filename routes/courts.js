import { Router } from "express";
const router = Router();
import {
  usersData,
  courtsData,
  gamesData,
  gameMembersData,
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

  // Render the courtByID page with the court details
  res.render("courtById", {
    courtName: courtDetails.name,
    address: courtDetails.location,
    overallRating: courtDetails.overallRating,
    latitude: courtDetails.lat,
    longitude: courtDetails.long,
    pickUpGames: pickUpGames,
    courtId: id,
    reviews: courtDetails.reviews,
  });
});
// TODO court review route
router.route("/:id/review").get(async (req, res) => {
  // Store the id from the url
  let id = req.params.id;
  //user who should write a review
  let userId = req.session.user._id;
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

  //rending court review page
  res.render("Error", { errorMessage: "Error: Court not found" });
});

export default router;
