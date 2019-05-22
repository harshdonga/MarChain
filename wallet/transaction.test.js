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

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('validates the verified transaction', () => {
    expect(Transaction.verifytransaction(transaction)).toBe(true);
  });

  it('invalidates the wrong transaction' , () => {
    transaction.outputs[0].amount = 500000;
    expect(Transaction.verifytransaction(transaction)).toBe(false);
  });


});
