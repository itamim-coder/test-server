const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
var ObjectId = require("mongodb").ObjectId;
const fileUpload = require('express-fileupload');


const app = express();

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run(){
    try{
        await client.connect();
        const database = client.db('testDb'); 
        const merchantsCollection = database.collection('merchants');  
        const usersCollection = database.collection('users');
        const sendMoneyCollection = database.collection('sendmoney');
        
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        } )  
            app.get("/users/:id", async(req, res) =>{
            const result = await usersCollection
            .find({_id: ObjectId(req.params.id)})
            .toArray();
            res.send(result[0])
        } )
        app.post('/sendmoney', async (req, res) => {
            const user = req.body;
            const result = await sendMoneyCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.get('/sendmoney', async (req, res) => {
            const cursor = sendMoneyCollection.find({});
            const sendmoney = await cursor.toArray();
            res.send(sendmoney);
        } ) 
             app.get("/sendmoney/:email", async (req, res) =>{
            const result = await sendMoneyCollection
            .find({ email: req.params.email })
            .toArray();
            res.send(result);
        })
        // app.put('/sendmoney', async (req, res) => {
        //     const sendmoney = req.body;
        //     console.log(req.body.receiver);
        //     // const filter = { email: sendmoney.senderEmail };
        //     const updateDoc = { $set: {
        //         receiver : req.body.receiver,
        //         sendAmount : req.body.sendAmount,


        //     } };
        //     const result = await usersCollection.updateOne(updateDoc);
        //     console.log(result);
        //     res.json(result);
        // });

        app.post("/merchants", async(req,res) =>{
            // const result = await productsCollection.insertOne(req.body);
            const businessName = req.body.businessName;
            const businessLogo = req.files.businessLogo;
            const merchantPhone = req.body.merchantPhone;
            const merchantNid = req.body.merchantNid;
            const picData = businessLogo.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const merchant = {
                businessName,
                merchantPhone,
                merchantNid,
                businessLogo: imageBuffer
            }
            const result = await merchantsCollection.insertOne(merchant);
            res.json(result);
        })

        app.get('/merchants', async (req, res) => {
            const cursor = merchantsCollection.find({});
            const merchants = await cursor.toArray();
            res.send(merchants);
        } )  

        app.get("/merchants/:id", async(req, res) =>{
            const result = await merchantsCollection
            .find({_id: ObjectId(req.params.id)})
            .toArray();
            res.send(result[0])
        } )
        
        app.put('/merchants/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params);
            const result = await merchantsCollection.updateOne(filter, {
              $set: {
                merchants: req.body.merchants,
              },
            });
            // res.send(result);
            console.log(result);
        });

     
       


        console.log('connected testDb')

    }
    finally{
        //await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res)  =>{
    res.send('ruuning testDb')
})

app.listen(port, ()=>{
    console.log('running testDb', port)
})