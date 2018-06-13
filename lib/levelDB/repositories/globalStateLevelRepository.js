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
      const globalState = [];
      this.globalStateLevel.createValueStream()
        .on('data', (value) => {
          globalState.push(JSON.parse(value));
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
   * Gets the state by a given public key
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
   * Persists one state or multiple states at once
   * @param  {State[]} states [description]
   * @return {Promise}        [description]
   */
  putStatesAsync(states) {
    return new Promise((resolve, reject) => {
      const ops = states.map(state => ({
        type: 'put',
        key: state.publicKey,
        value: JSON.stringify(state),
      }));
      this.globalStateLevel.batch(ops).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Updates the global state with the new made transactions.
   * @param  {Transaction[]} transactions [description]
   * @return {Promise}              [description]
   */
  updateGlobalStateAsync(transactions) {
    return new Promise((resolve, reject) => {
      const pendingStates = TransactionConverter.convertToStates(transactions);
      const promises = [];
      console.log(pendingStates);
      pendingStates.forEach((pendingState) => {
        promises.push(this.convertToUpdatedStateAsync(pendingState));
      });
      Promise.all(promises).then(states => this.putStatesAsync(states)).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Helper function to convert a pending state of a new transaction
   * to an updated version (pending state merged with current state).
   * @param  {String} publicKey [description]
   * @param  {Float} coin      [description]
   * @param  {Float} stake     [description]
   * @return {Promise}           [description]
   */
  convertToUpdatedStateAsync({ publicKey, coin, stake }) {
    return new Promise((resolve, reject) => {
      this.getStateAsync(publicKey).then((state) => {
        resolve({
          publicKey,
          coin: state.coin + coin,
          stake: state.stake + stake,
        });
      }).catch((err) => {
        if (err.notFound) {
          resolve({
            publicKey,
            coin,
            stake,
          });
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = {
  /**
   * Creates a instance of a GlobalStateLevelRepository object
   * @param  {LevelUP} globalStateLevel [description]
   * @return {GlobalStateLevelRepository}                  [description]
   */
  createInstance(globalStateLevel) {
    if (!globalStateLevel) {
      throw new Error('Invalid argument(s)');
    }
    return new GlobalStateLevelRepository(globalStateLevel);
  },
};
