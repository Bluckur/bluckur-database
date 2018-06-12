const TransactionConverter = require('./../../util/transactionConverter');

class GlobalStateLevelRepository {
  /**
   * Constructor
   * @param {LevelUP} globalStateLevel [description]
   */
  constructor(globalStateLevel) {
    this.globalStateLevel = globalStateLevel;
  }

  /**
   * Gets the global state in its entirety
   * @return {Promise} [description]
   */
  getGlobalStateAsync() {
    return new Promise((resolve, reject) => {
      const globalState = {};
      this.globalStateLevel.createReadStream()
        .on('data', (keyValuePair) => {
          const { key, value } = JSON.parse(keyValuePair);
          globalState[key] = value;
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve(globalState);
        });
    });
  }

  /**
   * Gets the state (coin and stake amount) by a given public key
   * @param  {String} publicKey [description]
   * @return {Promise}           [description]
   */
  getStateAsync(publicKey) {
    return new Promise((resolve, reject) => {
      this.globalStateLevel.get(publicKey).then((value) => {
        resolve(JSON.parse(value));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * [putStatesAsync description]
   * @param  {State[]} states [description]
   * @return {Promise}        [description]
   */
  putStatesAsync(states) {
    return new Promise((resolve, reject) => {
      const ops = Object.keys(states).map(publicKey => ({
        type: 'put',
        key: publicKey,
        value: JSON.stringify({
          coin: states[publicKey].coin,
          stake: states[publicKey].stake,
        }),
      }));
      this.globalStateLevel.batch(ops).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * [updateGlobalStateAsync description]
   * @param  {Transaction[]} transactions [description]
   * @return {Promise}              [description]
   */
  updateGlobalStateAsync(transactions) {
    return new Promise((resolve, reject) => {
      const pendingStates = TransactionConverter.convertToStates(transactions);
      const promises = [];
      Object.keys(pendingStates).forEach((publicKey) => {
        promises.push(this.getUpdatedStateAsync(publicKey, pendingStates[publicKey]));
      });
      Promise.all(promises).then((stateList) => {
        const states = stateList.reduce((accumelator, state) => {
          /* eslint-disable no-param-reassign */
          const publicKey = Object.keys(state)[0];
          accumelator[publicKey] = state[publicKey];
          return accumelator;
          /* eslint-enable no-param-reassign */
        });
        return this.putStatesAsync(states);
      }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * [getUpdatedStateAsync description]
   * @param  {String} publicKey [description]
   * @param  {Float} coin      [description]
   * @param  {Float} stake     [description]
   * @return {Promise}           [description]
   */
  getUpdatedStateAsync(publicKey, { coin, stake }) {
    return new Promise((resolve, reject) => {
      const updatedState = {};
      this.getStateAsync(publicKey).then((state) => {
        updatedState[publicKey] = {
          coin: state.coin + coin,
          stake: state.stake + stake,
        };
        resolve(updatedState);
      }).catch((err) => {
        if (err.notFound) {
          updatedState[publicKey] = {
            coin,
            stake,
          };
          resolve(updatedState);
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = {
  createInstance(globalStateLevel) {
    if (!globalStateLevel) {
      throw new Error('Invalid argument(s)');
    } else if (globalStateLevel.isClosed()) {
      throw new Error('No open connection to levelDB');
    }
    return new GlobalStateLevelRepository(globalStateLevel);
  },
};
