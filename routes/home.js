import { Router } from "express";
const router = Router();
import * as games_functions from "../data/games.js";

// Main Route
router
  .route("/")

  .get(async (req, res) => {
    let trending = await games_functions.getAllTrending();
    if (trending.length === 0) {
      throw "No trending games currently";
    }
    trending;
    return res.status(200).render("homepage", { title: "Homepage" });
  });

export default router;
