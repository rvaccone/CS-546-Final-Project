import { Router } from "express";
const router = Router();
import {
  gamesData,
  usersData,
  courtsData,
  gameMembersData,
} from "../data/index.js";
import * as validation from "../validation.js";
import { ObjectId } from "mongodb";

// TODO: render instead of json. Including data you want to render with it.

router
  .route("/:courtID")
  .get(async (req, res) => {
    let id = req.params.courtID;

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
    console.log("cookie details", req.session.user);
    return res.status(200).render("createGame", { courtId: id });
  })

  // Create Game by courtID
  .post(async (req, res) => {
    const courtsPostData = req.body;
    let courtID = req.params.courtID;
    // Checks to see if the req.body is empty.
    if (!courtsPostData || Object.keys(courtsPostData).length === 0) {
      return res.status(400).render("Error", {
        errorMessage: "Error: There are no fields in the request body",
      });
    }
    console.log("this is courts post data", courtsPostData);

    // Checks to see if the correct number of fields were returned.
    if (Object.keys(courtsPostData).length < 3) {
      return res.status(400).render("Error", {
        errorMessage: `Error: The schema does not match the database. The current body's keys are ${Object.keys(
          courtsPostData
        )}`,
      });
    }
    let dateStr = courtsPostData.date;
    let dateFormatted = `${dateStr.substring(5, 7)}/${dateStr.substring(
      8,
      10
    )}/${dateStr.substring(0, 4)}`;

    // Validates the input.
    try {
      //todo create a check court id validation function
      courtID = validation.checkID(courtID, "courtID");
      console.log("here");
      dateFormatted = validation.checkDate(dateFormatted, "date");
      console.log(dateFormatted);
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
      //console.log(courtsPostData);
      const { time, maxPlayers } = courtsPostData;
      const newGame = await gamesData.create(
        courtID,
        // userID, replace with the userid from cookie
        req.session.user._id,
        dateFormatted,
        time,
        maxPlayers
      );
      // return res.status(200).json(newGame);
      return res.render("createConfirmation", {
        courtName: newGame.courtName,
        date: newGame.date,
        time: newGame.time,
        maxPlayers: newGame.maxPlayers,
        gameMembers: newGame.gameMembers,
      });
    } catch (e) {
      res.status(400).render("createConfirmation", {
        errorMessage: e,
      });
    }
  });

router
  .route("/gameDetails/:gameID")

  .get(async (req, res) => {
    // Store the gameID from the url
    let gameID = req.params.gameID;

    // Validate the gameID
    try {
      gameID = validation.checkID(gameID, "gameID");
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }

    // Get the game using the gameID
    let gameDetails = null;
    try {
      gameDetails = await gamesData.get(gameID);
    } catch (e) {
      return res.status(400).render("Error", { errorMessage: e });
    }
    let Host;
    try {
      Host = await usersData.getFullName(gameDetails.userID.toString());
    } catch (e) {
      Host = "NO HOST";
    }
    // Check that the game exists
    if (!gameDetails)
      return res
        .status(400)
        .render("Error", { errorMessage: "Error: Game not found" });

    // Return the game details
    return res
      .status(200)
      .render("pickUpGame", { gameDetails: gameDetails, Host: Host });
  })

  // Delete Game by gameID
  .delete(async (req, res) => {
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
  })

  // Add player to game by gameID using create gameMember.
  .put(async (req, res) => {
    // Get the request body
    const gameMemberPutData = req.body;

    // Checks to see if the req.body is empty
    if (!gameMemberPutData || Object.keys(gameMemberPutData).length === 0)
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

// Post route to add a user to the game
router.route("/addUser/:gameID").post(async (req, res) => {
  // Get the request body
  try {
    req.params.gameID = validation.checkID(req.params.gameID, "gameID");
  } catch (e) {
    return res.status(400).render("Error", {
      errorMessage: `Error: Invalid gameId with id ${gameID}`,
    });
  }

  // Get the game details
  let game = null;
  try {
    game = await gamesData.get(req.params.gameID);
  } catch (e) {
    return res.status(400).render("Error", {
      errorMessage: `Error: Getting the game failed with error ${e}`,
    });
  }

  // Check if the game exists
  if (!game)
    return res.status(400).render("Error", {
      errorMessage: `Error: There is no game with id`,
    });

  // Check if the user is signed in or not
  if (req.session.user) {
    // Try to call the gameMembersData create function
    try {
      console.log(`User id: ${req.session.user._id}`);
      await gameMembersData.create(req.params.gameID, req.session.user._id);
      return res.render("joinConfirmation", {
        gameDetails: game,
        session: req.session.user,
        success: true,
      });
    } catch (e) {
      // If the user cannot be added to the game, render the joinConfirmation page
      return res.render("joinConfirmation", {
        session: req.session.user,
        errorMessage: e,
      });
    }
  } else {
    // If the user is not signed in, render the joinConfirmation page
    return res.render("joinConfirmation", {
      errorMessage: "User is not signed in",
    });
  }
});

export default router;
