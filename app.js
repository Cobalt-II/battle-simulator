const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/game.html');
}); 

server.listen(3000, () => {
  console.log('listening on *:3000');
}); 