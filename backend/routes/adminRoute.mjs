import { Router } from "express";
import { addDoctor, adminCancelAppointment, adminDashboard, adminLogin, appointmentsAdmin, getAllDoctors  } from "../controllers/adminController.mjs";
import upload from "../middlewares/multer.mjs";
import authAdmin from "../middlewares/authMiddleware.mjs";
import { changeAvailability } from "../controllers/doctorController.mjs";

const adminRouter = Router()

adminRouter.post('/add-doctor',
    authAdmin,
    upload.single('image'),
    addDoctor,
    (req, res) => {
        console.log(`add doctor endpoint hit from the routes file`)
    }
)

adminRouter.post('/login',
    adminLogin
)

adminRouter.get('/all-doctors', authAdmin, getAllDoctors)

adminRouter.post('/change-availability', authAdmin, changeAvailability)

adminRouter.get('/appointments', authAdmin, appointmentsAdmin)

adminRouter.post('/cancel-appointment', authAdmin, adminCancelAppointment)

adminRouter.get('/dashboard', authAdmin, adminDashboard)


export default adminRouter