require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send(`coffee server is listening your call`)
})



const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.2umnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffeeCollection')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const coffee = await cursor.toArray()
            res.send(coffee)
        })
        app.get('/coffee/:id', async (req, res) => {
            const data = await coffeeCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(data)
        })
        app.post('/coffee', async (req, res) => {
            const result = await coffeeCollection.insertOne(req.body)
            res.send(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) }
            const updateCoffee = {
                $set: {
                    name: req.body.name,
                    supplier: req.body.supplier,
                    category: req.body.category,
                    photo: req.body.photo,
                    chef: req.body.chef,
                    taste: req.body.taste,
                    details: req.body.details
                }
            }
            const option = { upsert: true }
            const result = await coffeeCollection.updateOne(filter,updateCoffee , option)
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server is runnig in port: ${port}`)
})