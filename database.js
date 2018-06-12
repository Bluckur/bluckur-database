const LevelDatabase = require('./levelDatabase');
const MongoDatabase = require('./MongoDB/mongoDb');
const verbose = true;
let db;
let connected = false;

class Database {
    constructor(isbackUpValidator = false) {
        this.isbackUpValidator = isbackUpValidator;
        if (this.isbackUpValidator) {
            this.db = new MongoDatabase(true);
        } else {
            this.db = new LevelDatabase();
            this.connected = true;
        }
    }

    connect() {
            return new Promise((resolve, reject) => {
                this.db.connect().then((value) => {
                    this.connected = true;
                    resolve();
                }).catch((exception) => {
                    this.connected = false
                    reject(exception);
                });
            });
        }
        //#region BlockChain

    /**
     * Fetch the full blockchain in an array
     */
    getFullBlockChain() {
        return new Promise((resolve) => {
            this.db.getFullBlockChain()
                .then((value) => {
                    resolve(value);
                });
        });
    }

    /**
     * Put block in database.
     * @param {Block} block must comply to the model block
     */
    putBlock(block) {
        return new Promise((resolve) => {
            this.db.putBlock(block)
                .then((value) => {
                    resolve(value);
                });
        });
    }

    /**
     * Gets block from database.
     * @param {number} blockNr
     */
    getBlock(blockNr) {
        return new Promise((resolve) => {
            this.levelDB.getBlock(blockNr)
                .then((value) => {
                    resolve(value);
                });
        });
    }

    /**
     * Delete all blocks from blockNr onwards.
     * @param {number} blockNr = block.blockheader.blockNumber
     */
    deleteFromBlock(blockNr) {
            return new Promise((resolve) => {
                this.db.deleteFromBlock(blockNr)
                    .then((value) => {
                        resolve(value);
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
            this.db.getFullGlobalState()
                .then((value) => {
                    resolve(value);
                });
        });
    }

    setFullGlobalState() {
        //TODO maybe
    }

    /**
     * Gets balance from database.
     * @param {string} key = public key
     */
    getAccountWallet(key) {
        return new Promise((resolve) => {
            this.db.getAccountWallet(key)
                .then((value) => {
                    resolve(value);
                });
        });
    }

    /**
     * Puts Balance in database
     * @param {wallet} wallet = wallet object
     */
    putAccountWallet(wallet) {
        return new Promise((resolve) => {
            this.db.putAccountWallet(wallet)
                .then((value) => {
                    resolve(value);
                });
        });
    }

    /**
     *
     * @param {Array<>} transactionList
     */
    updateAccountWallet(transactionList) {
        let transactions = {};
        //Get all transactions from list and add to hashmap
        transactionList.forEach(({ pubKey, coin, stake }) => {
            if (!transactions[pubKey]) {
                transactions[pubKey] = {
                    pubKey: pubKey,
                    coin: coin,
                    stake: stake
                };
            } else {
                let val = transactions[pubKey];
                transactions[pubKey] = {
                    pubKey: pubKey,
                    coin: (coin + val.coin),
                    stake: (stake + val.stake)
                };
            }
        });

        return new Promise((resolve) => {
            //LevelDB
            let promises = [];
            for (var x in transactions) {
                var transaction = transactions[x];
                promises.push(this.db.updateAccountWallet(x, transaction));
            }
            Promise.all(promises).then((value) => {
                resolve(value);
            });
        });
        //#endregion
    }
}

module.exports = Database;
