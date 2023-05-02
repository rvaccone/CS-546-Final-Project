import { Router } from "express";
const router = Router();
import { gamesData, usersData, courtsData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: render instead of json. Including data you want to render with it.

router.route("/:searchTerm").get(async (req, res) => {
  // Store the id from the url
  let searchTerm = req.params.searchTerm;
  console.log("its is inside search term route");
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
    console.log("failing");
    return res.status(400).render("Error", { errorMessage: e });
  }
  //todo change this to render
  if (courtDetails.length === 0) {
    throw "No results";
  }

  // Render the searchResults page with the court details
  return res.render("searchResults", {
    searchResults: courtDetails,
    keyword: searchTerm,
  });
});

// router.route(":searchTerm").get(async (req, res) => {
//   try {
//     let searchTerm = req.params.searchTerm;

//     // Check if the search term is a valid zip code
//     let isValidZipCode = validation.isValidNYCZipCode(searchTerm, "searchTerm");

//     let searchResults = [];
//     if (isValidZipCode) {
//       // Perform location search
//       const courtCollection = await courts();
//       const zipCode = await zipcodes.lookup(isValidZipCode);
//       const longitude = zipCode.longitude;
//       const latitude = zipCode.latitude;
//       const query = {
//         location: {
//           $nearSphere: {
//             $geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude],
//             },
//             $maxDistance: 16093.4, // 10 miles in meters
//           },
//         },
//       };
//       searchResults = await courtCollection.find(query).toArray();
//     } else {
//       // Perform court name search
//       searchResults = await courtsData.getCourtsByName(searchTerm);
//     }
//     res.render("searchResults", {
//       title: "Search Results",
//       keyword: searchTerm,
//       searchResults,
//     });
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// });

export default router;
