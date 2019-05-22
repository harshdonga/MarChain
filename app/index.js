const express = require('express');
const BlockChain = require('../blockchain')
const bodyparser = require('body-parser')
const P2pserver = require('./p2pserver')

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const p2pserver = new P2pserver(bc);

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

app.listen(HTTP_PORT , () => console.log(`Listening on port ${HTTP_PORT}`));
p2pserver.listen();
