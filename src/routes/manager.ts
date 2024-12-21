import express from "express"
import authenticateUser from "../middlewares/auth"
import controllers from "../controllers"
import { validateRequest } from "../middlewares"
import validators from "../validators"
import limiter from "../helpers/rateLimit"
const router=express.Router()

router.post("/login",validateRequest(validators.routeValidators.loginManager),controllers.Managercontroller.loginManager)
router.post("/register",authenticateUser,limiter,validateRequest(validators.routeValidators.registerUser),controllers.Managercontroller.registerUser)
router.post("/task",authenticateUser,limiter,validateRequest(validators.routeValidators.createTask),controllers.Managercontroller.createTask)
router.post("/get-task",authenticateUser,limiter,validateRequest(validators.routeValidators.getAllTask),controllers.Managercontroller.getAllTask)
router.post("/assign",authenticateUser,limiter,validateRequest(validators.routeValidators.assignTask),controllers.Managercontroller.assignTask)
router.post("/review/:taskId",authenticateUser,limiter,validateRequest(validators.routeValidators.reviewTaskandChangeStatus),controllers.Managercontroller.reviewTaskandChangeStatus)
router.get("/",authenticateUser,validateRequest(validators.routeValidators.getProfile),controllers.Managercontroller.getProfile)
router.post("/logout",authenticateUser,limiter,controllers.Managercontroller.logoutManager)
router.get("/get-task/:taskId",authenticateUser,limiter,validateRequest(validators.routeValidators.getTaskById),controllers.Managercontroller.getTaskById)
router.patch("/update-task/:taskId",authenticateUser,limiter,validateRequest(validators.routeValidators.updateTask),controllers.Managercontroller.updateTask)
router.delete("/delete-task/:taskId",authenticateUser,limiter,validateRequest(validators.routeValidators.deleteTask),controllers.Managercontroller.deleteTask)



export default router