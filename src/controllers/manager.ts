import {Request,Response} from "express"
import dbservices from "../services/dbservices"
import Redis from "ioredis"
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})


export class Managercontroller{
  static loginManager=async(req:Request,res:Response)=>{
    try {
      const {email,loginId,loginPassword}=req.body
      if(!email || !loginId || !loginPassword){
        throw new Error("Invalid credentials")
      }
      const loginDetails=await dbservices.Manager.loginManager(email,loginId,loginPassword)
      res.status(200).send({status:true,message:"LoggedIn Successfully",data:loginDetails})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static createTask=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      if(!managerId){
        throw new Error("Unauthorised User")
      }
      const {title,description,dueDate,priority}=req.body
      if(!title || !description || !dueDate || !priority ){
        throw new Error("Incompleted details")
      }
      const taskId=await dbservices.Manager.createTask(managerId,title,description,dueDate,priority)
      res.status(200).send({status:true,message:"Task Created Successfully",taskId:taskId})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static updateTask=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      if(!managerId){
        throw new Error("Unauthorised User")
      }
      const taskId=req.params.taskId
      if(!taskId){
        throw new Error("Task Id not found")
      }
      const {title,description,dueDate,priority,status}=req.body
      
      const updatedTask=await dbservices.Manager.updateTask(managerId,parseInt(taskId),title,description,dueDate,priority,status)
      res.status(200).send({status:true,message:"Task Updated Successfully",data:updatedTask})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static getAllTask=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role !=="manager"){
        throw new Error("Unauthorised User")
      }
      const {dueDate,isDeleted,status,priority,greaterThenDate,lessThenDate}=req.body
      const allTasks=await dbservices.Manager.getAllTask(managerId,dueDate,isDeleted,status,priority,greaterThenDate,lessThenDate)
      res.status(200).send({status:true,message:"All Tasks",data:allTasks})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static deleteTask=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role!=="manager"){
        throw new Error("Unauthorised User")
      }
      const taskId=req.params.taskId
      if(!taskId){
        throw new Error("Task Id not found")
      }
      await dbservices.Manager.deleteTask(managerId,parseInt(taskId))
      res.status(200).send({status:true,message:"Task deleted Successfully"})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static getTaskById=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role!=="manager"){
        throw new Error("Unauthorised User")
      }
      const taskId=req.params.taskId
      if(!taskId){
        throw new Error("Task Id not found")
      }
      const getTaskById=await dbservices.Manager.getTaskById(managerId,parseInt(taskId))
      res.status(200).send({status:true,message:"Get Task",data:getTaskById})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static assignTask=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role!=="manager"){
        throw new Error("Unauthorised User")
      }
      const {taskDetails}=req.body
      if(taskDetails.length==0){
        throw new Error("Select atleast one task")
      }
      const assignedTask=await dbservices.Manager.assignTask(managerId,taskDetails)
      res.status(200).send({status:true,message:"Task Assigned Successfully",data:assignedTask})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static registerUser=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role!=="manager"){
        throw new Error("Unauthorised User")
      }
      await dbservices.Manager.registerUser(managerId,req.body)
      res.status(200).send({status:true,message:"User Registered Successfully and Email sended to them"})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static reviewTaskandChangeStatus=async(req:Request,res:Response)=>{
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
      const managerId=req["user"].userId
      const role=req["user"].role
      if(!managerId && role!=="manager"){ 
        throw new Error("Unauthorised User")
      }
      const taskId=req.params.taskId
      const {assignedTo,status}=req.body
      await dbservices.Manager.reviewTaskandChangeStatus(managerId,parseInt(taskId),status,assignedTo)
      res.status(200).send({status:true,message:`Task status changed to ${status}`})
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static logoutManager=async(req:Request,res:Response)=>{
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

  static getProfile=async(req:Request,res:Response)=>{
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
        const managerId=req["user"].userId
        const role=req["user"].role
        if(!managerId || role!=="manager"){
          throw new Error("Unauthorised access")
        }
        const getProfile=await dbservices.Manager.getProfile(managerId)
        res.status(200).send({status:true,message:"Manager Profile",data:getProfile})  
      } catch (error) {
        res.status(500).send({status:false,message:error.message})
      }
    }


}