const SHA256 = require('crypto-js/sha256');

class Block
{
  constructor(timestamp , lasthash , hash , data)
  {
    this.timestamp = timestamp;
    this.lasthash = lasthash;
    this.hash = hash;
    this.data = data;
  }

  toString()
  {
    return `Block -
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lasthash.substring(0,16)}
      Hash     : ${this.hash.substring(0,16)}
      Data     : ${this.data}`;
  }

  static genesis()
  {
    return new this('Genesis Time' , '-----' , 'f1r57_h45h' , []);
  }

  static mineblock(lastblock , data)
  {
    const timestamp = Date.now();
    const lasthash = lastblock.hash;
    const hash = Block.hash(timestamp , lasthash , data);

    return new this(timestamp , lasthash , hash , data)
  }

  static blockhash(block)
  {
    const {timestamp , lasthash , data} = block;
    return Block.hash(timestamp , lasthash , data);
  }


  static hash(timestamp , lasthash , data)
  {
    return SHA256(`${timestamp}${lasthash}${data}`).toString();
  }
}


module.exports = Block;
