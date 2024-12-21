import { and, eq, gt, lt, or, SQL } from "drizzle-orm"
import postgreDb from "../../config/db"
import { admin, employee, manager, task, taskAssigned } from "../../models/schema"
import { setUser } from "../../config/jwt"
import { bcryptPassword } from "../../helpers/passwordHash"
import { transporter } from "../../helpers/sendEmail"
import io from "../../app"

export class Manager{
  static loginManager=async(email:any,loginId:any,loginPassword:any)=>{
    try {
      const getAdminId=await postgreDb.query.manager.findFirst({
        where:eq(manager.email,email),
        columns:{
          id:true,
          role:true,
          adminId:true
        }
      })

      if(!getAdminId){
        throw new Error("Invalid email")
      }
      const checkCredentials=await postgreDb.select({
        managerId:admin.managerLoginId,
        managerPassword: admin.managerLoginPassword
      }).from(admin).where(eq(admin.id,getAdminId.adminId))

      if(checkCredentials.length>0){
        if(checkCredentials[0].managerId==loginId && checkCredentials[0].managerPassword==loginPassword){
          return await setUser({id:getAdminId.id,role:getAdminId.role})
        }else{
          throw new Error("Invalid login Id or Password")
        }
      }else{
        throw new Error("Invalid Credentials")
      }
      
    } catch (error) {
      throw new Error(error)
    }
  }

  static createTask=async(managerId:number,title:any,description:any,dueDate:any,priority:any)=>{
    try {
      const createdTask=await postgreDb.insert(task).values({
        managerId:managerId,
        taskName:title,
        taskDescription:description,
        dueDate:dueDate,
        priority:priority,
        status:"incompleted"
      }).returning({taskId:task.id})
      if(createdTask.length=0){
        throw new Error("Something went wrong,Please try again later..!!")
      }
      return createdTask[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  static updateTask=async(managerId:number,taskId:number,title:any,description:any,dueDate:any,priority:any,status:any)=>{
    try {
      const updatedTask=await postgreDb.update(task).set({
        taskName:title,
        taskDescription:description,
        dueDate:dueDate,
        priority:priority,
        status:status
      }).where(and(eq(task.managerId,managerId),eq(task.id,taskId))).returning({taskId:task.id,taskName:task.taskName,taskDescription:task.taskDescription,duedate:task.dueDate,priority:task.priority,status:task.status})
      if(updatedTask.length=0){
        throw new Error("Task not updated")
      }
      return updatedTask
    } catch (error) {
      throw new Error(error)
    }
  }

  static getAllTask=async(managerId:number,dueDate?:any,isDeleted?:any,status?:any,priority?:any,greaterThenDate?:any,lessThenDate?:any)=>{
    try {
      const filters: SQL[] = [];

      if (dueDate) filters.push(eq(task.dueDate, dueDate));
      if (isDeleted !== undefined) filters.push(eq(task.isDeleted, isDeleted));
      if (status) filters.push(eq(task.status, status));
      if (priority) filters.push(eq(task.priority, priority));
      if (greaterThenDate) filters.push(gt(task.dueDate, greaterThenDate));
      if (lessThenDate) filters.push(lt(task.dueDate, lessThenDate));

      return await postgreDb.query.task.findMany({
        where: and(
          eq(task.managerId, managerId),
          filters.length > 0 ? or(...filters) : undefined
        ),
        columns: {
          id: true,
          taskName: true,
          taskDescription: true,
          status: true,
          dueDate: true,
          priority: true,
          isDeleted: true,
          createdAt: true,
        }
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  static deleteTask=async(managerId:number,taskId:number)=>{
    try {
      const deletedTask=await postgreDb.update(task).set({
        isDeleted:true
      }).where(and(eq(task.isDeleted,false),eq(task.managerId,managerId),eq(task.id,taskId))).returning({id:task.id})
      if(deletedTask.length=0){
        throw new Error("Something went Wrong")
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  static registerUser=async(managerId:number,details:{name:string,userName:string,email:string,password:string})=>{
    try {
      const checkEmployee=await postgreDb.select({
        email:employee.email
      }).from(employee).where(eq(employee.email,details.email))

      if(checkEmployee.length>0){
        throw new Error("Employee already registered with this email")
      }
      const getUserId=await postgreDb.insert(employee).values({
        managerId:managerId,
        name:details.name,
        userName:details.userName,
        email:details.email,
        password:await bcryptPassword(details.password),
        role:"employee"
      }).returning({id:employee.id})
      if(getUserId.length=0){
        throw new Error("Something went wrong")
      }

      const mailOptions = {
        from: 'no-reply@legal-wires.com',
        to: details.email,
        subject :'Your Credentials ',
        text : `your credentials are:
                Email:${details.email}
                userName:${details.userName},
                password:${details.password}

                Thank you,`
          }
          
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error)
            throw new Error(error.message)
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    } catch (error) {
      throw new Error(error)
    }
  }

  static getTaskById=async(managerId:number,taskId:number)=>{
    try {
      const getTask =await postgreDb.query.task.findFirst({
        where: and(
          eq(task.managerId, managerId),
          eq(task.id,taskId)
        ),
        columns: {
          id: true,
          taskName: true,
          taskDescription: true,
          status: true,
          dueDate: true,
          priority: true,
          isDeleted: true,
          createdAt: true,
        }
      });
      if(getTask){
        throw new Error("Invalid task Id")
      }
      return getTask
    } catch (error) {
      throw new Error(error)
    }
  }

  static assignTask=async(managerId:number,taskDetails:any)=>{
    try {
      const assignedTasks = await Promise.all(
        taskDetails.map(async (task: any) => {
          return postgreDb.insert(taskAssigned).values({
            assignedBy: managerId,
            taskId: task.taskId,
            assignedTo: task.employeeId,
          }).returning({
            assignedId: taskAssigned.id,
            assignedBy: taskAssigned.assignedBy,
            taskId: taskAssigned.taskId,
            assignedTo: taskAssigned.assignedTo,
          });
        })
      );
      return assignedTasks.flat()
    } catch (error) {
      throw new Error(error)
    }
  }


  static reviewTaskandChangeStatus=async(managerId:number,taskId:number,status:any,assignedTo:any)=>{
    try {
      if(status=="completed"){
        await postgreDb.update(task).set({
          status:"completed"
        }).where(and(eq(task.id,taskId),eq(task.managerId,managerId)))
        await postgreDb.update(taskAssigned).set({
          isCompleted:true
        }).where(and(eq(taskAssigned.assignedBy,managerId),eq(taskAssigned.assignedTo,assignedTo)))

        io.emit('taskStatusUpdated', {
          taskId,
          status: 'completed',
          assignedTo,
        });
      }else{
        await postgreDb.update(task).set({
          status:"completed"
        }).where(and(eq(task.id,taskId),eq(task.managerId,managerId)))

        io.emit('taskStatusUpdated', {
          taskId,
          status,
        });
      }
      
    } catch (error) {
      throw new Error(error)
    }
  }

  static getProfile=async(managerId:number):Promise<any>=>{
    try {
      return await postgreDb.query.manager.findFirst({
        where:and(eq(manager.id,managerId),eq(manager.role,"manager")),
        columns:{
          name: true,
          userName:true,
          email: true,
          role:true,
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

}