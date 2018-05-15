const Database = require('./database');

const db = new Database();


// db.addToGlobalState('0001', '10');
// db.addToGlobalState('0002', '10');
// db.addToGlobalState('0003', '10');
// db.addToGlobalState('0004', '10');
// db.addToGlobalState('0005', '10');
// db.addToGlobalState('0006', '10');
// db.addToGlobalState('0007', '10');
// db.addToGlobalState('0008', '10');
// db.addToGlobalState('0009', '10');
// db.addToGlobalState('0010', '10');
// db.addToGlobalState('0011', '10');
// db.addToGlobalState('0012', '10');
// db.addToGlobalState('0013', '10');
// db.addToGlobalState('0014', '10');
// db.addToGlobalState('0015', '10');
// db.addToGlobalState('0016', '10');
// db.addToGlobalState('0017', '10');
// db.addToGlobalState('0018', '10');
// db.addToGlobalState('0019', '10');
// db.addToGlobalState('0020', '10');





// db.getAll()
// .on('data', function (data) {
//   console.log(data.key, '=', data.value)
// })
// .on('error', function (err) {
//   console.log('Oh my!', err)
// })
// .on('close', function () {
//   console.log('Stream closed')
// })
// .on('end', function () {
//   console.log('Stream ended')
// })

db.getFullGlobalstate().then((resolve) => {
  console.log(resolve);
});