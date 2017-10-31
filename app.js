//The server file
var express     =    require('express'),
    app         =    express(),
    bodyParser  =    require('body-parser'),
    mongoose    =    require('mongoose'),
    flash        =    require('connect-flash'),
    Task = require('./api/models/model'); //created model loading here

mongoose.connect("mongodb://localhost/studentDB");
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(require('connect-flash')())

app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

app.set('view engine', 'ejs');
var Students = mongoose.model('Student');

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/students", function (req, res) {
    Students.find({}, function (err, allStudents) {
       if(err) {
           console.log(err);
       } else {
           res.render('students', {students: allStudents});
       }
    });

});

app.post("/students", function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var sex = req.body.sex;
    var age = req.body.age;
    var course = req.body.course;
    var newStudent = {fname: fname, lname: lname, sex: sex, age: age, course: course};

    Students.create(newStudent, function (err, created) {
        if(err) {
            console.log(err);
        }  else {
            console.log('Added successfully!');
            console.log(created);
        }
    });
    res.redirect("students");
});

app.get("/students/new", function (req, res) {
    res.render("new");
});

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3000, '127.0.0.1', 511, function (req, res) {
    console.log("Up and running");
});