# INFO 441 Final Project
Group 2: Ishita Saxena, Erica Zhang, Justin Dong, Kai Tinder

NOTE: We attempted to deploy using Azure, but it would not work. Everything works locally.
In order to test, open up two windows, sign in, and you can play against yourself.

## Project Description
### Who is our target audience?
Our application will be crafted for competitive Wordle enthusiasts who are looking to amp up the excitement of their favorite game. The web app primarily appeals to enthusiastic young adults who want to challenge their friends and others as an escape from their busy lives. Students and young professionals often have very busy schedules, and our application provides a nice break from their responsibilities. 

The 1-versus-1 style of our game targets those who enjoy connecting through gaming. Additionally, casual and non-gamers can partake in our app as the game is simple to understand yet challenging enough to be entertaining. The game's fast-paced nature allows users to play during short breaks, which is a great fit for a busy young adult’s lifestyle. 

Also, considering how young adults often room with others, our application is the perfect addition to their entertainment choices. The app's simplicity paired with Wordle's addictiveness results in a socially engaging and interactive experience for users.
### Why does our audience want to use our application?
Our audience is filled with college students and young professionals, so the quickness of our game is appealing as it can provide a much-needed break from whatever activity our busy demographic is partaking in. It also allows users to engage in friendly competition with their peers, such as roommates or co-workers, in real time. In addition, our application provides a straightforward, stimulating experience for word game enthusiasts to engage in while also working on their mental sharpness.
### Why do we as developers want to build this application?
Considering that we are college students ourselves and fall into our target audience, we directly understand what an application like this would provide. It is very easy to get burnt out during a long coding session, and having an easy break that isn't just scrolling through Instagram would be very convenient. We also see the importance of social bonding, and having a game where we can have simple and friendly competition would be a nice addition to our daily lives. These benefits are part of what drives us to build this application. 

As developers, we hope to bring this project to life so our target audience and beyond have access to what we believe to be a perfect addition to our daily lives. Given the power of software and our own technical skills, we believe that we have the tools to build an application that will remain a staple in both our own lives and the lives of other young adults. 

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
