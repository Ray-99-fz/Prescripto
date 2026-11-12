import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect, useState } from 'react'

const MyAppointments = () => {

  const { 
    userToken,
    backendUrl,
    getDoctors
  } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const {
        data
      } = await axios.get(backendUrl+`/api/users/user-appointments`, {
        headers: {userToken}
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId)

      const {
        data
      } = await axios.post(backendUrl+`/api/users/cancel-appointment`, {
        appointmentId
      }, {
        headers: {userToken}
      })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctors()
      }else {
        toast.error(data.message)  
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const appointmentRazorPay = async (appointmentId) => {
    try {
      
      const {
        data
      } = await axios.post(backendUrl+`/api/users/payment-razorpay`, {
        appointmentId
      }, {
        headers: {userToken}
      })

      if (data.success) {
        console.log(data.order)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userToken) {
      getUserAppointments()
    }
  }, [userToken])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

      <div className="">
        {
          appointments.slice(0,3).map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
              <div className="">
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt={item.docData.name} />
              </div>

              <div className="flex-1 text-sm text-zinc-600">
                <p className='text-neutral-800 font-semibold'>
                  {item.docData.name}
                </p>
                <p>
                  {item.docData.speciality}
                </p>
                <p className='text-zinc-700 font-medium mt-1'>
                  Address:
                </p>
                <p className='text-xs'>
                  {
                    item.docData.address.line1
                  }
                </p>
                <p className='text-xs'>
                  {
                    item.docData.address.line2
                  }
                </p>
                <p className='text-xs mt-1'>
                  Date & Time: <span className='text-sm text-neutral-700 font-medium '> {slotDateFormat(item.slotDate)} | {item.slotTime}</span>
                </p>
              </div>

              <div className="">

              </div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && item.payment && !item.isCompleted && <button onClick={() =>appointmentRazorPay(item._id)} className='text-sm py-2 text-stone-500 text-center sm:min-w-48 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>Paid</button> }
                {!item.cancelled && item.payment && !item.isCompleted &&<button onClick={() =>appointmentRazorPay(item._id)} className='text-sm py-2 text-stone-500 text-center sm:min-w-48 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>Pay online</button> }
                {!item.cancelled && !item.isCompleted && <button onClick={() =>cancelAppointment(item._id)} className='text-sm py-2 text-stone-500 text-center sm:min-w-48 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button> }
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button> }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
