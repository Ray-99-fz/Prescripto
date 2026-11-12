import doctorModel from "../models/doctorsModel.mjs"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.mjs"

const changeAvailability = async (req, res) => {
    try {
        
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})

        res.json({
            success: true,
            message: `Availability changed`
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message: error.message
        })
    }
}

const doctorList = async (req, res) => {
    try {
        
        const doctors = await doctorModel.find({}).select(['-hashedPassword', '-email'])

        res.json({
            success: true,
            doctors
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorLogIn = async (req, res) => {
    try {
        
        console.log(`Doctor login endpoint hit`)
        

        const {
            email,
            password
        } = req.body

        console.log(email, password)

        const doctor = await doctorModel.findOne({email})
        console.log(doctor)

        if (!doctor) {
            return res.json({
                success: false,
                message: `Invalid Credentials`
            })
        }

        const isMatch = await bcrypt.compare(password, doctor.hashedPassword)

        if (isMatch) {
            const doctorToken = jwt.sign({id:doctor._id}, process.env.JWT_SECRET_KEY)
            console.log(`doctorToken: `, doctorToken)
            return res.json({
                success: true,
                doctorToken
            })
        }else {
            return res.json({
                success: false,
                message: `Invalid Credentials`
            })
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const getAppointments = async (req, res) => {
    try {
        const {
            doctorId: docId
        } = req

        console.log(docId)

        const appointments = await appointmentModel.find({docId})
        console.log(`Doctor's appointments: `, appointments)

        res.json({
            success: true,
            appointments
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const appointmentComplete = async (req, res) => {
    try {

        const {
            appointmentId
        } = req.body

        const {
            doctorId: docId
        } = req

        const appointmentData = await appointmentModel.findById(appointmentId)
        console.log(appointmentData)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({
                success: true,
                message: `Appointment Completed`
            })
        }else {
            return res.json({
                success: false,
                message: `Mark failed`
            })
        }    
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const appointmentCancelled = async (req, res) => {
    try {

        const {
            appointmentId
        } = req.body

        const {
            doctorId: docId
        } = req

        const appointmentData = await appointmentModel.findById(appointmentId)
        console.log(appointmentData)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({
                success: true,
                message: `Appointment Cancelled`
            })
        }else {
            return res.json({
                success: false,
                message: `Cancellation failed`
            })
        }    
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorDashboard = async (req, res) => {
    try {
        
        const {
            doctorId: docId
        } = req

        const appointments = await appointmentModel.find({docId})
        console.log(appointments)

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({
            success: true,
            dashData
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorProfile = async (req, res) => {
    try {
        
        const {
            doctorId: docId
        } = req

        const doctorProfile = await doctorModel.findById(docId).select('-hashedPassword')
        console.log(doctorProfile)

        res.json({
            success: true,
            doctorProfile
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const {
            doctorId: docId
        } = req

        const {
            fee, address, available
        } = req.body

        await doctorModel.findByIdAndUpdate(docId, {fee, address, available})

        res.json({
            success: true,
            message: `Profile updated`
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export {changeAvailability, doctorList, doctorLogIn, getAppointments, appointmentComplete, appointmentCancelled, doctorDashboard, doctorProfile, updateDoctorProfile}