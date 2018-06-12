const levelDB = require('./lib/levelDB/levelDB').createInstance();
const Models = require('bluckur-models');

const block1 = Models.createBlockInstance({
  blockHeader: Models.createBlockHeaderInstance({
    blockNumber: 2,
    validator: '75821586eeee3dc40f7ef83df809c9a38de017ed3adaed8130becd267f5eeffb',
    timestamp: +new Date(),
    blockReward: this.BLOCK_REWARD,
    parentHash: '0',
  }),
});

const block2 = Models.createBlockInstance({
  blockHeader: Models.createBlockHeaderInstance({
    blockNumber: 3,
    validator: '75821586eeee3dc40f7ef83df809c9a38de017ed3adaed8130becd267f5eeffb',
    timestamp: +new Date(),
    blockReward: this.BLOCK_REWARD,
    parentHash: '0',
  }),
});

levelDB.openBlockchainLevelAsync().then(() => {
  console.log('b');
  return levelDB.blockchainRepository.putBlockAsync(block1);
}).then(() => {
  console.log('a');
  return levelDB.blockchainRepository.getBlockAsync(2);
}).then((blocks) => {
  console.log(blocks);
})
  .catch((err) => {
    console.log(err);
  });
