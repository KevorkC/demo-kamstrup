let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Brug denne når du starter applikationen lokalt med node-kommandoen
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// Brug denne når du starter applikationen som en separat Docker-container
let mongoUrlDocker = "mongodb://admin:password@host.docker.internal:27017";

// Brug denne når du starter applikationen som Docker-container, som en del af docker-compose
let mongoUrlDockerCompose = "mongodb://admin:password@mongodb";

// Brug denne når du starter applikationen i Kubernetes
let mongoK8sUrl = process.env.MONGO_URL;

// Send disse indstillinger til mongo klientens forbindelsesanmodning for at undgå DeprecationWarning for den nuværende Server Discovery og Monitoring-motor
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" i demo med docker. "my-db" i demo med docker-compose
let databaseName = "user-account";

// Kommer an på deployment metode
let mongoVersion = mongoK8sUrl //mongoUrlDockerCompose 

app.post('/update-profile', function (req, res) {
  //
  console.log('User profile updated');
  console.log('Connecting to MongoDB at:', mongoVersion);
  MongoClient.connect(mongoVersion, mongoClientOptions, function (err, client) {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
    console.log('Connected to MongoDB');
  });
  //

  let userObj = req.body;

  MongoClient.connect(mongoVersion, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, { upsert: true }, function (err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect til db
  MongoClient.connect(mongoVersion, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send respons
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
  console.log('MONGO_URL =', process.env.MONGO_URL)
});

