import { Router } from "express";
const router = Router();
import { gamesData, usersData, courtsData } from "../data/index.js";
import * as validation from "../validation.js";

// router.route("/:searchTerm").get(async (req, res) => {
router.route("/*").get(async (req, res) => {
  // Store the id from the url
  //let searchTerm = req.params.searchTerm;
  let searchTerm = req.params[0];
  console.log("its is inside search term route");
  // Check if the input is a valid zip code format
  const isZipCode = /^\d{5}(?:[-\s]\d{4})?$/.test(searchTerm);
  let courtDetails = null;
  if (isZipCode) {
    try {
      searchTerm = validation.isValidNYCZipCode(searchTerm, "zipcode");
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }
    try {
      courtDetails = await courtsData.getCourtsByZipCode(searchTerm);
    } catch (e) {
      console.log("failing");
      return res.status(400).render("Error", {
        title: "Search Results",
        errorMessage: `Could not find any courts for ZipCode:${searchTerm}`,
      });
    }
  } else {
    // Validate the id
    try {
      searchTerm = validation.checkString(searchTerm, "searchTerm");
    } catch (e) {
      return res
        .status(400)
        .render("Error", { title: "Search Results", errorMessage: e });
    }

    try {
      courtDetails = await courtsData.getCourtsByName(
        decodeURIComponent(searchTerm)
      );
    } catch (e) {
      console.log("failing");
      return res
        .status(400)
        .render("Error", { title: "Search Results", errorMessage: e });
    }
  }
  if (courtDetails.length === 0) {
    throw "No results";
  }

  // Render the searchResults page with the court details
  return res.render("searchResults", {
    title: "Search Results",
    searchResults: courtDetails,
    keyword: decodeURIComponent(searchTerm),
  });
});

export default router;
