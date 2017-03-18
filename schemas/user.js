/**
 * Created by thomas on 10/03/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {type: String, index: true, required: [true, "Name is missing"]},
}, {
    versionKey: false
});

module.exports = userSchema;