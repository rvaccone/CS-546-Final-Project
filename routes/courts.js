import { Router } from "express";
const router = Router();
import { courtsData } from "../data/index.js";
import * as validation from "../validation.js";

router.get("/court/:id", async (req, res) => {
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

  // Check that the court exists
  if (!courtDetails)
    return res
      .status(400)
      .render("Error", { errorMessage: "Error: Court not found" });

  // Render the courtByID page with the court details
  res.render("courtById", {
    courtName: courtDetails.name,
    address: courtDetails.location,
    overallRating: courtDetails.overallRating,
    latitude: courtDetails.lat,
    longitude: courtDetails.long,
  });
});

// court by id Route

export default router;
