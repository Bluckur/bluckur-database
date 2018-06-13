class BlockchainLevelRepository {
  /**
   * Constructor
   * @param {Object} blockModel [description]
   */
  constructor(blockModel) {
    this.blockModel = blockModel;
  }

  getBlockchainAsync(options) {
    return new Promise((resolve, reject) => {
      const blocks = [];
      this.blockchainLevel.createValueStream(options)
        .on('data', (value) => {
          blocks.push(JSON.parse(value));
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve(blocks);
        });
    });
  }

  getBlockAsync(blockNumber) {
    return new Promise((resolve, reject) => {
      this.blockchainLevel.get(blockNumber).then((value) => {
        resolve(JSON.parse(value));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  putBlocksAsync(blocks) {
    return new Promise((resolve, reject) => {
      const ops = blocks.map(block => ({
        type: 'put',
        key: block.blockHeader.blockNumber,
        value: JSON.stringify(block),
      }));
      this.blockchainLevel.batch(ops).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteBlocksAsync(blockNumbers) {
    return new Promise((resolve, reject) => {
      const ops = blockNumbers.map(blockNumber => ({
        type: 'del',
        key: blockNumber,
      }));
      this.blockchainLevel.batch(ops).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = {
  /**
   * Creates a instance of a BlockchainLevelRepository object
   * @param  {LevelUP} blockchainLevel [description]
   * @return {BlockchainLevelRepository}                 [description]
   */
  createInstance(blockchainLevel) {
    if (!blockchainLevel) {
      throw new Error('Invalid argument(s)');
    } else if (blockchainLevel.isClosed()) {
      throw new Error('No open connection to levelDB');
    }
    return new BlockchainLevelRepository(blockchainLevel);
  },
};
