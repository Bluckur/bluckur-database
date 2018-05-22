const LevelDB = require('./levelDB');
const verbose = false;
const startNumber = 1000000000;

class LevelDatabase {
    constructor() {
        this.levelBlocks = new LevelDB('./database/level/blocks', verbose);
        this.levelGlobalState = new LevelDB('./database/level/state', verbose);
    }
    //#region BlockChain
    getFullBlockChain() {
        return new Promise((resolve) => {
            let blockChain = [];

            this.levelBlocks.getAll()
                .on('data', function (data) {
                    blockChain.push(data.value);
                    if (verbose) console.log(data.key, '=', data.value)
                })
                .on('error', function (err) {
                    if (verbose) console.log('Error while fetching global state', err);
                    resolve(false);
                })
                .on('end', function () {
                    resolve(blockChain);
                });
        });
    }

    putBlock(blockNr, block) {
        return new Promise((resolve) => {
            this.levelBlocks.put(blockNr + startNumber, block)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    getBlock(blockNr) {
        return new Promise((resolve) => {
            this.levelBlocks.get(blockNr + startNumber)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    deleteFromBlock(blockNr) {
        return new Promise((resolve) => {
            new Promise((resolved) => {
                let batchCommand = [];

                this.levelBlocks.getAll(blockNr + startNumber)
                    .on('data', function (data) {
                        batchCommand.push({ type: 'del', key: data.key });
                        if (verbose) console.log(data.key, '=', data.value)
                    })
                    .on('error', function (err) {
                        if (verbose) console.log('Error while fetching keys', err);
                        resolved(false);
                    })
                    .on('end', function () {
                        resolved(batchCommand);
                    });
            }).then((value) => {
                if (!value) resolve(false);
                else this.levelBlocks.deleteAll(value)
                    .then(() => {
                        resolve(true)
                    });
            });
        });
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
                    resolve(false);
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
                        this.levelGlobalState.put(key, (+value + +permutation))
                            .then(() => {
                                resolve(true);
                            });
                });
        });
    }
    //#endregion
}

module.exports = LevelDatabase;