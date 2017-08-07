// dependency requirement for libraries
const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// const path = require('path');
const mustacheExpress = require('mustache-express');

// create app instance for Express
const app = express();

// Configure Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// run this command at the terminal to import the senator data into Mongo
// mongoimport --db senatorsdb --collection senators --file senators.json
var url = 'mongodb://localhost:27017/senatorsdb';

// Allows public folder to be served statically to browsers
app.use(express.static('public'));

// Connect templating engine to app instance
app.engine('mustache', mustacheExpress());
// Connect views folder to views name in app instance
app.set('views', './views');
// Connect view engine to mustache
app.set('view engine', 'mustache');

var findAllSenators = function(db, callback) {
  var collection = db.collection('senators');
  collection.find().sort({ "person.lastname": 1 }).toArray(function(err, results) {
    callback(results);
  });
};

var findLargestId = function(db, callback) {
  var collection = db.collection('senators');
  collection.find().sort({ id:-1 }).toArray(function(err, results) {
    db.close();
    callback(parseInt(results[0].id));
  });
};

var findSpecificSenator = function(db, id, callback) {
  var collection = db.collection('senators');
  collection.findOne({ "id": id }, function(err, doc) {
    db.close();
    if (err) {
      console.log('Error fetching specific senator with id: ' + id);
    } else {
      callback(doc);
    }
  });
};

var deleteSpecificSenator = function(db, id, callback) {
  var collection = db.collection('senators');
  collection.deleteOne({ "id": id }).then(function(result) {
    db.close();
    if (result.deletedCount == 1) {
      callback(true);
    } else {
      callback(false);
    }
  }).catch(function(error) {
    console.log('Error deleting record');
  });
};

app.get('/', function (req, res) {
  // render a page template called index and pass an object
  mongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error connecting to Mongo DB: ' + err);
    } else {
      findAllSenators(db, function(results) {
        res.render('index', { senators: results });
      });
    }
  });
});

app.get('/add_senator', function(req, res) {
  mongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error connecting to Mongo DB: ' + err);
    } else {
      findLargestId(db, function(id) {
        res.render('add_senator', {'newId': id+1});
      });
    }
  // res.render('add_senator');
  });
});

app.post('/add_senator', function(req, res) {
  mongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error connecting to Mongo DB: ' + err);
    } else {
      db.collection('senators').insertOne({
        "id": req.body.id,
        "party": req.body.party,
        "state": req.body.state,
        "person": { "gender": req.body.gender,
                    "firstname": req.body.name.split(" ")[0],
                    "lastname": req.body.name.split(" ")[1],
                    "birthday": req.body.birthdate },
      });
      findAllSenators(db, function(results) {
        res.render('index', { senators: results });
      });
    }
  });
});

app.get('/:id', function (req, res) {
  mongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error connecting to Mongo DB: ' + err);
    } else {
      findSpecificSenator(db, parseInt(req.params.id), function(foundSenator) {
        res.render('specific_senator', { senator: foundSenator });
      });
    }
  })
});

app.post('/:id', function (req, res) {
  mongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error connecting to Mongo DB: ' + err);
    } else {
      deleteSpecificSenator(db, parseInt(req.params.id), function(success) {
        if (success) {
          console.log('successful deletion!');
          res.redirect('/');
        } else {
          console.log('Delete unsuccessful');
        }
      })
    }
  });
});

// make app listen on a particular port (starts server)
app.listen(3000, function () {
  console.log('Successfully started express application!');
});