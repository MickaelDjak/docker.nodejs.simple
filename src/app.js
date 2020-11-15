let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    console.log('/');
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get('/profile-picture', function (req, res) {
    console.log('/profile-picture');
    let img = fs.readFileSync(path.resolve(__dirname, "./profile.jpg"));
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

const list = [
    `mongodb://admin:rootpass@localhost:27018`,
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@localhost:27018`,
    `mongodb://admin:rootpass@mongodb`,
    `mongodb://admin:rootpass@mongodb:27017`
];

let mongoUrlLocal = list[2];

app.post('/update-profile', function (req, res) {
    console.log('/update-profile');
    let userObj = req.body;

    MongoClient.connect(
        mongoUrlLocal,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        function (err, client) {
        if (err) throw err;

        let db = client.db('my-db');
        userObj['userid'] = 1;

        const myquery = { userid: 1 };
        const newvalues = { $set: userObj };

        db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
            if (err) throw err;
            client.close();
        });

    });
    res.send(userObj);
});

app.get('/get-profile', function (req, res) {
    console.log('/get-profile');

    let response = {};
    MongoClient.connect(mongoUrlLocal,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
          (err, client)  => {
        if (err) throw err;

        let db = client.db('my-db');

        let myquery = { userid: 1 };

        db.collection("users").findOne(myquery, function (err, result) {
            if (err) throw err;
            response = result;
            client.close();

            // Send response
            res.send(response ? response : {});
        });
    });
});

app.listen(3000, function () {
    console.log("app listening on port 3000!");
});
