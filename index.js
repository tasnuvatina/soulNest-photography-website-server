const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.et2e1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookingCollection = client
    .db("weddingPhotography")
    .collection("booking");
  const servicesCollection = client
    .db("weddingPhotography")
    .collection("services");
  const reviewCollection = client
    .db("weddingPhotography")
    .collection("reviews");
    const adminCollection = client
    .db("weddingPhotography")
    .collection("admins");

  //post booking from user
  app.post("/addBooking", (req, res) => {
    let booking = req.body;
    bookingCollection.insertOne(booking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //get bookings for specific email
  app.get("/getBookings/:email", (req, res) => {
    bookingCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  //get all bookings
  app.get('/getAllBooking',(req,res)=>{
    bookingCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  //update booking status
  app.patch('/updateBookingStatus/:id',(req,res)=>{
      bookingCollection.updateOne({_id:ObjectID(req.params.id)},
      {
        $set:{status:req.body.status}
      })
      .then(result=>{
        res.send(result.modifiedCount>0)
      })
  })
  //get all services
  app.get("/services", (req, res) => {
    servicesCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  //get single service using id
  app.get("/singleService/:id", (req, res) => {
    servicesCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
  
  //post to add new service
  app.post("/addService", (req, res) => {
    let newService = req.body;
    servicesCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //delete one service
  app.delete('/deleteService/:id',(req,res)=>{
    servicesCollection.deleteOne({_id:ObjectID(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })
  //get single service
  app.get('/singleService/:id',(req,res)=>{
    servicesCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  //update a service
  app.patch('/updateService/:id',(req,res)=>{
    servicesCollection.updateOne({_id:ObjectID(req.params.id)},
    {
      $set:{name:req.body.name,price:req.body.price,description:req.body.description}
    })
    .then(result=>{
      res.send(result.modifiedCount>0)
    })
})

  //post review
  app.post('/addReview',(req,res)=>{
    let newReview=req.body;
    reviewCollection.insertOne(newReview)
    .then((result)=>{
      res.send(result.insertedCount>0)
    })
  })
  //get all reviews
  app.get('/getAllReviews',(req,res)=>{
    reviewCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  //add new admin
  app.post("/addAdmin", (req, res) => {
    let newAdmin = req.body;
    adminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //get admin to check if user is admin or not
  app.get('/getAdmin/:email',(req,res)=>{
    adminCollection.find({email:req.params.email})
    .toArray((err,documents)=>{
      res.send(documents.length>0)
    })
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
