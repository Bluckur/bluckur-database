const level = require('level');
const defaultConfig = require('./defaultConfig');
const BlockchainLevelRepository = require('./repositories/blockchainLevelRepository');
const GlobalStateLevelRepository = require('./repositories/globalStateLevelRepository');

class LevelDB {
  constructor(customConfig) {
    this.config = Object.assign(defaultConfig, customConfig);
    this.blockchainRepository = null;
    this.globalStateRepository = null;
  }

  openBlockchainLevelAsync() {
    return new Promise((resolve, reject) => {
      level(this.config.blockchainPath, this.config.options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          this.blockchainRepository = BlockchainLevelRepository.createInstance(db);
          resolve();
        }
      });
    });
  }

  openGlobalStateLevelAsync() {
    return new Promise((resolve, reject) => {
      level(this.config.globalStatePath, this.config.options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          this.globalStateRepository = GlobalStateLevelRepository.createInstance(db);
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
