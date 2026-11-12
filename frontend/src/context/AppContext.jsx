import { createContext } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const [doctors, setDoctors] = useState([])
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') ? localStorage.getItem('userToken') : false)
    const [userData, setUserData] = useState(false)

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getDoctors = async () => {
        try {
            
            const { data } = await axios.get(backendUrl+`/api/doctors/list`)
            console.log(`Logging out the doctor's data from the db: `, data)

            if (data.success) {
                setDoctors(data.doctors)
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            console.log(userToken)

            const {
                data
            } = await axios.get(backendUrl+`/api/users/get-profile`, {
                headers: {
                    userToken
                }
            })

            console.log(data)
            console.log(data.data)
            
            if (data.success) {
                setUserData(data.data)
                
            }else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    } 

    useEffect(() => {
        getDoctors()
    }, [])

    useEffect(() => {
        if (userToken) {
            loadUserProfileData()
        }else {
            setUserData(false)
        }
    }, [userToken])

    const value = {
        doctors,
        getDoctors,
        currencySymbol,
        userToken,
        setUserToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}