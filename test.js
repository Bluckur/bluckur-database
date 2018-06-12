const Database = require('./database');

<<<<<<< HEAD
const db = new Database();
=======
const db = new Database(false);
>>>>>>> master

db.connect().then((value) => {
    db.getFullBlockChain();

    db.getFullGlobalstate().then((resolve) => {
        console.log(resolve);
    });
});
