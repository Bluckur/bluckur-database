const MongoDB = require('./lib/mongoDB/mongoDB');
const LevelDB = require('./lib/levelDB/levelDB');

class MasterRepository {
  constructor(isBackup, config) {
    if (isBackup) {
      this.database = MongoDB.createInstance(config);
    } else {
      this.database = LevelDB.createInstance(config);
    }
  }

  getBlockchainAsync() {
    return new Promise((resolve, reject) => {
      this.database.blockchainRepository.getBlockchainAsync().then((blocks) => {
        resolve(blocks);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getBlockAsync(blockNumber) {
    return new Promise((resolve, reject) => {
      this.database.blockchainRepository.getBlockAsync(blockNumber).then((block) => {
        resolve(block);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  putBlocksAsync(block) {
    return new Promise((resolve, reject) => {
      this.database.blockchainRepository.putBlocksAsync(block).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteBlocksAsync(blockNumbers) {
    return new Promise((resolve, reject) => {
      this.database.blockchainRepository.deleteBlocksAsync(blockNumbers).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getGlobalStateAsync() {
    return new Promise((resolve, reject) => {
      this.database.globalStateRepository.getGlobalStateAsync().then((states) => {
        resolve(states);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getStateAsync(publicKey) {
    return new Promise((resolve, reject) => {
      this.database.globalStateRepository.getStateAsync(publicKey).then((state) => {
        resolve(state);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  putStatesAsync(states) {
    return new Promise((resolve, reject) => {
      this.database.globalStateRepository.putStatesAsync(states).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updateGlobalStateAsync(transactions) {
    return new Promise((resolve, reject) => {
      this.database.globalStateRepository.updateGlobalStateAsync(transactions).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = {
  createInstance(isBackup, config) {
    return new MasterRepository(isBackup, config);
  },
};
