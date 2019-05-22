const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(' , ') : [];
const MESSAGE_TYPES = {
  chain : 'CHAIN',
  transaction : 'TRANSACTION',
  clear_transaction: 'ClEAR_TRANSACTIONS'
}

class P2pserver
{
  constructor(blockchain, transactionPool)
  {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
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
    this.sendchain(socket)
  }

  messagehandler(socket)
  {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replacechain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transaction:
          this.transactionPool.clear();
          break;
      }
    });
  }

  sendchain(socket)
  {
    socket.send(JSON.stringify( {
      type : MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  sendTransaction(socket , transaction)
  {
    socket.send(JSON.stringify({
      type : MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  syncChains()
  {
    this.sockets.forEach(socket => this.sendchain(socket));
  }

  broadcastTransaction(transaction)
  {
    this.sockets.forEach(socket => this.sendTransaction(socket , transaction));
  }

  broadcastClearTransactions()
  {
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
  }
}


module.exports = P2pserver;
