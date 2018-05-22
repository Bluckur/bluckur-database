const LevelDB = require('./levelDB');
const verbose = false;

class LevelDatabase {
    constructor(isBackupValidator = false) {
        this.levelBlocks = new LevelDB('./database/level/blocks', verbose);
        this.levelGlobalState = new LevelDB('./database/level/state', verbose);
        this.isBackupValidator = isBackupValidator
    }
    //#region BlockChain
    getFullBlockChain() {

    }

    putBlock(blockNr, block) {

    }

    getBlock(blockNr) {

    }

    deleteBlock(blockNr) {

    }
    //#endregion

    //#region GlobalState
    getFullGlobalstate() {
        return new Promise((resolve) => {
            let globalState = [];

            this.levelGlobalState.getAll()
                .on('data', function (data) {
                    globalState.push(data);
                    if (verbose) console.log(data.key, '=', data.value)
                })
                .on('error', function (err) {
                    if (verbose) console.log('Error while fetching global state', err);
                })
                .on('end', function () {
                    resolve(globalState);
                });
        });
    }

    setFullGlobalState() {

    }

    getAccountBalance(key) {
        return new Promise((resolve) => {
            this.levelGlobalState.get(key)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    putAccountBalance(key, value) {
        return new Promise((resolve) => {
            this.levelGlobalState.put(key, value)
                .then(() => {
                    resolve(true);
                });
        });
    }

    /**
     * Permutate the balance of an account
     * @param {number} key 
     * @param {number} permutation 
     */
    updateAccountBalance(key, permutation) {
        return new Promise((resolve) => {
            this.levelGlobalState.get(key)
                .then((value) => {
                    if (!value)
                        resolve(false);
                    else
                        this.levelGlobalState.put(key, ( +value + +permutation))
                            .then(() => {
                                resolve(true);
                            });
                });
        });
    }
    //#endregion
}

module.exports = LevelDatabase;