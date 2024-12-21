import {Request,Response} from "express"
import dbservices from "../services/dbservices"
import Redis from "ioredis"
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})

export class AdminController{

  static registerAdmin=async(req:Request,res:Response)=>{
    try {
      const registeredAdmin=await dbservices.Admin.registerAdmin(req.body)
      res.status(200).send({status:true,message:"Admin Registered Successfully",token:registeredAdmin})
      
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static loginAdmin=async(req:Request,res:Response)=>{
    try {
      const {userName,password}=req.body
      if(!userName || !password){
        throw new Error("Invalid credentials")
      }
      const userDetails=await dbservices.Admin.loginAdmin(userName,password)
      res.status(200).send({status:true,message:"Logged In Successfully",token:userDetails})  
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static logoutAdmin = async (req: Request, res: Response) => {
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
      res.status(500).json({ status: false, message: error.message });
    }
  };
  

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
      const adminId=req["user"].userId
      const role=req["user"].role
      if(!adminId || role!=="admin"){
        throw new Error("Unauthorised access")
      }
      const getProfile=await dbservices.Admin.getProfile(adminId)
      res.status(200).send({status:true,message:"Admin Detail",data:getProfile})  
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }

  static registerManager=async(req:Request,res:Response)=>{
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
      const adminId=req["user"].userId
      const {name,userName,email}=req.body
      if(!userName || !name || !email){
        throw new Error("Invalid credentials")
      }
      await dbservices.Admin.registerManager(adminId,name,userName,email)
      res.status(200).send({status:true,message:"Manager Credentials are send to their email"})  
    } catch (error) {
      res.status(500).send({status:false,message:error.message})
    }
  }
}