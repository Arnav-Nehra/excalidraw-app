import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECRET} from '@repo/backend-common/config'
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"

const app = express();
app.use(express.json())
app.post("/signup", async(req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
      res.json({
        message:"incorrect inputs"
      })
      return;
    }
    try{
    const user = await prismaClient.user.create({
      data: {
        email:parsedData.data.username,
        name:parsedData.data.name,
        password:parsedData.data.password
      }
    })
    res.json({
      userId : user.id
    })
    }
    catch(e){
      res.status(411).json({
        message : "user already exists with this username"
      })
    }
  }
);
app.post("/signin",async(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        message : "Incorrect Inputs" 
      }
    )
    return ;
    }
    const User = await prismaClient.user.findFirst({
      where:{
        email : parsedData.data.username,
        password : parsedData.data.username
      }
    })
    if(!User){
      res.status(403).json({
        message : "user not authorized"
      })
    }
    const token = jwt.sign({
      UserId : User?.id
    },JWT_SECRET)

    res.json(token);
  })
app.post("/room",middleware,async(req,res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
      res.json({
        message:"incorrect inputs"
      })
      return ;
    }
    //@ts-ignore
    const userId = req.userId;
    try{
    const room = await prismaClient.room.create({
      data:{
        slug : parsedData.data?.name,
        adminId : userId
      }
    })

    res.json({
      roomId : room.id 
    })
  }
  catch(e){
    res.json(411).json({
      message : "room already exists with the same name"
    })
  }
})
app.listen(3002);
