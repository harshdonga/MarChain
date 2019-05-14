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

  isvalidchain(chain)
  {

    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
    {
      return false;
    }

    for(let i=1 ; i<chain.length ; i++)
    {
      const block = chain[i];
      const lastblock = chain[i-1];

      if((block.lasthash !== lastblock.hash) || (block.hash !== Block.blockhash(block)))
      {
        return false;
      }
    }

    return true;
  }

  replacechain(newchain)
  {
    if(newchain.length <= this.chain.length)
    {
      console.log('Recieved chain is not longer than the current chain.');
      return;
    }
    else if (!this.isvalidchain(newchain))
    {
        console.log('The recieved chain is not valid!');
        return;
    }

    console.log('Replacing our Chain with newchain');
    this.chain = newchain;
  }
}

module.exports = BlockChain;
