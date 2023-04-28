import { Router } from "express";
const router = Router();
import { gamesData, usersData, courtsData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: render instead of json. Including data you want to render with it.

router.route("/:searchTerm").get(async (req, res) => {
  // Store the id from the url
  let searchTerm = req.params.searchTerm;

  // Validate the id
  try {
    searchTerm = validation.checkString(searchTerm, "searchTerm");
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  let courtDetails = null;
  try {
    courtDetails = await courtsData.getCourtsByName(searchTerm);
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
  //todo change this to render
  if (courtDetails.length === 0) {
    throw "No results";
  }

  // Render the searchResults page with the court details
  return res.render("searchResults", { searchResults: courtDetails });
});
export default router;
