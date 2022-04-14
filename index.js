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
        
        app.put('/merchants/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await merchantsCollection.updateOne(filter, {
              $set: {
                merchant: "yes",
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