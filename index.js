import express from "express";
import {MongoClient} from 'mongodb'
import {userRouter} from './newFile.js'
import dotenv from 'dotenv'
import cors from 'cors'

export const app=express();
app.use(cors());
app.use(express.json())
app.use('/users',userRouter)


dotenv.config()
const PORT=process.env.PORT;
const MONGO_URL=process.env.MONGO_URL



app.get('/',(request,response)=>{
    response.send({msg:'Password'})
});


async function createConnection()
{
    const client=await new MongoClient(MONGO_URL)
    await client.connect();
    console.log('MongoDb Connected');
    return client;
}

export const client=await createConnection();



app.listen(PORT,()=>{
    console.log('Server started-',PORT);
})
