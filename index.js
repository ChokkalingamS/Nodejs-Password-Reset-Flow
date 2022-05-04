import express from "express";
import {MongoClient} from 'mongodb'
import {userRouter} from './newFile.js'
import {facebookLeadAd} from './facebooklead.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

// PORT
const PORT=process.env.PORT;
// MONGODB URL
const MONGO_URL=process.env.MONGO_URL

export const app=express();

// To all users to access
app.use(cors());

// To transform data to json
app.use(express.json())
// Router
app.use('/users',userRouter)
app.use('/webhook',facebookLeadAd)

// Home page
app.get('/',(request,response)=>{
    response.send({msg:'Password Reset Flow'})
});

// Making connection with the MONGODB URL
async function createConnection()
{
    const client=await new MongoClient(MONGO_URL)
    await client.connect();
    console.log('MongoDb Connected');
    return client;
}

export const client=await createConnection();


// PORT
app.listen(PORT,()=>{
    console.log('Server started-',PORT);
})
