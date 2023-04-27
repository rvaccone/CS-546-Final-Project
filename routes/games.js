import { Router } from "express";
const router = Router();
import { gamesData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: render instead of json. Including data you want to render with it.

router
  // Create Game by courtID
  .post("/:courtID", async (req, res) => {
    const courtsPostData = req.body;

    // Checks to see if the req.body is empty.
    if (!courtsPostData || Object.keys(courtsPostData).length === 0) {
      return res.status(400).render("Error", {
        errorMessage: "Error: There are no fields in the request body",
      });
    }

    // Checks to see if the correct number of fields were returned.
    if (Object.keys(courtsPostData).length !== 5) {
      return res.status(400).render("Error", {
        errorMessage: "Error: The schema does not match the database",
      });
    }

    // Validates the input.
    try {
      courtsPostData.courtID = validation.checkID(
        courtsPostData.courtID,
        "courtID"
      );
      courtsPostData.date = validation.checkDate(courtsPostData.date, "date");
      courtsPostData.time = validation.checkTime(courtsPostData.time, "time");
      courtsPostData.maxPlayers = validation.checkMaxPlayer(
        courtsPostData.maxPlayers,
        "maxPlayers"
      );
    } catch (e) {
      console.log(e);
      return res.status(400).render("Error", { errorMessage: e });
    }

    // Creates a new game.
    try {
      console.log(courtsPostData);
      const { courtID, date, time, maxPlayers } = courtsPostData;
      const newGame = await gamesData.create(courtID, date, time, maxPlayers);
      return res.status(200).json(newGame);
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }
  });

router
  // Delete Game by gameID
  .delete("/:gameID", async (req, res) => {
    // Validate the gameID
    try {
      req.params.gameID = validation.checkID(req.params.gameID, "gameID");
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }

    // Call the delete data function for the game
    try {
      let deletedGame = await gamesData.remove(req.params.gameID);
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }
  });

// Add player to game by gameID using create gameMember.
router.put("/:gameID", async (req, res) => {
  // Get the request body
  const gameMemberPutData = req.body;

  // Checks to see if the req.body is empty
  if (!bandInfo || Object.keys(bandInfo).length === 0)
    return res
      .status(400)
      .render("Error", { error: "Error: The request was empty" });

  // Check to see if the correct number of fields were returned
  if (Object.keys(gameMemberPutData).length !== 2)
    return res.status(400).render("Error", {
      errorMessage: "The request contained the wrong number of fields",
    });

  // Validate the IDs
  try {
    gameMemberPutData.gameID = validation.checkID(
      gameMemberPutData.gameID,
      "gameID"
    );
    gameMemberPutData.userID = validation.checkID(
      gameMemberPutData.userID,
      "userID"
    );
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }

  // Call the create gameMember create data function
  try {
    // Variable to store the return value of the create gameMember function
    const createGameMemberData = await gamesData.createGameMember(
      gameMemberPutData.gameID,
      gameMemberPutData.userID
    );

    // Checking if the create gameMember function was successful
    if (!createGameMemberData)
      throw `Error: Could not add user to game with ID ${gameMemberPutData.gameID}`;
  } catch (e) {
    return res.status(400).render("Error", { errorMessage: e });
  }
});

export default router;
