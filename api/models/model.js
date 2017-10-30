'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    fname: String,
    lname: String,
    sex: String,
    age: Date,
    course: String
});

module.exports = mongoose.model('Student', studentSchema);