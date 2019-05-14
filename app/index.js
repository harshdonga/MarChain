const express = require('express');
const BlockChain = require('../blockchain')
const bodyparser = require('body-parser')

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();

app.use(bodyparser.json())

app.get('/blocks' , (req, res) => {
  res.json(bc.chain);
});

app.post('/mine' , (req, res) => {
  const block = bc.addblock(req.body.data);
  console.log(`New Block added:\n${block.toString()}`);

  res.redirect('/blocks')
});

app.listen(HTTP_PORT , () => console.log(`Listening on port ${HTTP_PORT}`));
