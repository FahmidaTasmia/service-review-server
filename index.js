const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 5000;
//middleware

app.use(cors());
app.use(express.json());

//dtabase connection



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bkf4wz6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('iDot').collection('services');
        const orderCollection=client.db('iDot').collection('orders');
        const reviewCollection=client.db('iDot').collection('reviews');
        app.get('/services', async(req,res)=>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        });

        app.get('/allServices', async(req,res)=>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service)
        });

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const services = await serviceCollection.findOne(query);
            res.send(services);

        });

        //create api for orders 

        app.get('/orders',async(req,res)=>{
            let query={};
            if(req.query.email){
             query={
                 email:req.query.email
             }
            }
             const cursor = orderCollection.find(query);
             const orders = await cursor .toArray();
             res.send(orders);
         });

        app.post('/orders' , async(req,res)=>{
            const order = req.body;
            const result= await orderCollection.insertOne(order);
            res.send(result);
        });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        //review api created

        
        //add new review
         app.post('/add-reviews' , async(req,res)=>{
          try{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);

            if(result.acknowledged && result.insertedId){
                res.send({
                    success:true,
                    message:"Successfully added a Review"
                });
            }
            else{
                res.send({
                    success:false,
                    error:"something went Wrong"
                })
            }

          }

          catch(error){
            res.send({
                success:false,
                error:"error.message",
            });
          }
        });

       

       
 
        
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