require('dotenv').config();
const mongoDB = require('./lib/mongoDB/mongoDB').createInstance();
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

const block1 = Models.createBlockInstance({
  blockHeader: Models.createBlockHeaderInstance({
    blockNumber: 3,
    validator: 'test1231231238',
    timestamp: +new Date(),
    blockReward: this.BLOCK_REWARD,
    parentHash: '2323',
  }),
  transactions: [transaction1, transaction2],
});

const block2 = Models.createBlockInstance({
  blockHeader: Models.createBlockHeaderInstance({
    blockNumber: 4,
    validator: 'test1231231238',
    timestamp: +new Date(),
    blockReward: this.BLOCK_REWARD,
    parentHash: '2323',
  }),
  transactions: [transaction1, transaction2],
});


mongoDB.connectAsync().then(() => {
  console.log('-');
  return mongoDB.blockchainRepository.deleteBlocksAsync([3, 4]);
  // return mongoDB.blockchainRepository.deleteBlocksAsync([3]);
}).then(() => mongoDB.blockchainRepository.getBlockchainAsync()).then((blocks) => {
  console.log(blocks);
})
  .catch((err) => {
    console.log(err);
  });
