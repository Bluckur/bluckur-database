"use strict"

const mongoose = require('mongoose');
const mongoose = require('./config');

let db;

let verbose;

/**
 * Load Schemas
 */
let blockSchema         = require('./models/block');
let globalStateSchema   = require('./models/globalState');

/*
* Load Models
*/
let Block;
let GameCharacter;

class MongoDB {
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
        GlobalState = mongoose.model('GlobalState');

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

    putBlock(blockData){
        let block = new Block(JSON.parse(blockData));
        block.save(function (err) {
            if (err) return handleError(err);
            else if(verbose)
                console.log("[MongoDB]: Block saved succesfully");
        });
    }

    putGlobalState(stateData){
        let state = new Block(JSON.parse(stateData));
        state.save(function (err) {
            if (err) return handleError(err);
            else if(verbose)
                console.log("[MongoDB]: Global state saved succesfully");
        });
    }

    updateGlobalState(){

    }
}