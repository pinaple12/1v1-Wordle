import express from 'express';
import {promises as fs}from 'fs';
var router = express.Router();

//Global Variables
const games = {};
const codesInUse = new Set();
const words = ['APPLE', 'BANAN', 'CHERRY', 'DATES', 'ELDER'];
let allSockets = {};

router.get('/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const games = await req.models.Game.find({ players: username });

        res.json(games);
    } catch (error) {
        console.error("Error fetching game data:", error);
        res.status(500).json({ "status": "error", "error": error.message });
    }
})

//generates a random word
// router.get('/wordGenerator', async (req, res) => {
//     console.log('received');
//     const data = await fs.readFile('public/public/wordbase.txt', 'utf8');
//     const lines = data.split('\n');
//     const word = lines[Math.floor(Math.random()*lines.length)];
//     res.json({status : 'success', word: word});
// });

router.post('/', async (req, res) => {
    const players = req.body.players;
    const winner = req.body.winner;

    const newGame = new req.models.Game({
        players: players,
        winner: winner,
    });
    await newGame.save();
})

//Creates a lobby
router.post('/createLobby', async (req, res) => {
    //const creator = req.session.account.username;
    console.log(req.body);
    const creator = req.body.playerName;
    const word = getRandomWord();

    let gameCode = generateRoomCode();
    while (codesInUse.has(gameCode)) {
        gameCode = generateRoomCode();
    }
    codesInUse.add(gameCode);

    if (games.gameCode) {
        res.status(400).send({ status: 'error', error: 'existing game never deleted' });
        return;
    }

    const game = { creator, word };
    games[gameCode] = game;
    games[gameCode].host = creator;

    res.status(200).send({ status: 'success', gameCode, word });
});


router.post('/finishedGame', async (req, res) => {
    console.log(req.body)
    const player = req.body.playerName;
    const gameCode = req.body.gameCode;
    const score = req.body.score;

    if (score === 0) {
        //first to run out of guesses loses if both players run out
        if (!games[gameCode].loser) {
            games[gameCode].loser = player;
            res.status(200).send({status : 'success', result : 'lose'});
        } else {
            games[gameCode].winner = player;
            res.status(200).send({status : 'success', result : 'win'});
        }
    } else {
        if (!games[gameCode].winner) {
            games[gameCode].winner = player;
            res.status(200).send({status : 'success', result : 'win'});
        } else if (!games[gameCode].loser) {
            games[gameCode].loser = player;
            res.status(200).send({ status: 'success', result: 'lose' });
        }
    }
    console.log(games[gameCode]);

    //save new game
    if (games[gameCode].winner && games[gameCode].loser) {
        const newGame = new req.models.Game({
            gameID: gameCode, 
            players: [games[gameCode].winner, games[gameCode].loser],
            winner: games[gameCode].winner,
        });
    
        await newGame.save();

        games[gameCode] = undefined;
        codesInUse.delete(gameCode);
        allSockets[gameCode] = undefined;
    }
    
})

export const mountWs = (app) => {
    app.ws('/gameSockets', (ws, res) => {
        console.log('connected new user');

        ws.on('message', (msg) => {
            const socketMessage = JSON.parse(msg);
            const gameCode = socketMessage.gameCode;

            //on create, add socket with new gamecode
            if (socketMessage.action === 'create') {
                console.log("game code" , gameCode);
                allSockets[gameCode] = [ws];
            }

            //on join, add socket to existing gamecode
            if (socketMessage.action === 'join') {
                if (games[gameCode] == undefined) {
                    ws.send(JSON.stringify({'action' : 'failed'}));
                    return;
                }

                games[gameCode].guest = socketMessage.username;
                console.log(socketMessage.username);
                console.log(games[gameCode].host)
                allSockets[gameCode].push(ws);

                allSockets[gameCode].forEach(socket => {
                    socket.send(JSON.stringify({ 'action': 'guestJoined', 'host': games[gameCode].host, 'guest' : socketMessage.username}));
                });
            }

            if (socketMessage.action === 'quit') {
                if (socketMessage.quitter === 'host') {
                    games[gameCode] = undefined;
                    codesInUse.delete(gameCode);
                } else if (socketMessage.quitter === 'guest') {
                    games[gameCode].guest = undefined;
                    allSockets[gameCode] = allSockets[gameCode].filter(socket => socket !== ws);
                }
                allSockets[gameCode] = allSockets[gameCode].filter(socket => socket !== ws);

                allSockets[gameCode].forEach(socket => {
                    socket.send(JSON.stringify({ 'action': 'quit'}));
                });

                if (socketMessage.quitter === 'host') {
                    allSockets[gameCode] = undefined;
                }
            }

            if (socketMessage.action === 'start') {
                allSockets[gameCode].forEach(socket => {
                    socket.send(JSON.stringify({'action' : 'start'}));
                })
            }
        });

    })
}

//Generates a room code
const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

//Generates a random word
const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

export default router;