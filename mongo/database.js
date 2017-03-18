/**
 * Created by thomas on 10/03/17.
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

let mongo = {
    connect: function() {
        let url = 'mongodb://localhost:27017/stadeeztics';
        mongoose.connect(url);
        let mongooseDb = mongoose.connection;
        mongooseDb.on('error', console.error.bind(console, 'connection error:'));
        mongooseDb.once('open', function() {
            console.info('Connected successfully with Mongoose.');
        });
    }
};

module.exports = mongo;