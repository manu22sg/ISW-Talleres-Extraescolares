"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";


const router = Router();

router
.use(authenticateJwt).use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/:id", getUser)
  .patch("/detail/:id", updateUser)
  .delete("/detail/:id", deleteUser);
 

export default router;