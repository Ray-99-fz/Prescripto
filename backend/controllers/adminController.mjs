import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorsModel.mjs'
import jwt from 'jsonwebtoken'
import upload from '../middlewares/multer.mjs'
import appointmentModel from '../models/appointmentModel.mjs'
import userModel from '../models/userModel.mjs'


// API for adding Doctor

const addDoctor = async (req, res) => {
    console.log('\n========== ADD DOCTOR REQUEST ==========')

    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fee,
            address
        } = req.body

        const imageFile = req.file

        // 1. Log received data safely
        console.log('Received doctor details:', {
            name,
            email,
            speciality,
            degree,
            experience,
            fee,
            address,
            passwordReceived: Boolean(password),
            imageReceived: Boolean(imageFile),
            imageDetails: imageFile
                ? {
                    originalname: imageFile.originalname,
                    mimetype: imageFile.mimetype,
                    size: imageFile.size,
                    path: imageFile.path,
                    hasBuffer: Boolean(imageFile.buffer)
                }
                : null
        })

        // 2. Validate required fields
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            fee === undefined ||
            fee === null ||
            fee === '' ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required doctor details'
            })
        }

        // 3. Validate the email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        // 4. Validate the password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            })
        }

        // 5. Validate that a file was received
        if (!imageFile) {
            console.error(
                'DEBUG: No image received. Check the frontend FormData field name and upload middleware.'
            )

            return res.status(400).json({
                success: false,
                message: 'Please upload a doctor profile image'
            })
        }

        // This endpoint currently expects Multer disk storage.
        if (!imageFile.path) {
            console.error(
                'DEBUG: The uploaded file has no disk path.',
                {
                    hasBuffer: Boolean(imageFile.buffer),
                    storageType: imageFile.buffer ? 'memory' : 'unknown'
                }
            )

            return res.status(400).json({
                success: false,
                message:
                    'The uploaded image has no file path. Check your Multer storage configuration.'
            })
        }

        // 6. Parse the address before uploading the image
        let parsedAddress

        try {
            parsedAddress = JSON.parse(address)
        } catch (error) {
            console.error('DEBUG: Address JSON parsing failed:', error.message)

            return res.status(400).json({
                success: false,
                message: 'Address must contain valid JSON'
            })
        }

        // 7. Hash the doctor's password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log(hashedPassword)

        // 8. Upload the image to Cloudinary
        let imageUpload

        console.log('\n========== CLOUDINARY UPLOAD DEBUG ==========')
        console.log('File path:', imageFile.path)
        console.log('Original filename:', imageFile.originalname)
        console.log('MIME type:', imageFile.mimetype)
        console.log('File size:', imageFile.size)

        try {
            imageUpload = await cloudinary.uploader.upload(
                imageFile.path,
                {
                    resource_type: 'image'
                }
            )

            console.log('Cloudinary upload succeeded:', {
                public_id: imageUpload.public_id,
                secure_url: imageUpload.secure_url,
                format: imageUpload.format,
                bytes: imageUpload.bytes
            })
        } catch (error) {
            // All Cloudinary-specific diagnostics stay inside this catch.
            console.error('\n========== CLOUDINARY UPLOAD FAILED ==========')

            console.error('Error summary:', {
                message: error.message,
                name: error.name,
                http_code: error.http_code,
                error: error.error,
                cause: error.cause
            })

            console.error('Error stack:', error.stack)

            console.error(
                'Own error properties:',
                Object.getOwnPropertyNames(error)
            )

            console.dir(error, { depth: 5 })

            // Some SDK errors expose an HTTP response; others do not.
            if (error.response) {
                console.error('HTTP response status:', error.response.status)
                console.error('HTTP response headers:', error.response.headers)

                console.error(
                    'Cloudinary diagnostic header:',
                    error.response.headers?.['x-cld-error']
                )

                console.dir(error.response.data, { depth: 5 })
            } else {
                console.error(
                    'No HTTP response object is exposed by this SDK error.'
                )
            }

            return res.status(502).json({
                success: false,
                message: 'Cloudinary image upload failed',
                debug: {
                    errorName: error.name,
                    httpCode: error.http_code,
                    errorMessage: error.message
                }
            })
        }

        // 9. Prepare the doctor record
        const doctorData = {
            name,
            email,
            image: imageUpload.secure_url,
            hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address: parsedAddress,
            date: Date.now()
        }

        console.log(doctorData)

        console.log('\n========== SAVING DOCTOR ==========')
        console.log('Doctor data prepared:', {
            name: doctorData.name,
            email: doctorData.email,
            image: doctorData.image,
            speciality: doctorData.speciality
        })

        // 10. Save to MongoDB
        // This is deliberately outside the Cloudinary catch so database
        // errors are not incorrectly reported as upload failures.
        const newDoctor = new doctorModel(doctorData)

        await newDoctor.save()

        console.log('Doctor saved successfully.')

        return res.status(201).json({
            success: true,
            message: 'Doctor added successfully'
        })

    } catch (error) {
        console.error('\n========== ADD DOCTOR FAILED ==========')
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        console.dir(error, { depth: 5 })

        return res.status(500).json({
            success: false,
            message: 'Failed to add doctor',
            error: error.message
        })
    }
}


const getAllDoctors = async (req, res) => {
    try {
        console.log(`Fetching all available doctors`)

        const doctors = await doctorModel.find({}).select('-hashedPassword')
        res.json({
            success: true,
            doctors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


const adminLogin = async (req, res) => {
    try {
        console.log(req.body)
        const {
            email,
            password
        } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY)

            return res.json({
                success: true,
                token
            })
        }else{
            return res.json({
                success: false,
                message: "Invalid credential. Try again"
            })
        }


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const appointmentsAdmin = async (req, res) => {
    try {
        
        const appointments = await appointmentModel.find({})

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


const adminCancelAppointment = async (req, res) => {
    try {

        const {
            appointmentId
        } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})


        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({
            success: true, 
            message: `Appointment cancelled!`
        })


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const adminDashboard = async (req, res) => {
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
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


export {addDoctor, adminLogin, getAllDoctors, appointmentsAdmin, adminCancelAppointment, adminDashboard}