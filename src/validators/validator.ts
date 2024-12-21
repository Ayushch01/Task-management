import { z } from 'zod';

export class routeValidators{

  static registerAdmin = z.object({
    body: z.object({
      name: z.string({ required_error: "Name is required" }),
      userName: z.string({ required_error: "Username is required" }),
      email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
      password: z.string({ required_error: "Password is required" }),
      managerLoginId: z.string({ required_error: "Manager Login ID is required" }),
      managerLoginPassword: z.string({ required_error: "Manager Login Password is required" })
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });



  static loginAdmin = z.object({
    body: z.object({
      userName: z.string({ required_error: " UserName or email is required" }),
      password: z.string({ required_error: "Password is required" })
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });
  
  static getProfile = z.object({
    body: z.object({}),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });

  static registerManager= z.object({
    body: z.object({
      name:z.string({required_error:"Name is required"}),
      userName: z.string({ required_error: " UserName or email is required" }),
      email: z.string({ required_error: "Email is required" }).email("Invalid email format")
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });

  static reviewTaskandChangeStatus = z.object({
    params: z
      .object({
        taskId: z
          .string({ required_error: "Task ID is required" })
          .regex(/^\d+$/, "Task ID must be a valid number"),
      })
      .strict(),
    body: z
      .object({
        assignedTo: z
          .string({ required_error: "Assigned To is required" })
          .nonempty("Assigned To cannot be empty"),
        status: z
          .string({ required_error: "Status is required" })
          .nonempty("Status cannot be empty"),
      })
      .strict(),
    query: z.object({}).strict(),
  });

  

  static loginManager = z.object({
    body: z.object({
      email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
      loginId: z.string({ required_error: "Login ID is required" }),
      loginPassword: z.string({ required_error: "Login Password is required" })
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });


  static createTask = z.object({
    body: z.object({
      title: z.string({ required_error: "Title is required" }),
      description: z.string({ required_error: "Description is required" }),
      dueDate: z.string({ required_error: "Due Date is required" }),
      priority: z.string({ required_error: "Priority is required" })
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });

 
  static updateTask = z.object({
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      priority: z.string().optional(),
      status: z.string().optional()
    }),
    params: z.object({
      taskId: z.string({ required_error: "Task ID is required" })
    }),
    query: z.object({}).strict()
  });


  static getAllTask = z.object({
    body: z.object({
      dueDate: z.string().optional(),
      isDeleted: z.boolean().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      greaterThenDate: z.string().optional(),
      lessThenDate: z.string().optional()
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });


  static deleteTask = z.object({
    params: z.object({
      taskId: z.string({ required_error: "Task ID is required" })
    }),
    query: z.object({}).strict(),
    body: z.object({}).strict()
  });


  static getTaskById = z.object({
    params: z.object({
      taskId: z.string({ required_error: "Task ID is required" })
    }),
    query: z.object({}).strict(),
    body: z.object({}).strict()
  });


  static assignTask = z.object({
    body: z.object({
      taskDetails: z.array(z.object({taskId:z.number(),employeeId:z.number()}), { required_error: "Task details are required" })
        .nonempty({ message: "Assign at least one task" })
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });


  static registerUser = z.object({
    body: z.object({
      name: z.string({ required_error: "Name is required" }),
      email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
      password: z.string({ required_error: "Password is required" }),
      userName: z.string({ required_error: "userName is required" }),
    }),
    params: z.object({}).strict(),
    query: z.object({}).strict()
  });

  static loginEmployee = z.object({
    body: z
      .object({
        userName: z
          .string({ required_error: "Username is required" })
          .nonempty("Username cannot be empty"),
        password: z
          .string({ required_error: "Password is required" })
          .nonempty("Password cannot be empty"),
      })
      .strict(),
    params: z.object({}).strict(),
    query: z.object({}).strict(),
  });

  static getAssignedTask = z.object({
    params: z.object({}).strict(),
    query: z.object({}).strict(),
    body: z.object({}).strict(),
  });

  static updateTaskstatus = z.object({
    params: z
      .object({
        assignedId: z
          .string({ required_error: "Assigned ID is required" })
          .nonempty("Assigned ID cannot be empty"),
      })
      .strict(),
    query: z.object({}).strict(),
    body: z.object({}).strict(),
  });

  static getAllCompletedtask = z.object({
    params: z.object({}).strict(),
    query: z.object({}).strict(),
    body: z.object({}).strict(),
  });
 

}
