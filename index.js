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
        const database = client.db("travels");
        const serviceCollection = database.collection("services");

        // GET SERVICES API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Id', id);
            const query = { _id: objectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            // const newUser = req.body;
            const result = await serviceCollection.insertOne(service);
            // // console.log('Get new user', req.body);
            // // console.log('add user', result);
            console.log(result)
            res.send(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel BD Server Running');
});

app.listen(port, () => {
    console.log('Travel BD Server on Port', port)
})