const Block = require('./block');
const { DIFFICULTY, MINE_RATE} = require('../config')

describe('Block' , () => {
  let data , lastblock , block;

  beforeEach(() => {
    data = 'bar';
    lastblock = Block.genesis();
    block = Block.mineblock(lastblock , data);
  });

  it('sets the `data` to match the input' , () => {
    expect(block.data).toEqual(data);
  });

  it('sets the `lasthash` to match the hash of the last block' , () => {
    expect(block.lasthash).toEqual(lastblock.hash);
  });

  it('generates the hash with no. of zeros', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  });

  it('Slowly mined blocks', () => {
    expect(Block.adjustdifficulty(block, block.timestamp+36000)).toEqual(block.difficulty-1)
  });

  it('Quickly mined blocks', () => {
    expect(Block.adjustdifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1)
  });

});
