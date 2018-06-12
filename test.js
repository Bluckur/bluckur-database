const Database = require('./database');

const db = new Database(true);

db.connect().then((value) => {
    db.getFullBlockChain();

    db.getFullGlobalstate().then((resolve) => {
        console.log(resolve);
    });
})