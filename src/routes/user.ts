import express from "express"
import controllers from "../controllers"
import authenticateUser from "../middlewares/auth"
import { validateRequest } from "../middlewares/validate"
import validators from "../validators"
import limiter from "../helpers/rateLimit"
const router=express.Router()


router.get("/login",validateRequest(validators.routeValidators.loginEmployee),controllers.UserController.loginEmployee)
router.post("/logout",authenticateUser,controllers.UserController.logoutEmployee)
router.get("/assigned-task",authenticateUser,limiter,validateRequest(validators.routeValidators.getAssignedTask),controllers.UserController.getAssignedTask)
router.patch("/task-status/:assignedId",authenticateUser,limiter,validateRequest(validators.routeValidators.updateTaskstatus),controllers.UserController.updateTaskstatus)
router.get("/task",authenticateUser,limiter,validateRequest(validators.routeValidators.getAllCompletedtask),controllers.UserController.getAllCompletedtask)

export default router