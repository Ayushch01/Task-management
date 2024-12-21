
import { Request, Response } from "express";
import { getUser } from "../config/jwt"

function verifyToken(req:Request){
  return req.headers.authorization;
}

const authenticateUser=(req:Request,res:Response,next)=>{
    try{
      const getToken = verifyToken(req);
      console.log("Headers ", req.headers)
      console.log("Token is ", getToken)
      if(!getToken){
        throw new Error("Token not Found");
      }
      const user = getUser(getToken)
      if(!user){
        throw new Error("User not Found");
      }
      req["user"]=user
      next();
    }catch(err){
      throw new Error(err)
    }
}



export default authenticateUser