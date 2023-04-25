import { Router } from "express";
const router = Router();
import { courtsData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: router.route("/login") and router.route("/logout")

router.route("/").get(async (req, res) => {
  res.render("Login");
});
router.route("/:id").get(async (req, res) => {
  let id = req.params.id;
  let courtDetails = await courtsData.get(id);
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
