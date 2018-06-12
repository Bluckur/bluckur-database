const Database = require('./database');

const db = new Database(true);

db.getFullBlockChain();

db.getFullGlobalstate().then((resolve) => {
    console.log(resolve);
});