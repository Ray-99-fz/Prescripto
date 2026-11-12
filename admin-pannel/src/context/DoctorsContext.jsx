import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorsContext = createContext()

const DoctorsContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctorToken, setDoctorToken] = useState(localStorage.getItem('doctorToken') ? localStorage.getItem('doctorToken') : '')

    const [appointments, setAppointments] = useState([])

    const [dashData, setDashData] = useState(false)

    const [profileData, setProfileData] = useState(false)

    const getDoctorAppointments = async () => {
        try {
            
            const {
                data
            } = await axios.get(backendUrl+`/api/doctors/doctor-appointments`, {
                headers: {doctorToken}
            })

            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log(data.appointments.reverse())
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const {
                data
            } = await axios.post(backendUrl+`/api/doctors/complete-appointment`, {appointmentId}, {
                headers: {doctorToken}
            })

            if (data.success) {
                toast.success(data.message)
                getDoctorAppointments()
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            
            const {
                data
            } = await axios.post(backendUrl+`/api/doctors/cancel-appointment`, {appointmentId}, {
                headers: {doctorToken}
            })

            if (data.success) {
                toast.success(data.message)
                getDoctorAppointments()
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const {
                data
            } = await axios.get(backendUrl+`/api/doctors/doctor-dashboard`, {
                headers: {doctorToken}
            })

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getProfile = async () => {
        try {
            
            const {
                data
            } = await axios.get(backendUrl+`/api/doctors/doctor-profile`, {
                headers: {doctorToken}
            })

            if (data.success) {
                setProfileData(data.doctorProfile)
                console.log(data.doctorProfile)
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateProfile = async () => {
        try {
            const {
                data
            } = await axios.post(backendUrl+`/api/doctors/update-profile`, {
                fees, address, available
            }, {
                headers: {doctorToken}
            })

            if (data.success) {
                toast.success(data.message)
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        backendUrl,
        doctorToken,
        setDoctorToken,
        getDoctorAppointments,
        appointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        getProfile,
        updateProfile,
        profileData,
        setProfileData
    }

    return (
        <DoctorsContext.Provider value={value}>
            {props.children}
        </DoctorsContext.Provider>
    )
}

export default DoctorsContextProvider;