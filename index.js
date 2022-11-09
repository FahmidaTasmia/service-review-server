const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 5000;
//middleware

app.use(cors());
app.use(express.json());

//dtabase connection



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bkf4wz6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('iDot').collection('services');

        app.get('/services', async(req,res)=>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        
    }

    finally{

    }

}

run().catch(error=>console.error(error));


app.get('/', (req,res)=>{
    res.send('iDot server is running')
})

app.listen(port, ()=>{
    console.log(`iDot server is running on ${port}`);
})