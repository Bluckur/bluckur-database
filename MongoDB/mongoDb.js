"use strict"

const mongoose = require('mongoose');
const config = require('./config');

import { Block } from 'bluckur-models/schemas/block'
import { Wallet } from 'bluckur-models/schemas/wallet'

let db;

let verbose;

/**
 * Load Schemas
 */

/*
* Load Models
*/
let Block;
let GameCharacter;

class MongoDatabase {
    constructor(verbose) 
    {
        mongoose.connect('mongodb://'+
            config.login.user      +':'+
            config.login.password  +'@'+
            config.host            +':'+
            config.port            +'/'+
            config.db
        );

        Block = mongoose.model('Block');
        Wallet = mongoose.model('Wallet');

        db = mongoose.connection;

        this.verbose = verbose;
    }

    connect()
    {
        /**
         * Open the database connection
         */
        db.once('open', function(){
            console.log('Connected to MongoDB');
        })

        /**
         * Database error handling
         */
        db.on('error', console.error.bind(console, 'Database connection error:'));
    }

    getFullBlockChain(){
        Block.find({ "header": { $ne: null } }, { 'header': 1, _id: 0 }, function(err, blocks){
            if(err) console.log(err);
            else return blocks;
        });

        return undefined;
    }

    putBlock(blockData){
        let block = new Block(JSON.parse(blockData));
        block.save(function (err) {
            if (err) return handleError(err);
            else if(verbose)
                console.log("[MongoDB]: Block saved succesfully");
        });

        return undefined;
    }

    getBlock(blockNr)
    {
        Block.findOne({}, { _id: 0, __v: 0 }).where('header.blockNumber').equals(blockNr), function(err, block){
            if(err) console.log(err);
            else return block;
        }

        return undefined;
    }

    getFullGlobalState()
    {
        Wallet.find({ "publicKey": { $ne: null } }, function(err, wallets){
            if(err) console.log(err);
            else return wallets;
        });

        return undefined;
    }

    getAccountWallet(walletKey)
    {
        Wallet.findOne({}, { _id: 0, __v: 0 }).where('publicKey').equals(walletKey), function(err, wallet){
            if(err) console.log(err);
            else return wallet;
        }

        return undefined;
    }

    putAccountWallet(walletData){
        let wallet = new Wallet(JSON.parse(walletData));
        wallet.save(function (err) {
            if (err) return handleError(err);
            else if(verbose)
                console.log("[MongoDB]: New wallet saved succesfully");
        });

        return undefined;
    }

    updateAccountWallet(key, newData){
        Wallet.findOneAndUpdate({'publicKey': key}, newData, {upsert:true}, function(err, doc){
            if (err) return handleError(err);
            return
            {
                console.log("[MongoDB]: Wallet updated succesfully");
                return doc;
            }
        });

        return undefined;
    }
}