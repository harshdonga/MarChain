const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const BlockChain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config')
describe('Wallet', () => {
  let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new BlockChain();
  });

  describe('creating a transaction', () => {
    let transaction , sendAmount , recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'foo=address';
      bc = new BlockChain();
      transaction = wallet.createTransaction(recipient , sendAmount ,bc, tp);
    });

    describe('and Doing same transaction',() => {

      beforeEach(() => {
        wallet.createTransaction(recipient , sendAmount,bc , tp);
      });

      it('doubles the `sendAmount` subtracted from wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publickey).amount)
        .toEqual(wallet.balance - sendAmount*2);
      });

      it('clones the `sendAmount` output for the recipient' , () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount , sendAmount]);
      });
    });
  });

  describe('calculating a balance', () => {
    let addBalance , repeatAdd , senderWallet

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for(let i = 0 ; i<repeatAdd ; i++)
      {
        senderWallet.createTransaction(wallet.publickey , addBalance , bc , tp);
      }
      bc.addblock(tp.transactions);

      it('calculates the balance for bc transactions matching recipient' , () => {
        expect(wallet.calculatebalance(bc)).toEqual(INITIAL_BALANCE + (addBalance*repeatAdd));
      });

      it('calculates the balance for bc matching the sender' , () => {
        expect(wallet.calculatebalance(bc)).toEqual(INITIAL_BALANCE - (addBalance*repeatAdd));
      });

    });
  });
});
