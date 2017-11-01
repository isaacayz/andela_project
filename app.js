//The server file
var express         =    require('express'),
    app             =    express(),
    methodOverride  =    require('method-override'),
    bodyParser      =    require('body-parser'),
    mongoose        =    require('mongoose'),
    flash           =    require('connect-flash'),
    Task            = require('./api/models/model'); //created model loading here

app.use(express.static(__dirname + '/public'));
mongoose.connect("mongodb://localhost/studentDB");
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(require('connect-flash')());
app.use(methodOverride('_method'));

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

/*Students.create({
    fname: "Ayomide",
    lname: "Ige",
    sex: "M",
    age: 12,
    course: 'Computer Science',
    matric: '14/CS/0613',
    desc: 'Ige Ayomide Isaac also known as Heywhy Tech, created this web app within 5 days!'
}, function (err, created) {
    if(err) {
        console.log(err);
    }  else {
        console.log('Added successfully!');
        console.log(created);
    }
});*/

app.post("/students", function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var sex = req.body.sex;
    var age = req.body.age;
    var course = req.body.course;
    var matric = req.body.matric;
    var desc = req.body.desc;
    var newStudent = {fname: fname, lname: lname, sex: sex, age: age, course: course, matric: matric, desc: desc};

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

app.get("/students/:id", function (req, res) {
    Students.findById(req.params.id, function (err, found) {
       if(err) {
           console.log(err);
       } else {
           res.render('show', {student: found});
       }
    });

});

app.get('/students/:id/edit', function (req, res) {
    Students.findById(req.params.id, function (err, found) {
       if(err) {
           res.redirect('/students');
       } else {
           res.render('edit', {student: found});
       }
    });
});

app.put('/students/:id', function (req, res) {
   Students.findByIdAndUpdate(req.params.id, req.body.student, function (err, found) {
      if(err){
          res.redirect('/students');
      } else {
          res.redirect('/students/' + req.params.id)
      }
   });
});

app.delete('/students/:id', function (req, res) {
    Students.findByIdAndRemove(req.params.id, function (err) {
       if(err){
           res.redirect('/students');
       } else {
           res.redirect('/students');
       }
    });
});

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3000, '127.0.0.1', 511, function (req, res) {
    console.log("Up and running");
});