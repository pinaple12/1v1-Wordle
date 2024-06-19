import socketIo from 'socket.io';

const gameSockets = (server) => {
  const io = socketIo(server);

  const words = ['APPLE', 'BANANA', 'CHERRY', 'DATES', 'ELDER'];

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('createLobby', async () => {
      const roomCode = generateRoomCode();
      const word = getRandomWord(); 
      socket.join(roomCode);
      socket.emit('lobbyCreated', { roomCode, word });
    });
  });
};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

export default gameSockets;
