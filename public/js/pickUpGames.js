// Import the data functions from games
import * as games_functions from "../data/games.js";
import * as game_members_functions from "../data/gameMembers.js";

// Creating variables for the document elements
let rsvpButton = document.getElementById("rsvpButton");
let gameIdInput = document.getElementById("gameId");

// Checking that the button exists
if (rsvpButton) {
  // Adding an event listener to the button
  rsvpButton.addEventListener("submit", (e) => {
    // Preventing the default action of the button
    e.preventDefault();

    //   Get the vlue of gameIdInput
    let gameID = gameIdInput.value;

    // Redirect to the /addUser/gameID route
    window.location.href = `http://localhost:3000/game/addUser/${gameID}`;

    console.log(trendingGames);
  });
}
