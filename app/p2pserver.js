const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(' , ') : [];

class P2pserver
{
  constructor(blockchain)
  {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen()
  {
    const server = new Websocket.Server({ port : P2P_PORT});
    server.on('connection' , socket => this.connectsocket(socket));
    this.connectTopeers();
    console.log(`Listening for peer-peer connections on: ${P2P_PORT}`);
  }

  connectTopeers()
  {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open' , () => this.connectsocket(socket));
    });
  }

  connectsocket(socket)
  {
    this.sockets.push(socket);
    console.log(`Socket Connected!`);
    this.messagehandler(socket);
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  messagehandler(socket)
  {
    socket.on('message', message => {
      const data = JSON.parse(message);
      console.log('data', data);
    });
  }
}


module.exports = P2pserver;
