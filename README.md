# CS-546-Final-Project

## NYC Basketball Court Finder

Welcome to our project! We designed this website to help people in NYC schedule and join pickup games throughout the five boroughs using real data from [NYC Open Data](https://data.cityofnewyork.us/Recreation/Directory-of-Basketball-Courts/b937-zdky).

### Getting Started

Run the following command to download dependencies:

> npm i

To seed the database:

> npm run seed

To start the server:

> npm start

### Features

-   Main page: Displays recently added trending games for the user.
-   Search for pick-up games: Allows the user to search for pick-up games via a search bar (by location or name of the park).
-   Post Pick-Up Game: Allows the user to publish a pick-up game at a venue if there is no
    game in progress and they are registered users.
-   Join Pick-Up Game: Allows users to join a pick-up game that is currently not filled
    completely (max 10-15 players).
-   Guest users’ access: unregistered users on the website can view pick-up games.
-   Edit profile: Allows users to modify profile pictures and personal details.
-   Comments: Allow users to post comments on courts.
-   Ratings: Users can give court ratings.

### Additional Features

-   Google Map Visual: Shows locations of games using Google Maps API.
-   Win/loss Statistics: Individual profiles display player win/loss statistics.
-   Request Unlisted Courts: Users can suggest the addition of an unlisted court.
-   Locational comments: Allow users to report comments on locations.

### Technologies Used

NYC Basketball Court Finder was created using the following technologies:

-   Node.js
-   Express
-   MongoDB
-   HTML5
-   CSS
-   Handlebars

### Contributors

This project was developed by Jack Harrington, Sai Bandla, Rocco Vaccone, and Punjal Avadhiya.
