require('dotenv').config();
const levelDB = require('./lib/levelDB/levelDB').createInstance();
const Models = require('bluckur-models');

const state1 = Models.createStateInstance({
  publicKey: 'test123123123',
  coin: 50,
  stake: 12,
});

const state2 = Models.createStateInstance({
  publicKey: 'test1231231238',
  coin: 50,
  stake: 12,
});

const state3 = Models.createStateInstance({
  publicKey: 'me343434',
  coin: 50,
  stake: 12,
});

const transaction1 = Models.createTransactionInstance({
  recipient: 'me343434',
  amount: 25,
  timestamp: +new Date(),
  type: 'coin',
  sender: 'test123123123',
});

const transaction2 = Models.createTransactionInstance({
  recipient: 'test1231231238',
  amount: 25,
  timestamp: +new Date(),
  type: 'coin',
  sender: 'test123123123',
});

levelDB.openBlockchainLevelAsync().then(() => {
  console.log('-');
  return levelDB.blockchainRepository.getBlockchainAsync();
}).then((states) => {
  console.log(states);
})
  .catch((err) => {
    console.log(err);
  });
