class BlockchainLevelRepository {
  constructor(blockchainLevel) {
    this.blockchainLevel = blockchainLevel;
  }
}

module.exports = {
  createInstance(blockchainLevel) {
    return new BlockchainLevelRepository(blockchainLevel);
  },
};
