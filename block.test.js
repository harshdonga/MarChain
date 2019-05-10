const Block = require('./block');

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

});
