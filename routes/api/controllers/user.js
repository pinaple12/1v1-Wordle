import express from 'express';

var router = express.Router();

const games = {};

router.get('/myIdentity', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json(
            {
                status: "loggedin",
                userInfo: {
                    name: req.session.account.name,
                    username: req.session.account.username
                }
            }
        )
    } else {
        res.json({ status: "loggedout" });
    }
})

router.get('/:username', async (req, res) => {
    try {
        let username = req.params.username;
        const user = await req.models.User.findOne({ username: username });
        if (!user) {
            res.status(404).json({ "status": "error", "message": "User not found" });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ "status": "error", "error": error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        let username = req.session.account.username;
        let game = req.body.game;

        let info = await req.models.User.findOne({ username: username });
        if (info) {
            info.gamesPlayed.push(game.gameID);
            if (game.winner === username) {
                info.gamesWon = info.gamesWon + 1;
                info.elo = info.elo + 10;
            } else {
                info.gamesLost = info.gamesLost + 1;
                info.elo = info.elo - 10;
            }
            await info.save();
        } else {
            const newUser = new req.models.User({
                username: username,
                elo: 1000,
                gamesPlayed: [game.gameID], // Initialize with the current game
                gamesWon: game.winner === username ? 1 : 0,
                gamesLost: game.winner !== username ? 1 : 0,
                friends: [],
                requests: []
            });
            await newUser.save();
        }
        res.json({ "status": "success" });
    } catch (error) {
        console.error("Error posting user data:", error)
        res.status(500).json({ "status": "error", "error": error.message })
    }
})

router.post('/friend-request', async (req, res) => {
    const senderUsername = req.body.senderUsername;
    const receiverUsername = req.body.receiverUsername;

    try {
        const receiver = await req.models.User.findOne({ username: receiverUsername });

        if (senderUsername === receiverUsername) {
            return res.status(500).json({ message: "You cannot send a friend request to yourself." });
        }

        // check if there is already a pending or accepted request
        const existingRequest = receiver.requests.find(request => request === senderUsername);
        if (existingRequest) {
            return res.status(500).json({ message: "Friend request already sent." });
        }

        receiver.requests.push(senderUsername);
        await receiver.save();

        res.json({ "status": "success", message: "Friend request sent."});
    } catch (error) {
        console.error("Error sending friend request:", error)
        res.status(500).json({ "status": "error", "error": error.message, message: "Failed to send friend request."})
    }


})

router.post('/accept-request', async (req, res) => {
    const username = req.body.username;
    const requesterUsername = req.body.requesterUsername;

    try {
        const user = await req.models.User.findOne({ username: username });

        const index = user.requests.indexOf(requesterUsername);

        user.requests.splice(index, 1);
        if (!user.friends.includes(requesterUsername)) {
            user.friends.push(requesterUsername);
        }

        const requester = await req.models.User.findOne({ username: requesterUsername });

        if (!requester.friends.includes(username)) {
            requester.friends.push(username);
        }

        await requester.save();
        await user.save();
        res.json({ "status": "success", message: "Friend request accepted."});
    } catch (error) {
        console.error("Error accepting friend request:", error)
        res.status(500).json({ "status": "error", "error": error.message })
    }
});

router.delete('/reject-request', async (req, res) => {
    const username = req.body.username;
    const requesterUsername = req.body.requesterUsername;

    try {
        const user = await req.models.User.findOne({ username: username });

        const index = user.requests.indexOf(requesterUsername);

        user.requests.splice(index, 1);
        await user.save();

        res.json({ "status": "success", message: "Friend request rejected." });
    } catch (error) {
        console.error("Error rejecting friend request:", error)
        res.status(500).json({ "status": "error", "error": error.message })
    }
});

export default router;