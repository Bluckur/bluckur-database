const level = require('level');
const defaultConfig = require('./defaultConfig');
const BlockchainLevelRepository = require('./repositories/blockchainLevelRepository');
const GlobalStateLevelRepository = require('./repositories/globalStateLevelRepository');

class LevelDB {
  constructor(config) {
    this.config = config || defaultConfig;
    this.blockchainLevelRepository = null;
    this.globalStateLevelRepository = null;
  }

  openBlockchainLevelAsync() {
    return new Promise((resolve, reject) => {
      level(this.config.blockchainPath, this.config.options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          this.blockchainLevelRepository = BlockchainLevelRepository.createInstance(db);
          resolve();
        }
      });
    });
  }

  openGlobalStateLevelAsync() {
    return new Promise((resolve, reject) => {
      level(this.config.blockchainPath, this.config.options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          this.globalStateLevelRepository = GlobalStateLevelRepository.createInstance(db);
          resolve();
        }
      });
    });
  }

  closeBlockchainLevelAsync() {
    return new Promise((resolve, reject) => {
      this.blockchainLevel.close().then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  closeGlobalStateLevelAsync() {
    return new Promise((resolve, reject) => {
      this.globalStateLevel.close().then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = {
  createInstance(config) {
    return new LevelDB(config);
  },
};
