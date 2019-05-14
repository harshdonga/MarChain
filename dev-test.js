const Block = require('./block');

const fooblock = Block.mineblock(Block.genesis(), 'foo');
console.log(fooblock.toString()); 
