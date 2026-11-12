import { Router } from "express";
import { bookAppointment, cancelAppointment, getUserAppointments, getUserProfile, paymentRazorPay, registerUser, updateUserProfile, userLogin,  } from "../controllers/userController.mjs";
import authUser from "../middlewares/authUser.mjs";
import upload from "../middlewares/multer.mjs";

const userRoutes = Router()

userRoutes.post('/register', registerUser)

userRoutes.post('/login', userLogin )

userRoutes.get('/get-profile', authUser, getUserProfile)

userRoutes.post('/update-profile', upload.single('image'), authUser, updateUserProfile)

userRoutes.post('/book-appointment', authUser, bookAppointment)

userRoutes.get('/user-appointments', authUser, getUserAppointments)

userRoutes.post('/cancel-appointment', authUser, cancelAppointment)

userRoutes.post('/payment-razorpay', authUser, paymentRazorPay)



export default userRoutes;