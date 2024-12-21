import express from "express";
const router = express.Router();
import admin from "./admin"
import manager from "./manager"
import user from "./user"

const defaultRoutes = [
  {
    path: "/admin",
    route: admin,
  },
  {
    path: "/manager",
    route: manager,
  },
  {
    path: "/user",
    route: user,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", async (req: any, res: any) => {
  return res.send("Server is running");
});


export default router;
