import bcrypt from "bcrypt"
import { envConfigs } from "../config/envconfig"

const bcryptPassword=async(password:string)=>{
  try {
    const saltRounds = parseInt(envConfigs.salt, 10);
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    throw new Error(error)
  }
}

const validatePassword=async(password:string,hash:string)=>{
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw new Error('Error while validating password');
  }
}

export { bcryptPassword,validatePassword}