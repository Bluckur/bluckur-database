class BlockchainLevelRepository {
  /**
   * [constructor description]
   * @param {LevelUP} blockchainLevel [description]
   */
  constructor(blockchainLevel) {
    this.blockchainLevel = blockchainLevel;
  }

  /**
   * Gets a list of 'chained' blocks depending on the given options:
   *  no options: Fetches all blocks.
   *  gt: All blocks with a block number greater than {gt}.
   *  gte: All blocks with a block number greater than or equal to {gte}.
   *  lt: All blocks with a block number smaller than {lt}.
   *  lte: All blocks with a block number smaller than or equal to {lte}.
   *  reverse: Reverses the order of the list of blocks.
   *  limit: Puts a limit of fetched blocks.
   * @param  {Object} options  [description]
   * @return {Promise}         [description]
   */
  getBlockchainAsync(options) {
    return new Promise((resolve, reject) => {
      const blocks = [];
      this.blockchainLevel.createValueStream(options)
        .on('data', (data) => {
          blocks.push(data);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve(blocks);
        });
    });
  }

  /**
   * Gets a single block by a given block number
   * @param  {Integer} blockNumber [description]
   * @return {Promise}             [description]
   */
  getBlockAsync(blockNumber) {
    return new Promise((resolve, reject) => {
      this.blockchainLevel.get(blockNumber).then((value) => {
        resolve(value);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Persists a blockchain in its entirety
   *
   * note: This method gets only called once when a normal validator starts.
   * When a blockchain already exists, the new validator has to persist the current
   * blockchain into its own levelDB instance.
   * @param  {Block[]} blocks [description]
   * @return {Promise}        [description]
   */
  putBlockchainAsync(blocks) {
    return new Promise((resolve, reject) => {
      const ops = blocks.map(block => ({
        type: 'put',
        key: block.blockHeader.blockNumber,
        value: block,
      }));
      this.blockchainLevel.batch(ops).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Persists a single block
   * @param  {Block} block [description]
   * @return {Promise}       [description]
   */
  putBlockAsync(block) {
    return new Promise((resolve, reject) => {
      this.blockchainLevel.put(block.blockHeader.blockNumber, block).then((value) => {
        resolve(value);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Deletes a serie of blocks by an array of given block numbers
   *
   * note: This method gets only called to remove possible side chains.
   * @param  {Integer[]} blockNumbers [description]
   * @return {Promise}              [description]
   */
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
    }
    return new BlockchainLevelRepository(blockchainLevel);
  },
};
