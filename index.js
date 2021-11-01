const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cuja6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('tourPlannerDb');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');
        // console.log(serviceCollection);

        //GET API allservices
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET single
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting single', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //GET manage
        app.get('/manage/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('manage', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API addservices
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //POST API addorders
        app.post('/addOrder', async (req, res) => {
            const service = req.body;
            // console.log('hit the booking api', service);

            const result = await ordersCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        //GET myorders
        app.get('/myOrders/:email', async (req, res) => {
            //console.log(req.params.email);

            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            // console.log(result);
            res.send(result);
        });

        //GET allOrders
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });


        //DELETE API myOrder
        app.delete('/deleteMyOrder/:id', async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
            // console.log(result);
        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tour planner server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})