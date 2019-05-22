const ChainUtil = require('../chain-util')
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block
{
  constructor(timestamp , lasthash , hash , data, nonce , difficulty)
  {
    this.timestamp = timestamp;
    this.lasthash = lasthash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString()
  {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lasthash.substring(0,16)}
      Hash      : ${this.hash.substring(0,16)};
      Difficulty: ${this.difficulty}
      Nonce     : ${this.nonce};
      Data      : ${this.data}`;
  }

  static genesis()
  {
    return new this('Genesis Time' , '------' , '13091994' , [], 0);
  }

  static mineblock(lastblock , data)
  {
    let hash,timestamp;
    const lasthash = lastblock.hash;
    let { difficulty } = lastblock;
    let nonce = 0;
    do
    {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustdifficulty(lastblock , timestamp);
      hash = Block.hash(timestamp , lasthash , data, nonce, difficulty);
    }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp , lasthash , hash , data, nonce , difficulty)
  }

  static blockhash(block)
  {
    const {timestamp , lasthash , data , nonce, difficulty} = block;
    return Block.hash(timestamp , lasthash , data , nonce, difficulty);
  }


  static hash(timestamp , lasthash , data, nonce, difficulty)
  {
    return ChainUtil.hash(`${timestamp}${lasthash}${data}${nonce}${difficulty}`).toString();
  }

  static adjustdifficulty(lastblock , lasttime)
  {
    let { difficulty } = lastblock;
    difficulty = lastblock.timestamp+MINE_RATE > lasttime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}


module.exports = Block;
