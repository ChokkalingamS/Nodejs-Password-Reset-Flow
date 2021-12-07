import { getuser, passwordGenerator, createuser,passwordUpdate,updateuser } from "./DbQueries.js";
import bcrypt from "bcrypt";
import express from 'express';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()
const router=express.Router()

router.route('/signup') 
    .post(async (request, response) => {
    const {  Firstname,Lastname,Mailid,  Password } = request.body;

    const data = await getuser({Mailid});
    // console.log(data);
    if (data) {
        return response.status(400).send({ msg: 'Mailid already exists' });
    }
    if (Password.length < 8) {
        return response.status(400).send({ msg: 'Password must be longer' });
    }
  
    const hashedPassword = await passwordGenerator(Password);
    const createData = await createuser({  Firstname,Lastname,Mailid, Password: hashedPassword });
    // console.log(createData);
    const result = await getuser({Mailid});
    response.send(result);
});




router.route('/login')
    .post (async(request, response) => {
    const { Mailid, Password } = request.body;
    const data = await getuser({Mailid});

    if (!data) {
        return response.status(400).send({ msg: 'Invalid login credentials : mailid' });
    }

    const dbPassword = data.Password;
    const passwordMatch = await bcrypt.compare(Password, dbPassword);
  
    
    if (passwordMatch) {
        const token=jwt.sign({id:data._id},process.env.key)
        // console.log(token);
        return response.send({ msg: 'Login successful',token });
    }

    else {
        return response.status(400).send({ msg: 'Invalid login credentials : Password' });
    }
});



router.route('/forgotpassword')
.post(async(request,response)=>{
    const {Mailid}=request.body
    let data= await getuser({Mailid})

    if (!data) 
    {
        return response.status(400).send({ msg: 'Invalid login credentials : mailid' });
    }
    const token=jwt.sign({id:data._id},process.env.key);

    const replacePassword=await passwordUpdate({Mailid,token})
    // console.log(replacePassword);
    let updatedResult=await getuser({Mailid})
    // console.log(updatedResult);

    // mail
    Mail(token,Mailid);
    
    return response.send({updatedResult,token})

});

router.route('/forgotpassword/verify')
.get(async(request,response)=>{
    const token= await request.header('x-auth-token')
    const tokenVerify=await getuser({Password:token})
//    console.log( tokenVerify,"tokenverified");
   if(!tokenVerify)
   {
    return response.status(400).send({msg:'Invalid Credentials'})
   }
   else
   {
       return response.send({msg:'Matched'})
   }
})

router.route('/updatepassword')
.post(async(request,response)=>{
    
    {
    const {Password,token}=request.body;
    // console.log(request.body);
    if(Password.length<8)
    {
        return response.status(401).send({msg:"Password Must be longer"})
    }
    const data=await getuser({Password:token})
    if(!data)
    {
        return response.status(401).send({msg:"Invalid credentials"})
    }
    const {Mailid}=data
    // console.log(Mailid);
    const hashedPassword= await passwordGenerator(Password)

    const passwordUpdate=await updateuser({Mailid,Password:hashedPassword})
    const result=await getuser({Mailid})
   
    return response.send(result)
}

})

function Mail(token,Mailid) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.email,
            pass:process.env.password
        }
    });
    const link = `http://localhost:3000/forgotpassword/verify/${token}`;
    const mailOptions = {
        from: process.env.email,
        to: 'chokkalingam1707@gmail.com',
        // to: Mailid,
        subject: 'Mail from the Server',
        html: `<a href=${link}>Click the link to reset the password</a>`
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('err');
        }
        else {
            console.log('status', info.response);
        }
    });
}

export const userRouter=router;