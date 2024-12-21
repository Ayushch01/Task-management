import {Request,Response} from "express"
import dbservices from "../services/dbservices"
import Redis from "ioredis"
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})

export class UserController{

  


  static loginEmployee=async(req:Request,res:Response)=>{
    try {
      const {userName,password}=req.body
      if(!userName || !password){
        throw new Error("Invalid credentials")
      }
      const userDetail=await dbservices.User.loginEmployee(userName,password)
      res.status(200).send({status:true,message:"User loggedIn Successfully",token:userDetail})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static getAssignedTask=async(req:Request,res:Response)=>{
    try {
      const token = req.headers.authorization?.trim();
      if (!token) {
        throw new Error("Token not found");
      }

      let checkToken = await redis.get("blacklisted");
      if (checkToken) {
        const blacklistedTokens = JSON.parse(checkToken);
        if (Array.isArray(blacklistedTokens) && blacklistedTokens.includes(token)) {
          throw new Error("Token Expired");
        }
      }
      const userId=req["user"].userId
      if(!userId){
        throw new Error("Unauthorised User")
      }
      const getAssignedTask=await dbservices.User.getAssignedTask(userId)
      res.status(200).send({status:true,message:"All assigned task",data:getAssignedTask})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static updateTaskstatus=async(req:Request,res:Response)=>{
    try {
      const token = req.headers.authorization?.trim();
      if (!token) {
        throw new Error("Token not found");
      }

      let checkToken = await redis.get("blacklisted");
      if (checkToken) {
        const blacklistedTokens = JSON.parse(checkToken);
        if (Array.isArray(blacklistedTokens) && blacklistedTokens.includes(token)) {
          throw new Error("Token Expired");
        }
      }
      const userId=req["user"].userId
      if(!userId){
        throw new Error("Unauthorised User")
      }
      const assignedId = req.params.assignedId
      if(!assignedId){
        throw new Error("Select task for updation")
      }
      await dbservices.User.updateTaskstatus(userId,assignedId)
      res.status(200).send({status:true,message:"Task Updated Successfully"})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static getAllCompletedtask=async(req:Request,res:Response)=>{
    try {
      const token = req.headers.authorization?.trim();
      if (!token) {
        throw new Error("Token not found");
      }

      let checkToken = await redis.get("blacklisted");
      if (checkToken) {
        const blacklistedTokens = JSON.parse(checkToken);
        if (Array.isArray(blacklistedTokens) && blacklistedTokens.includes(token)) {
          throw new Error("Token Expired");
        }
      }
      const userId=req["user"].userId
      if(!userId){
        throw new Error("Unauthorised User")
      }
      const allCompletedtask=await dbservices.User.getAllCompletedtask(userId)
      res.status(200).send({status:true,message:"All Completed task",data:allCompletedtask})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static logoutEmployee=async(req:Request,res:Response)=>{
    try {
      const token = req.headers.authorization?.trim();
      if (!token) {
        throw new Error("Token not found");
      }
  
      let checkToken = await redis.get("blacklisted");
      if (!checkToken) {
      await redis.set("blacklisted", JSON.stringify([token]));
      } else {
      let blacklistedTokens = JSON.parse(checkToken);
      if (!Array.isArray(blacklistedTokens)) {
        blacklistedTokens = [];
      }
      blacklistedTokens.push(token);
      await redis.set("blacklisted", JSON.stringify(blacklistedTokens));
      }
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }
}