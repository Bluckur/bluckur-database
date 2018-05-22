const level = require('level');

let verbose;
let db;

class LevelDB {
  constructor(databasePath, verbose = false) {
    this.verbose = verbose;
    this.open(databasePath);
  }

  open(databasePath) {
    this.db = level(databasePath, { createIfMissing: true }, (err, db) => {
      if (err && this.verbose) console.log(err);
    });
  }

  close() {
    this.db.close((err) => {
      if (err && this.verbose) console.log(err);
    });
  }

  /**
     *
     * @param {*} key
     * @param {*} value
     */
  put(key, value) {
    return new Promise((resolve) => {
      this.db.put(key, value, (err) => {
        if (err && this.verbose) console.log(`Unable to put ${value}into the database.`, err); // some kind of I/O error
        resolve(true);
      })
    });
  }

  /**
     * returns a promise
     * @param {*} key
     * @return {*} value
     */
  get(key) {
    return new Promise((resolve) => {
      this.db.get(key, (err, value) => {
        if (err && this.verbose) {
          //console.log(`${key} has no matches`);
          console.log(err);
        }
        if (value) resolve(value);
        resolve(false); //
      });
    });
  }

  /**
     *
     * @param {*} key
     */
  delete(key) {
    return new Promise((resolve) => {
      this.db.del(key, (err) => {
        if (err && this.verbose) console.log(err);
        if (err) resolve(false)
        resolve(true);
      });
    });
  }

  deleteAll(ops) {
    return new Promise((resolve) => {
      this.db.batch(ops, function (err) {
        if (err && this.verbose) return console.log('Error deleting batch!', err)
        if(err) resolve(false);
        resolve(true);
      })
    });
  }

  /**
   *
   * @param {any} key
   * @param {any} value
   * @returns
   * @memberof Database
   */
  update(key, value) {
    return new Promise((resolve) => {
      this.db.batch()
        .del(key)
        .put(key, value)
        .write(() => { resolve(true); });
    });
  }

  /**
   * 
   * @param {long} from Inclusive
   */
  getAll(from) {
    if (from)
      return this.db.createReadStream({ gte: from });
    else
      return this.db.createReadStream();
  }
}

module.exports = LevelDB;
