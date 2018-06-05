const LevelDatabase = require('./levelDatabase');
const MongoDatabase = require('./MongoDB/mongoDb');
const verbose = true;

class Database {
    constructor(isbackUpValidator = false) {
        this.isbackUpValidator = isbackUpValidator;
        this.levelDB = new LevelDatabase();
        this.mongoDB = new MongoDatabase(true);

        this.mongoDB.connect();
    }

    //#region BlockChain

    /**
     * Fetch the full blockchain in an array
     */
    getFullBlockChain() {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.getFullBlockChain()
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.getFullBlockChain()
                    .then((value) => {
                        resolve(value);
                    });
            });

        }
    }

    /**
     * Put block in database. 
     * @param {Block} block must comply to the model block
     */
    putBlock(block) {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.putBlock(block)
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.putBlock(block.blockHeader.blockNumber, JSON.stringify(block))
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }

    /**
     * Gets block from database.
     * @param {number} blockNr 
     */
    getBlock(blockNr) {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.getBlock(blockNr)
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.getBlock(blockNr)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }

    /**
     * Delete all blocks from blockNr onwards.
     * @param {number} blockNr = block.blockheader.blockNumber
     */
    deleteFromBlock(blockNr) {
        if (this.isbackUpValidator) {
            //MongoDB

        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.deleteFromBlock(blockNr)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }
    //#endregion

    //#region GlobalState

    /**
     * Gets global state from database
     */
    getFullGlobalstate() {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.getFullGlobalState()
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.getFullGlobalstate()
                    .then((value) => {
                        resolve(value);
                    })
            });
        }
    }

    setFullGlobalState() {
        //TODO maybe
    }

    /**
    * Gets balance from database.
    * @param {string} key = public key
    */
    getAccountWallet(key) {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.getAccountWallet(key)
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.getAccountWallet(key)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }

    /**
     * Puts Balance in database
     * @param {wallet} wallet = wallet object
     */
    putAccountWallet(wallet) {
        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                this.mongoDB.putAccountWallet(wallet)
                    .then((value) => {
                        resolve(value);
                    });
            });
        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.putAccountWallet(wallet.publicKey, wallet)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
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
                    coin: coin,
                    stake: stake
                };
            } else {
                let val = transactions[pubKey];
                transactions[pubKey] = {
                    coin: (+coin + +val.coin),
                    stake: (+stake + +val.stake)
                };
            }
        });

        if (this.isbackUpValidator) {
            //MongoDB
            return new Promise((resolve) => {
                let promises = [];

                for (var x in transactions) {

                    var transaction = transactions[x];
                    promises.push(this.mongoDB.updateAccountWallet(x, transaction));
                }
                Promise.all(promises).then((value) => {
                    resolve(value);
                });
            });

        } else {
            return new Promise((resolve) => {
                //LevelDB

                let promises = [];

                for (var x in transactions) {

                    var transaction = transactions[x];
                    promises.push(this.levelDB.updateAccountWallet(x, transaction));
                }
                Promise.all(promises).then((value) => {
                    resolve(value);
                });
            });
        }
    }
    //#endregion
}

module.exports = Database;