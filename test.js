const Database = require('./database');

const db = new LevelDB('../database');


db.put('0001', '10');
db.put('0002', '10');
db.put('0003', '10');
db.put('0004', '10');
db.put('0005', '10');
db.put('0006', '10');
db.put('0007', '10');
db.put('0008', '10');
db.put('0009', '10');
db.put('0010', '10');
db.put('0011', '10');
db.put('0012', '10');
db.put('0013', '10');
db.put('0014', '10');
db.put('0015', '10');
db.put('0016', '10');
db.put('0017', '10');
db.put('0018', '10');
db.put('0019', '10');
db.put('0020', '10');





db.getAll()
.on('data', function (data) {
  console.log(data.key, '=', data.value)
})
.on('error', function (err) {
  console.log('Oh my!', err)
})
.on('close', function () {
  console.log('Stream closed')
})
.on('end', function () {
  console.log('Stream ended')
})