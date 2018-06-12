

const mongoose = require('mongoose');
const config = require('./config');

const blueprints = require('bluckur-models');

let db;

let verbose;

/*
 * Models
 */
let Block;
let Wallet;
const connected = false;
class MongoDatabase {
  constructor(verbose) {
    const BlockSchema = new mongoose.Schema(blueprints.blockBlueprint);
    Block = mongoose.model('Block', BlockSchema);

    const WalletSchema = new mongoose.Schema(blueprints.walletBlueprint);
    Wallet = mongoose.model('Wallet', WalletSchema);

    db = mongoose.connection;
    this.verbose = verbose;
  }

  connect() {
    return new Promise((resolve, reject) => {
      db.on('error', (error) => {
        console.error.bind(console, 'Database connection error:');
        reject(error);
      });

      mongoose.connect(`mongodb://${
        config.login.user}:${
        config.login.password}@${
        config.host}:${
        config.port}/${
        config.db}`).then((mongoose) => {
        resolve();
        this.connected = true;
      });
    });
  }

  getFullBlockChain() {
    return new Promise((resolve) => {
      Block.find({ header: { $ne: null } }, { header: 1, _id: 0 }, (err, blocks) => {
        if (err) console.log(err);
        if (blocks) resolve(blocks);
        resolve(false);
      });
    });
  }

  putBlock(blockData) {
    return new Promise((resolve, reject) => {
      const block = new Block(blockData);
      block.save((err) => {
        if (err) {
          reject(err);
        } else if (verbose) { console.log('[MongoDB]: Block saved succesfully'); }
        resolve(true);
      });
    });
  }

  getBlock(blockNr) {
    return new Promise((resolve) => {
      Block.findOne({}, { _id: 0, __v: 0 }).where('header.blockNumber').equals(blockNr),
      function (err, block) {
        if (err) console.log(err);
        if (block) resolve(block);
        resolve(false);
      };
    });
  }

  getFullGlobalState() {
    return new Promise((resolve) => {
      Wallet.find({ publicKey: { $ne: null } }, (err, wallets) => {
        if (err) console.log(err);
        if (wallets) resolve(wallets);
        resolve(false);
      });
    });
  }

  getAccountWallet(walletKey) {
    return new Promise((resolve) => {
      Wallet.findOne({}, { _id: 0, __v: 0 }).where('publicKey').equals(walletKey),
      function (err, wallet) {
        if (err) console.log(err);
        if (wallet) resolve(wallet);
        resolve(false);
      };
    });
  }

  putAccountWallet(wallet) {
    return new Promise((resolve) => {
      const wallet = new Wallet(wallet);
      wallet.save((err) => {
        if (err) {
          handleError(err);
          resolve(true);
        } else if (verbose) { console.log('[MongoDB]: New wallet saved succesfully'); }
        resolve(true);
      });
    });
  }

  updateAccountWallet(key, newData) {
    return new Promise((resolve) => {
      Wallet.findOneAndUpdate({ publicKey: key }, newData, { upsert: true }, (err, doc) => {
        if (err) {
          handleError(err);
          resolve(false);
        }
        if (verbose) console.log('[MongoDB]: Wallet updated succesfully');
        resovle(true);
      });
    });
  }
}
module.exports = MongoDatabase;
