import { and, eq, ne, or } from "drizzle-orm"
import postgreDb from "../../config/db"
import { setUser } from "../../config/jwt"
import { employee, task, taskAssigned } from "../../models/schema"
import { validatePassword } from "../../helpers/passwordHash"
import io from "../../app"

export class User{



  static loginEmployee=async(userName:any,password:any)=>{
    try {
      const getUserId=await postgreDb.query.employee.findFirst({
        where:or(eq(employee.email,userName),eq(employee.userName,userName)),
        columns:{
          id:true,
          password:true
        }
      })
      if(getUserId){
        const validateUser=await validatePassword(password,getUserId.password)
        if(validateUser){
          return await setUser({id:getUserId.id,role:"employee"})
        }else{
          throw new Error("Incorrect password")
        }
      }else{
        throw new Error("Invalid Credentials")
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  static getAssignedTask=async(userId:any)=>{
    try {
      return await postgreDb.query.taskAssigned.findMany({
        where:eq(taskAssigned.assignedTo,userId),
        columns:{
          id:true
        },
        with:{
          task:{
            columns:{
              taskName: true,
              taskDescription:true,
              status: true,
              dueDate: true,
              priority:true,
            },
            where:and(eq(task.isDeleted,false),ne(task.status,"completed"))
          }
        }
      })
      
    } catch (error) {
      throw new Error(error)
    }
  }

  static updateTaskstatus=async(userId:any,assignedId:any)=>{
    try {
      const taskDetail =await postgreDb.query.taskAssigned.findFirst({
        where:and(eq(taskAssigned.id,assignedId),eq(taskAssigned.assignedTo,userId)),
        columns:{
          id:true,
          assignedBy:true
        },
        with:{
          task:{
            columns:{
              id:true,
              taskName: true,
              taskDescription:true,
              status: true,
              dueDate: true,
              priority:true,
            },
            where:and(eq(task.isDeleted,false),ne(task.status,"completed"))
          }
        }
      })

      if(taskDetail.task[0].status=="completed"){
        throw new Error("Task already completd")
      }

      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`;

      const checkDueDate=taskDetail.task[0].dueDate
      if(checkDueDate<formattedDate){
        throw new Error("Task not found")
      }
      io.emit('taskStatusUpdated', {
        taskId:taskDetail.id,
        status: 'inreview',
        assignedBy:taskDetail.assignedBy,
      });
      const updatedTask=await postgreDb.update(task).set({
        status:"inreview"
      }).where(and(eq(task.id,taskDetail.task[0].id),ne(task.status,"completed"),eq(task.isDeleted,false))).returning({id:task.id})

      if(updatedTask.length=0){
        throw new Error("Error in updating task")
      }
      
    } catch (error) {
      throw new Error(error)
    }
  }

  static getAllCompletedtask=async(userId:any)=>{
    try {
      return await postgreDb.query.taskAssigned.findMany({
        where:and(eq(taskAssigned.assignedTo,userId),eq(taskAssigned.isCompleted,true)),
        columns:{
          id:true,
        },
        with:{
          task:{
            columns:{
              id:true,
              taskName: true,
              taskDescription:true,
              status: true,
              dueDate: true,
              priority:true,
            }
          }
        }
      })

      
      
    } catch (error) {
      throw new Error(error)
    }
  }

}