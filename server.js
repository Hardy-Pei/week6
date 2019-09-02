const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const ejs = require('ejs');

let app = express();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({
    extended: false
}));
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";
let db;
let tasks;
let filePath = __dirname + '/views';

//Connect to mongoDB server
MongoClient.connect(url, {
        useNewUrlParser: true
    }, {
        useUnifiedTopology: true
    },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("lab6Task");
            db.collection('tasks').drop(function (erre, ok) {});
            db.createCollection('tasks');
            tasks = db.collection("tasks");
        }
    });

app.get('/', function (req, res) {
    res.sendFile(filePath + '/index.html');
});

app.get('/listtasks', function (req, res) {
    details = tasks.find({}).toArray(function (err, result) {
        res.render('list.html', {
            ar: result
        });
    });
});

app.get('/newtask', function (req, res) {
    details = tasks.find({}).toArray(function (err, result) {
        res.render('new.html', {
            ar: result
        });
    });
});

app.get('/delete', function (req, res) {
    details = tasks.find({}).toArray(function (err, result) {
        res.render('delete.html', {
            ar: result
        });
    });
});

app.get('/deleteAll', function (req, res) {
    tasks.deleteMany({}, function (err, obj) {
        res.redirect('/listtasks');
    });
});

app.get('/update', function (req, res) {
    details = tasks.find({}).toArray(function (err, result) {
        res.render('update.html', {
            ar: result
        });
    });
});

app.post('/deletetask', function (req, res) {
    tasks.deleteOne({
        id: parseInt(req.body.taskid)
    }, function (err, obj) {
        res.redirect('/listtasks');
    });
});

app.post('/newtask', function (req, res) {
    let details = req.body;
    tasks.insertOne({
        id: getNewId(),
        name: details.taskname,
        assign: details.assignto,
        due: new Date(details.duedate),
        status: details.taskstatus,
        desc: details.taskdesc
    });
    res.redirect('/listtasks');
});

app.post("/updatetask", function (req, res) {
    let updateDetail = req.body;
    tasks.updateOne({
        id: parseInt(updateDetail.taskid)
    }, {
        $set: {
            status: updateDetail.taskstatus
        }
    }, function (err, result) {
        res.redirect('/listtasks');
    });
})

function getNewId() {
    return (Math.floor(100000 + Math.random() * 900000));
};

app.listen(8080);