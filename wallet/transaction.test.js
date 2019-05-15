const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transactions' , () => {
  let wallet , amount , recipient , transaction;
  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'recipient1';
    transaction = Transaction.newTransaction(wallet , recipient , amount);
  });

  it('outputs `amount` deducted from senders wallet' , () => {
    expect(transaction.outputs.find(output => output.address === wallet.publickey).amount)
    .toEqual(wallet.balance - amount);
  });

  it('outputs added `amount` to recipient', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
    .toEqual(amount);
  });

});
