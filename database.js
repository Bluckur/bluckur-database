const levelDB = require('./levelDB');
const verbose = true;

class Database {
    constructor(isBackupValidator = false) {
        this.levelBlocks = new levelDB('../database/level/blocks', verbose);
        this.levelGlobalState = new levelDB('../database/level/state', verbose);
        this.isBackupValidator = isBackupValidator
    }

    getFullBlockChain(){

    }

    getFullGlobalstate(){

    }
}

module.exports = Database;