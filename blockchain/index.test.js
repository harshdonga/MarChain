const BlockChain = require('./index');
const Block = require('./block');


describe('BlockChain' , () => {
  let bc,bc2;

  beforeEach(() => {
    bc = new BlockChain();
    bc2 = new BlockChain();
  });

  it('start with genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block' , () => {
    const data = 'foo';
    bc.addblock(data);

    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

  it('validates a valid chain', () => {
    bc2.addblock('foo');

    expect(bc.isvalidchain(bc2.chain)).toBe(true);
  });

  it('Invalidates chain with corrupt genesis block', () => {
    bc2.chain[0].data = 'wassupguys'

    expect(bc.isvalidchain(bc2.chain)).toBe(false);
  });

  it(('Replaces the chain with valid chain'), () =>{
    bc2.addblock('goo');
    bc.replacechain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  it(('Does not replace the chain with one of the less than or equla to length') , () =>{
  bc.addblock('foo2');
  bc.replacechain(bc2.chain)

  expect(bc.chain).not.toEqual(bc2.chain);
  });



});
