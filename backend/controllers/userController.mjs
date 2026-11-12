import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.mjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorsModel.mjs'
import appointmentModel from '../models/appointmentModel.mjs'
import razorpay from 'razorpay'

const registerUser = async (req, res) => {
    try {
        
        const {
            name, email, password
        } = req.body

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: `Missing details`
            })
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: `Invalid email input`
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: `Enter a strong password`
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, 
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const userToken = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY)

        res.json({
            success: true,
            userToken
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({
                success: false,
                message: `User does not exist`
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const userToken = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY)
            return res.json({
                success: true,
                userToken
            })
        }else {
           return  res.json({
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

const getUserProfile = async (req, res) => {
    try {

        console.log(`logging user id from the get user profile controller: `, req.userId)
        
        const {
            userId
        } = req

        console.log(`logging user id from the get user profile controller: `, userId)

        const userData = await userModel.findById(userId).select('-password')
        console.log(userData)

        res.json({
            success: true,
            data: userData
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const updateUserProfile = async (req, res) => {
    try {

        console.log(`logging user id from the update user profile controller: `, req.userId)

        const {
            name, phone, address, dob, gender
        } = req.body

        const {
            userId
        } = req

        console.log(`logging user id from the update user profile controller: `, userId)

        console.log(userId, name, phone, address, dob, gender)

        const imageFile = req.file
        console.log(`logging image file from the update user profile controller: `, imageFile)

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({
                success: false,
                message: "Data missing"
            })
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address), dob, gender})

        if (imageFile) {
            try {
                console.log(`logging image file path from the update user profile controller: `, imageFile.path)

                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
                console.log(`logging image upload response from the update user profile controller: `, imageUpload)
                const imageURL = imageUpload.secure_url
                console.log(`logging image url from the update user profile controller: `, imageURL)

                await userModel.findByIdAndUpdate(userId, {image: imageURL})
            } catch (error) {
                console.error(`Error uploading image: `, error)
                return res.json({
                    success: false,
                    message: "Error uploading image"
                })
            }
        }

        res.json({
            success: true,
            message: "Profile updated"
        })
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const bookAppointment = async (req, res) => {
    try {

        const {
            doctorId,
            slotDate,
            slotTime
        } = req.body

        const {
            userId: id
        } = req

        console.log(id, doctorId, slotDate, slotTime)

        const docData = await doctorModel.findById(doctorId).select('-hashedPassword')

        console.log(`logging out docData from the db: `, docData)

        if (!docData.available) {
            return res.json({
                success: false,
                message: `Doctor is not available`
            })
        }

        let slots_booked = docData.slots_booked || []

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    sucess: false,
                    message: `Slot already booked`
                })
            }else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(id).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId: id,
            docId: doctorId,
            userData,
            docData,
            amount: docData.fee,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointmet = new appointmentModel(appointmentData)

        await newAppointmet.save()

        await doctorModel.findByIdAndUpdate(doctorId, {slots_booked})

        res.json({
            success: true,
            message: `Appointment booked successfully`
        })


    }catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const getUserAppointments = async (req, res) => {
    try {
        const {
            userId
        } = req

        const appointments = await appointmentModel.find({userId})

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

const cancelAppointment = async (req, res) => {
    try {
        
        const {
            userId
        } = req

        const {
            appointmentId
        } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: `Unauthorized action`
            })
        }
        
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


const razorPayInstance = new razorpay({
    key_id: 'abcdefghijklmnop43',
    key_secret: 'a23hdekkwkjerjnnckdjhn44'
})

const paymentRazorPay = async (req, res) => {
    try {
        const {
            appointmentId
        } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: `Appointment cancelled or not found`
            })
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: 'MWK',
            receipt: appointmentId,
        }

        const order = await razorPayInstance.orders.create(options)

        res.json({
            success: true,
            order
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export {registerUser, userLogin, getUserProfile, updateUserProfile, bookAppointment, getUserAppointments, cancelAppointment, paymentRazorPay}