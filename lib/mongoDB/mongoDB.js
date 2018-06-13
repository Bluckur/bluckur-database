const mongoose = require('mongoose');
const Models = require('bluckur-models');
const defaultConfig = require('./defaultConfig');
const BlockchainMongoRepository = require('./repositories/blockchainMongoRepository');
const GlobalStateMongoRepository = require('./repositories/globalStateMongoRepository');

class MongoDB {
  constructor(customConfig) {
    this.config = Object.assign(defaultConfig, customConfig);
    this.blockModel = mongoose.model('block', mongoose.Schema(Models.blockBlueprint));
    this.stateModel = mongoose.model('state', mongoose.Schema(Models.stateBlueprint));
    this.blockchainRepository = null;
    this.globalStateRepository = null;
  }

  connectAsync() {
    return new Promise((resolve, reject) => {
      const {
        host, port, db, user, password,
      } = this.config;
      mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${db}`).then(() => {
        this.blockchainRepository = BlockchainMongoRepository.createInstance(this.blockModel);
        this.globalStateRepository = GlobalStateMongoRepository.createInstance(this.stateModel);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = {
  createInstance(customConfig) {
    return new MongoDB(customConfig);
  },
};
