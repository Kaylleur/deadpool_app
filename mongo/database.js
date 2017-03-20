/**
 * Created by thomas on 10/03/17.
 */
const MongoClient = require('mongodb').MongoClient;

let mongo = {
    connect: function() {
        let url = 'mongodb://localhost:27017/devops';

        MongoClient.connect(url, function(err, db) {
            if (err) console.error('connection error: ' + err);
            else console.log('Connected successfully with Mongo ');

            mongo.db = db;
        });
    }
};

module.exports = mongo;