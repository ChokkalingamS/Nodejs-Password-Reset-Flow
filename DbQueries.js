import bcrypt from "bcrypt";
import { client } from "./index.js";


async function passwordGenerator(Password) {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(Password, salt);
    // console.log(hashedPassword);
    return hashedPassword;
}
async function getuser(userdata) {
    let result = await client.db('movielist').collection('users').findOne( userdata );
    return result;
}
async function createuser(data) {
    return await client.db('movielist').collection('users').insertOne(data);
}

async function passwordUpdate(userdata)
{
    let {Mailid,token}=userdata
    // console.log(userdata);
    // console.log(token,"token");

    let result=await client.db('movielist').collection('users').updateOne({Mailid},{$set:{Password:token}})
    return result
}


async function updateuser(userdata)
{
    const{Mailid,Password}=userdata
    let result=await client.db('movielist').collection('users').updateOne({Mailid},{$set:{Password:Password}})
    return result;
}


async function updateuserlastseen(userdata)
{
    const{Mailid,date,LastVisited}=userdata
    let result=await client.db('movielist').collection('users').updateOne({Mailid},{$set:{LastVisited:date}})
    return result;
}


export{passwordGenerator,
    getuser,
   createuser,
   passwordUpdate,
   updateuser,
   updateuserlastseen
}