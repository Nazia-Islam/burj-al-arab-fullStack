const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');
require('dotenv').config();

const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./configs/burj-al-arab-bad24-firebase-adminsdk-ppqyh-18a3ed5a3a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.Fire_DB
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbwlu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const password = "burjAlArab";



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArabDB").collection("bookings");
  console.log("*** DB connection successful ***");
  
  // create
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    console.log(newBooking);
    bookings.insertOne(newBooking)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  //read
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if( bearer && bearer.startsWith('Bearer ')){
        const idToken = bearer.split(' ')[1];
        // idToken comes from the client app
        admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
          const tokenEmail = decodedToken.email;
          const queryToken = req.query.email;
          if(tokenEmail == queryToken){
            bookings.find({email:req.query.email})
            .toArray((err, documents) => {
              res.status(200).send(documents);
            })
          }
          else{
            res.status(401).send("Unauthorized access");
          }
        }).catch(function(error) {
          res.status(401).send("Unauthorized access");
        });
    }
    else{
      res.status(401).send("Unauthorized access");
    }
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);