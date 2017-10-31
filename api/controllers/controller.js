'use strict';

var mongoose = require('mongoose');
var Students = mongoose.model('Student');

exports.list_all_student = function(req, res) {
    Students.find({}, function(err, student) {
        if (err)
            res.send(err);
        res.json(student);
    });
};

exports.create_a_student = function(req, res) {
    var new_student = new Students(req.body);
    new_student.save(function(err, student) {
        if (err)
            res.send(err);
        req.flash('success', 'Added successfully!');
        res.json(student);
    });
};

exports.read_a_student = function(req, res) {
    Students.findById(req.params.id, function(err, student) {
        if (err)
            res.send(err);
        res.json(student);
    });
};

exports.update_a_student = function(req, res) {
    Students.findOneAndUpdate({_id: req.params.studentId}, req.body, {new: true}, function(err, student) {
        if (err)
            res.send(err);
        req.flash('success', 'Student details Updated');
        res.json(student);
    });
};

exports.delete_a_student = function(req, res) {
    Students.remove({_id: req.params.studentId}, function(err, student) {
        if (err)
            res.send(err);
        req.flash('danger', 'Student successfully deleted');
    });
};