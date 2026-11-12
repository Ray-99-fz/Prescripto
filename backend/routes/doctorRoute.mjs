import { Router } from "express";
import { appointmentCancelled, appointmentComplete, doctorDashboard, doctorList, doctorLogIn, doctorProfile, getAppointments, updateDoctorProfile } from "../controllers/doctorController.mjs";
import authDoctor from "../middlewares/authDoctor.mjs";

const doctorRoutes = Router()

doctorRoutes.get('/list', doctorList)

doctorRoutes.post('/login', doctorLogIn)

doctorRoutes.get('/doctor-appointments', authDoctor, getAppointments)

doctorRoutes.post('/complete-appointment', authDoctor, appointmentComplete)

doctorRoutes.post('/cancel-appointment', authDoctor, appointmentCancelled)

doctorRoutes.get('/doctor-dashboard', authDoctor, doctorDashboard)

doctorRoutes.get('/doctor-profile', authDoctor, doctorProfile)

doctorRoutes.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRoutes;