import express from "express"
import controllers from "../controllers"
import authenticateUser from "../middlewares/auth"
import { validateRequest } from "../middlewares"
import validators from "../validators"
import limiter from "../helpers/rateLimit"
const router=express.Router()

router.post("/register",validateRequest(validators.routeValidators.registerAdmin),controllers.AdminController.registerAdmin)
router.post("/login",validateRequest(validators.routeValidators.loginAdmin),controllers.AdminController.loginAdmin)
router.get("/",authenticateUser,validateRequest(validators.routeValidators.getProfile),controllers.AdminController.getProfile)
router.post("/logout",authenticateUser,limiter,controllers.AdminController.logoutAdmin)
router.post("/manager",authenticateUser,limiter,validateRequest(validators.routeValidators.registerManager),controllers.AdminController.registerManager)

export default router