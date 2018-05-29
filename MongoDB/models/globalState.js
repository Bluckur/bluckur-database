let mongoose = require('mongoose');

let globalStateSchema = mongoose.Schema({

});

module.exports = mongoose.model('GlobalState', globalStateSchema);