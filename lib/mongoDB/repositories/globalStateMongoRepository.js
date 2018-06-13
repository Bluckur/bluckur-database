const TransactionConverter = require('./../../util/transactionConverter');

class GlobalStateMongoRepository {
  constructor(StateModel) {
    this.StateModel = StateModel;
  }

  getGlobalStateAsync() {
    return new Promise((resolve, reject) => {
      this.StateModel.find({}, { _id: 0, __v: 0 }, (err, states) => {
        if (err) {
          reject(err);
        } else {
          resolve(states);
        }
      });
    });
  }

  getStateAsync(publicKey) {
    return new Promise((resolve, reject) => {
      this.StateModel.findOne({ publicKey }, { _id: 0, __v: 0 }, (err, block) => {
        if (err) {
          reject(err);
        } else {
          resolve(block);
        }
      });
    });
  }

  putStatesAsync(states) {
    return new Promise((resolve, reject) => {
      this.StateModel.insertMany(states, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  updateGlobalStateAsync(transactions) {
    return new Promise((resolve, reject) => {
      const pendingStates = TransactionConverter.convertToStates(transactions);
      const promises = [];
      pendingStates.forEach((pendingState) => {
        promises.push(this.findAndUpdateAsync(pendingState));
      });
      Promise.all(promises).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  findAndUpdateAsync({ publicKey, coin, stake }) {
    return new Promise((resolve, reject) => {
      this.getStateAsync(publicKey).then((state) => {
        const updatedState = {
          publicKey,
          coin: (state ? state.coin : 0) + coin,
          stake: (state ? state.stake : 0) + stake,
        };
        return state ? this.updateOneStateAsync(publicKey, updatedState) :
          this.putStatesAsync([updatedState]);
      }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updateOneStateAsync(publicKey, updatedState) {
    return new Promise((resolve, reject) => {
      this.StateModel.updateOne({ publicKey }, updatedState, (err) => {
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
  createInstance(StateModel) {
    if (!StateModel) {
      throw new Error('Invalid argument(s)');
    }
    return new GlobalStateMongoRepository(StateModel);
  },
};
