const Block = require('./block');

class BlockChain
{
  constructor()
  {
    this.chain = [Block.genesis()];
  }

  addblock(data)
  {
    const block = Block.mineblock(this.chain[this.chain.length-1] , data);
    this.chain.push(block);

    return block;
  }
}

module.exports = BlockChain;
