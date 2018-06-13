class BlockchainMongoRepository {
  constructor(BlockModel) {
    this.BlockModel = BlockModel;
  }

  getBlockchainAsync() {
    return new Promise((resolve, reject) => {
      this.BlockModel.find({}, { _id: 0, __v: 0 }, (err, blocks) => {
        if (err) {
          reject(err);
        } else {
          resolve(blocks);
        }
      });
    });
  }

  getBlockAsync(blockNumber) {
    return new Promise((resolve, reject) => {
      this.BlockModel.findOne({ 'blockHeader.blockNumber': blockNumber }, { _id: 0, __v: 0 }, (err, block) => {
        if (err) {
          reject(err);
        } else {
          resolve(block);
        }
      });
    });
  }

  putBlocksAsync(blocks) {
    return new Promise((resolve, reject) => {
      this.BlockModel.insertMany(blocks, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  deleteBlocksAsync(blockNumbers) {
    return new Promise((resolve, reject) => {
      this.BlockModel.deleteMany({ 'blockHeader.blockNumber': { $in: blockNumbers } }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = {
  createInstance(BlockModel) {
    if (!BlockModel) {
      throw new Error('Invalid argument(s)');
    }
    return new BlockchainMongoRepository(BlockModel);
  },
};
