const LevelDB = require('./levelDB');
const startNumber = 1000000000;

class LevelDatabase {
    constructor(verbose) {
        this.verbose = verbose;
        this.levelBlocks = new LevelDB('./database/level/blocks', verbose);
        this.levelGlobalState = new LevelDB('./database/level/state', verbose);
    }
    //#region BlockChain

    /**
     * Fetch the full blockchain in an array
     */
    getFullBlockChain() {
        return new Promise((resolve) => {
            let blockChain = [];

            this.levelBlocks.getAll()
                .on('data', function (data) {
                    blockChain.push(data.value);
                    if (this.verbose) console.log(data.key, '=', data.value)
                })
                .on('error', function (err) {
                    if (this.verbose) console.log('Error while fetching global state', err);
                    resolve(false);
                })
                .on('end', function () {
                    resolve(blockChain);
                });
        });
    }

    /**
     * Put block in database. 
     * @param {number} blockNr = block.blockheader.blockNumber
     * @param {JSON} block 
     */
    putBlock(blockNr, block) {
        return new Promise((resolve) => {
            this.levelBlocks.put(blockNr + startNumber, block)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    /**
     * Gets block from database.
     * @param {number} blockNr = block.blockheader.blockNumber
     */
    getBlock(blockNr) {
        return new Promise((resolve) => {
            this.levelBlocks.get(blockNr + startNumber)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    /**
     * Delete all blocks from blockNr onwards.
     * @param {number} blockNr = block.blockheader.blockNumber
     */
    deleteFromBlock(blockNr) {
        return new Promise((resolve) => {
            new Promise((resolved) => {
                let batchCommand = [];

                this.levelBlocks.getAll(blockNr + startNumber)
                    .on('data', function (data) {
                        batchCommand.push({ type: 'del', key: data.key });
                        if (this.verbose) console.log(data.key, '=>', data.value)
                    })
                    .on('error', function (err) {
                        if (this.verbose) console.log('Error while fetching keys', err);
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

    /**
     * Gets global state from database
     */
    getFullGlobalstate() {
        return new Promise((resolve) => {
            let globalState = [];

            this.levelGlobalState.getAll()
                .on('data', function (data) {
                    globalState.push(data);
                    if (this.verbose) console.log(data.key, '=', data.value)
                })
                .on('error', function (err) {
                    if (this.verbose) console.log('Error while fetching global state', err);
                    resolve(false);
                })
                .on('end', function () {
                    resolve(globalState);
                });
        });
    }

    setFullGlobalState() {
        //TODO maybe
    }

    /**
     * Gets wallet from database.
     * @param {string} key = public key
     */
    getAccountWallet(key) {
        return new Promise((resolve) => {
            this.levelGlobalState.get(key)
                .then((value) => {
                    resolve(value)
                });
        });
    }

    /**
     * Puts Balance in database
     * @param {string} key = public key
     * @param {wallet} value = balance {coinPerm, stakePerm}
     */
    putAccountWallet(key, value) {
        return new Promise((resolve) => {
            this.levelGlobalState.put(key, JSON.stringify(value))
                .then((value) => {
                    resolve(value)
                });
        });
    }

    /**
     * Permutate the balance of an account
     * @param {string} key = public key
     * @param {wallet} permutation = change to balance
     */
    updateAccountWallet(key, wallet) {
        return new Promise((resolve) => {
            this.levelGlobalState.get(key)
                .then((value) => {
                    if (!value)
                        this.putAccountWallet(key, wallet);
                    else {
                        let wal = JSON.parse(value);
                        // console.log(wal)
                        // console.log(wallet)
                        wallet.coin += wal.coin;
                        wallet.stake += wal.stake;
                        this.putAccountWallet(key, wallet)
                            .then((value) => {
                                resolve(value)
                            });
                    }

                });
        });
    }
    //#endregion
}

module.exports = LevelDatabase;