import { Router } from "express";
import adminRouter from "./adminRoute.mjs";
import doctorRoutes from "./doctorRoute.mjs";
import userRoutes from "./userRoute.mjs";

const barrelRouter = Router()

barrelRouter.use('/admin', adminRouter)
barrelRouter.use('/doctors', doctorRoutes)
barrelRouter.use('/users', userRoutes)

export default barrelRouter;