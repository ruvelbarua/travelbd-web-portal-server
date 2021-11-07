const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziv9h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("travels").collection("services")

        const bookingsCollection = client.db("travels").collection("bookings")
        // // const database = client.db("travels");
        // // const serviceCollection = database.collection("services");

        // const database = client.db("travels");
        // const bookingsCollection = database.collection("bookings");

        // GET SERVICES API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        });

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Id', id);
            const query = { _id: objectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        // POST BOOKING DATA
        app.post("/myBooking", async (req, res) => {
            const order = req.body;
            const result = await bookingsCollection.insertOne(order);
            res.send(result);
        });

        // GET BOOKING DATA
        app.get("/myOrders/:id", async (req, res) => {
            const id = req.params.id;
            console.log('Getting Id', id);
            const query = { _id: objectId(id) };
            const service = await bookingsCollection.findOne(query);
            res.json(service);

            // const result = await bookingsCollection
            //     .find({ email: req.params.email })
            //     .toArray();
            // res.send(result);
        });



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel BD Server Running');
});

// app.listen(process.env.PORT || port)

app.listen(port, () => {
    console.log('Travel BD Server on Port', port)
})