import { and, eq, or } from "drizzle-orm"
import postgreDb from "../../config/db"
import { setUser } from "../../config/jwt"
import { bcryptPassword, validatePassword } from "../../helpers/passwordHash"
import { admin, employee, manager, } from "../../models/schema"
import { transporter } from "../../helpers/sendEmail"

export class Admin{

  static registerAdmin=async(details:{name:string,userName:string,email:string,password:string,managerLoginId:string,managerLoginPassword:string}):Promise<any>=>{
    try {
      const adminData=await postgreDb.insert(admin).values({
        name:details.name,
        userName:details.userName,
        email:details.email,
        role:"admin",
        password:await bcryptPassword(details.password),
        managerLoginId:details.managerLoginId,
        managerLoginPassword:details.managerLoginPassword
      }).returning({id:admin.id,role:admin.role})
      if(adminData){
        return await setUser({id:adminData[0].id,role:adminData[0].role})
      }

    } catch (error) {
      throw new Error(error)
    }
  }

  static loginAdmin=async(userName:string,password:string):Promise<any>=>{
    try {
      const getPassword=await postgreDb.query.admin.findFirst({
        where:or(eq(admin.email,userName),eq(admin.userName,userName)),
        columns:{
          id:true,
          password:true,
          role:true
        }
      })
      if(!getPassword){
        throw new Error("Invalid Credentials Provided")
      }
      console.log(getPassword,password)

      const isPassword=await validatePassword(password,getPassword.password)
      console.log(isPassword,"isPassword")
      if(isPassword){
        return await setUser({id:getPassword.id,role:getPassword.role})
      }else{
        throw new Error("Invalid password")
      }

    } catch (error) {
      throw new Error(error)
    }
  }

  static getProfile=async(adminId:number):Promise<any>=>{
    try {
      return await postgreDb.query.admin.findFirst({
        where:and(eq(admin.id,adminId),eq(admin.role,"role")),
        columns:{
          name: true,
          userName:true,
          email: true,
          role:true,
          managerLoginId:true,
          managerLoginPassword:true,
          createdAt: true,
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }


  static registerManager=async(adminId:number,name:string,userName:string,email:string):Promise<any>=>{
    try {

      const findManager=await postgreDb.select({
        email:manager.email
      }).from(manager).where(eq(manager.email,email))
      if(findManager.length>0){
        throw new Error("Manager already registered with this email")
      }
      const insertManager=await postgreDb.insert(manager).values({
        adminId:adminId,
        name:name,
        userName:userName,
        email:email,
        role:"manager"
      }).returning({managerId:manager.id})
      if(insertManager.length>0){
        const managerCredentials=await postgreDb.query.admin.findFirst({
          where:eq(admin.id,adminId),
          columns:{
            managerLoginId:true,
            managerLoginPassword:true
          }
          
        })
        const mailOptions = {
          from: 'no-reply@legal-wires.com',
          to: email,
          subject :'Your Credentials ',
          text : `your credentials are:
                  Email:${email}
                  Login Id:${managerCredentials.managerLoginId},
                  Login Password:${managerCredentials.managerLoginPassword}

                  Thank you,`
        }
        
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error)
                throw new Error(error)
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
      }else{
        throw new Error("Something went wrong")
      }
    } catch (error) {
      console.log(error,"error")
      throw new Error(error)
    }
  }

}