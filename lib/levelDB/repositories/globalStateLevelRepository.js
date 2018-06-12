class GlobalStateLevelRepository {
  constructor(globalStateLevel) {
    this.globalStateLevel = globalStateLevel;
  }

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

  getStateAsync(publicKey) {
    return new Promise((resolve, reject) => {
      this.globalStateLevel.get(publicKey).then((value) => {
        resolve(JSON.parse(value));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  putGlobalStateAsync(states) {
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

  putStatesAsync(transactionStates) {
    // return new Promise((resolve, reject) => {
    //   transactionStates.forEach((transactionState) => {
    //
    //   });
    // });
  }

  updateStatesAsync(transactionStates) {
    return new Promise((resolve, reject) => {
      transactionStates.forEach((transactionState) => {
        this.getStateAsync();
      });
    });
  }

  /**
     * Gets wallet from database.
     * @param {string} key = public key
     */
  getAccountWallet(key) {
    return new Promise((resolve) => {
      this.levelGlobalState.get(key)
        .then((value) => {
          resolve(value);
        });
    });
  }

  /**
   * Puts Balance in database
   * @param {string} key = public key
   * @param {wallet} value = balance {coinPerm, stakePerm}
   */
  putAccountWallet(wallet) {
    return new Promise((resolve) => {
      this.levelGlobalState.put(wallet.pubkey, JSON.stringify(wallet))
        .then((value) => {
          resolve(value);
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
