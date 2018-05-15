const LevelDB = require('./levelDB');
const verbose = false;

class Database {
    constructor(isBackupValidator = false) {
        this.levelBlocks = new LevelDB('../database/level/blocks', verbose);
        this.levelGlobalState = new LevelDB('../database/level/state', verbose);
        this.isBackupValidator = isBackupValidator
    }

    getFullBlockChain() {

    }
    addToGlobalState(key, value) {
        return new Promise((resolve) => {
            this.levelGlobalState.put(key, value)
                .then(() => {
                    resolve(true);
                });
        });
    }

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
}

module.exports = Database;