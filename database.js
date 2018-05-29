const LevelDatabase = require('./levelDatabase');
const verbose = true;

class Database {
    constructor(isbackUpValidator = false) {
        this.isbackUpValidator = isbackUpValidator;
        this.levelDB = new LevelDatabase();
    }

    //#region BlockChain

    /**
     * Fetch the full blockchain in an array
     */
    getFullBlockChain() {
        if (this.isbackUpValidator) {
            //MongoDB

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
    getAccountBalance(key) {
        if (this.isbackUpValidator) {
            //MongoDB

        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.getAccountBalance(key)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }

    /**
     * Puts Balance in database
     * @param {string} key = public key
     * @param {number} value = balance
     */
    putAccountBalance(key, value) {
        if (this.isbackUpValidator) {
            //MongoDB

        } else {
            //LevelDB
            return new Promise((resolve) => {
                this.levelDB.putAccountBalance(key, value)
                    .then((value) => {
                        resolve(value);
                    });
            });
        }
    }

    /**
     * Permutate the balance of an account
     * @param {string} key = public key
     * @param {number} permutation = change to balance
     */
    updateAccountBalance(transactionList) {
        if (this.isbackUpValidator) {
            //MongoDB


        } else {
            return new Promise((resolve) => {
                //LevelDB
                let transactions = {};

                //Get all transactions from list and add to hashmap
                transactionList.forEach(({ pubKey, perm }) => {
                    if (!transactions[pubKey]) {
                        transactions[pubKey] = { perm: perm };
                    } else {
                        let val = transactions[pubKey];
                        transactions[pubKey] = { perm: (+perm + +val) };
                    }
                });

                let promises = [];

                for (var x in transactions) {

                    var permutation = animal[x];
                    promises.push(this.levelDB.updateAccountBalance(x, permutation));
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