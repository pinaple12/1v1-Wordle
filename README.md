## Technical Description
### Architectural Diagram
![info441_diagram](https://github.com/info441-sp24/final-project-isaxena02/assets/114948976/04732870-7c49-4417-9ff0-f7daf60ab685)

### Data Flow Diagram
![info441 dataflow](https://github.com/info441-sp24/final-project-isaxena02/assets/81937831/2353101a-35a4-4c55-9c44-7f5865222b77)
### Summary Table For User Stories
| Priority | User       | Description                                                   | Technical Implementation                                                                                           |
|----------|------------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| P0       | As a user  | I want to be able to create, log in to, and log out of user accounts. | When signing in, use sessions and Azure auth to handle accounts. Add them to the ‘Users’ database.                  |
| P0       | As a user  | I want to be able to create a game lobby.                     | Use Express WebSockets and generate a room code that others must enter to join                                     |
| P0       | As a user  | I want to be able to join an existing lobby.                  | Get a room code from the user and try to validate it. If a room with the code exists, add them to the room.         |
| P0       | As a user  | I want to know how to play 1v1 Wordle                         | Build a webpage that explains 1v1 Wordle rules using HTML/CSS                                                      |
| P0       | As a user  | I want to be able to play real-time wordle against my friend  | Use Express WebSockets to keep track of whether a user has successfully guessed the word or not. Wordle will be coded with HTML/CSS/JS. Send a POST request to the ‘Games’ database |
| P1       | As a user  | I want to be able to add a user as a friend                   | When adding a user as a friend, use their ID from the ‘Users’ database and add to an array field in the ‘Users’ database using a POST request |
| P1       | As a user  | I want to be able to see my statistics                        | When looking for statistics, make a GET request to pull fields from the ‘Users’ database and display ELO, record, and games played |
| P2       | As a user  | I want to be able to see my game history                      | When getting a users’ game history, make a GET request to the ‘Games’ database where the corresponding user ID is present |

### API EndPoints
GET /user/:id - Allows users to see their user profile, stats, and friends

GET /user/login - Allows users to log into their account

GET /game/:id - Allows users to see their game history

POST /game - Uploads game to history

POST /user - Uploads game to user stats

POST/user/friend-request - Allow users to send a friend request

POST /user/accept-request - Allow users to accept a friend request

POST /user/register - Allows users to register for an account

DELETE /user/reject-request - Allow users to delete a friend request

WS /game/create - Allows users to create lobbies

WS /game/join - Allows users to join existing lobbies

### Database Schemas
- Users:
    * Username: String,
    * Elo: Integer,
    * gamesPlayed: Array of integers,
    * gamesWon: Integer,
    * gamesLost: Integer,
    * friends: Array of Strings,
    * requests: Array of Strings

- Games:
    * gameID: Integer
  * players: Array of Strings,
  * winner: String,
  * score: Array of integers
