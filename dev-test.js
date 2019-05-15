// const Blockchain = require('./blockchain')
//
// const bc = new Blockchain();
//
// for(let i =0 ; i<10 ; i++)
// {
//   console.log((bc.addblock(`block${i+1}`)).toString())
// }

const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());
