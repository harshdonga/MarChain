const express = require('express');
const BlockChain = require('../blockchain')
const bodyparser = require('body-parser')
const P2pserver = require('./p2pserver')
const Wallet = require('../Wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2pserver(bc,tp);
const miner = new Miner(bc , tp, wallet , p2pserver);

app.use(bodyparser.json())

app.get('/blocks' , (req, res) => {
  res.json(bc.chain);
});

app.post('/mine' , (req, res) => {
  const block = bc.addblock(req.body.data);
  console.log(`New Block added:\n${block.toString()}`);

  p2pserver.syncChains();

  res.redirect('/blocks')
});

app.get('/transactions' , (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact' , (req, res) => {
  const { recipient , amount } = req.body;
  const transaction = wallet.createTransaction(recipient , amount , tp);
  p2pserver.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/public-key' , (req, res) => {
  res.json({ publickey: wallet.publickey });
})

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added : ${block.toString()}`);
  res.redirect('/blocks');
})


app.listen(HTTP_PORT , () => console.log(`Listening on port ${HTTP_PORT}`));
p2pserver.listen();
