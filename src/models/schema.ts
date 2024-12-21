  import { relations} from 'drizzle-orm';
  import { serial,varchar,pgTable,boolean,integer,timestamp,jsonb} from 'drizzle-orm/pg-core';

  export const admin:any= pgTable('admin', {
    id: serial('id').primaryKey(),
    name: varchar('name'),
    userName:varchar("user_name").notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    role:varchar("role"),
    managerLoginId:varchar("manager_login_id"),
    managerLoginPassword:varchar("manager_login_password"),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const manager:any= pgTable('manager', {
    id: serial('id').primaryKey(),
    adminId:integer('admin_id').references(()=>admin.id),
    name: varchar('name', { length: 256 }).notNull(),
    userName:varchar("user_name").notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    role:varchar("role"),
    createdAt: timestamp("created_at").defaultNow(),
  });


  export const employee:any= pgTable('employee', {
    id: serial('id').primaryKey(),
    managerId:integer('manager_id').references(()=>manager.id),
    name: varchar('name', { length: 256 }).notNull(),
    userName:varchar("user_name").notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    role:varchar("role"),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const task:any= pgTable('task', {
    id: serial('id').primaryKey(),
    managerId:integer('manager_id').references(()=>manager.id),
    taskName: varchar('task_name', { length: 256 }).notNull(),
    taskDescription:varchar("task_description").notNull(),
    status: varchar('status').default("incompleted"),//incompleted , completed,inReview,reassigned
    dueDate: varchar('due_date').notNull(),
    priority:varchar("priority"),
    isDeleted:boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const taskAssigned= pgTable('task_assigned', {
    id: serial('id').primaryKey(),
    assignedBy:integer("assigned_by").references(()=>manager.id),
    taskId:integer('task_id').references(()=>task.id),
    assignedTo: integer('assigned_to').references(()=>employee.id),
    isCompleted:boolean("is_completed").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  });



  export const adminRelations = relations(admin, ({ many }) => ({
    managers: many(manager),
  }));

  export const managerRelations = relations(manager, ({ one, many }) => ({
    admin: one(admin, {
      fields: [manager.adminId],
      references: [admin.id],
    }),
    tasks: many(task),
    employee:many(employee),
    assignedTasks: many(taskAssigned),
  }));

  export const taskRelations = relations(task, ({ one, many }) => ({
    manager: one(manager, {
      fields: [task.managerId], 
      references: [manager.id],
    }),
    taskAssignments: many(taskAssigned)
  }));

  export const taskAssignedRelations = relations(taskAssigned, ({ one }) => ({
    manager: one(manager, {
      fields: [taskAssigned.assignedBy],
      references: [manager.id],
    }),
    task: one(task, {
      fields: [taskAssigned.taskId],
      references: [task.id],
    }),
    user: one(employee, {
      fields: [taskAssigned.assignedTo],
      references: [employee.id],
    })
  }));

  export const employeeRelations = relations(employee, ({one, many }) => ({
    manager:one(manager,{
      fields: [employee.managerId],
      references: [manager.id],
    }),
    assignedTasks: many(taskAssigned)
  }));