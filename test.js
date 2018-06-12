const Database = require('./database');

const db = new Database(false);

db.connect().then((value) => {
    db.getFullBlockChain();

    db.getFullGlobalstate().then((resolve) => {
        console.log(resolve);
    });
})