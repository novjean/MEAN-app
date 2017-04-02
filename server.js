var express = require('express');
var app = express();
var mongojs = require('mongojs');

//Databases
var db = mongojs('employeelist', ['employeelist']);
var tdb = mongojs('testsdb', ['testsdb']);
var qadb = mongojs('qandadb', ['qandadb']);
var erdb = mongojs('empresdb', ['empresdb']);

//Additional Dependencies
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

/////// Employeelist DB

app.get('/employeelist/:useraccess', function (req, res) {
    var input = req.params.useraccess;
    console.log(input);
    if (input == 'Employee' || input == 'Trainer') {
        console.log("Received GET by useraccess request");
        db.employeelist.find({ "useraccess": input }).sort({ firstname: 1 }, function (err, docs) {
            //console.log(docs);
            res.json(docs);
        })
    } 
    else {
        console.log("Received GET by id request");
        db.employeelist.findOne({ _id: mongojs.ObjectId(input) }, function (err, doc) {
            res.json(doc);
        })
    }
});

//Retrieve the entire list for login
app.get('/employeelist', function (req, res) {
    db.employeelist.find(function (err, doc) {
        res.json(doc);
    })
})

// Adding value
app.post('/employeelist', function (req, res) {
    console.log("Inserted: " + req.body);
    db.employeelist.insert(req.body, function (err, doc) {
        res.json(doc);					//this will send the data back to the controller
    })
});

app.delete('/employeelist/:id', function (req, res) {
    var id = req.params.id;
    console.log("Deleted: " + id);
    db.employeelist.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    })
});

//Updating 
app.put('/employeelist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.employeelist.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: {
            $set: {
                firstname: req.body.firstname, lastname: req.body.lastname,
                class: req.body.class, email: req.body.email, number: req.body.number
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    })
});

//Check db connection
db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})


////////// Tests DB 

app.get('/testsdb', function (req, res) {
    console.log("GET from testsdb");
    tdb.testsdb.find(function (err, doc) {
        res.json(doc);
    })
});

app.get('/testsdb/:input', function(req, res){
    var input = req.params.input;
    console.log("GET request for test id: " + input);
    tdb.testsdb.findOne({ _id: mongojs.ObjectId(input) }, function (err, doc) {
            res.json(doc);
    })
});

app.post('/testsdb', function (req, res) {
    console.log("Inserted Test: " + req.body);
    tdb.testsdb.insert(req.body, function (err, doc) {
        res.json(doc);					
    })
});

app.put('/testsdb/:id', function (req, res) {
    var id = req.params.id;
    console.log("Updated testsdb id: " + id + " with "+ req.body.name);
    tdb.testsdb.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: {
            $set: {
                title: req.body.title, 
                domain: req.body.domain,
                type: req.body.type, 
                author: req.body.author, 
                createDate: req.body.createDate
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    })
});

app.delete('/testsdb/:id', function (req, res) {
    var id = req.params.id;
    // console.log("Deleted testdb id: " + id);
    tdb.testsdb.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    })
});

tdb.on('error', function (err) {
    console.log('testsdb database error', err)
});

tdb.on('connect', function () {
    console.log('testsdb database connected')
});

//////////// QandA DB

app.get('/qandadb', function (req, res) {
    // console.log("GET from qandadb");
    qadb.qandadb.find(function (err, docs) {
        res.json(docs);
    })
});

app.get('/qandadb/:input', function(res, req){
    var input = req.params.input;
    // console.log("GET all questions for testID: " + input);
    qadb.qandadb.find({"testid": input}, function(err,docs){
        res.json(docs);
    })
});

app.post('/qandadb', function (req, res) {
    // console.log("Inserted Question: " + req.body);
    qadb.qandadb.insert(req.body, function (err, doc) {
        res.json(doc);
    })
});

qadb.on('error', function (err) {
    console.log('qandadb database error', err)
});

qadb.on('connect', function () {
    console.log('qandadb database connected')
});


///////////// EmpRes DB

app.get('/empresdb', function (req, res) {
    // console.log("GET from empresdb");
    erdb.empresdb.find(function (err, docs) {
        res.json(docs);
    })
});

app.post('/empresdb', function (req, res) {
    // console.log("Inserted Result: " + req.body);
    erdb.empresdb.insert(req.body, function (err, doc) {
        res.json(doc);
    })
});


erdb.on('error', function (err) {
    console.log('empresdb database error', err)
});

erdb.on('connect', function () {
    console.log('empresdb database connected')
});

app.listen(3001);
console.log("Server running on port 3001");
