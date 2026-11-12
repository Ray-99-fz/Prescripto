import { useContext } from 'react'
import { DoctorsContext } from '../../context/DoctorsContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

  const {
getProfile,
        updateProfile,
                doctorToken,
        profileData,
        setProfileData,
                backendUrl,

  } = useContext(DoctorsContext)

  const {
    calculateAge,
        slotDateFormat,
        currency
  } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfileData = async () => {
    try {
      
      const updateData = {
        address: profileData.address,
        fee: profileData.fee,
        available: profileData.available
      }
      console.log(updateData)

      const {
        data
      } = await axios.post(backendUrl+`/api/doctors/update-profile`, updateData, {
        headers: {doctorToken}
      })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfile()
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (doctorToken) {
      getProfile()
    }
  }, [doctorToken])

  return profileData && (
    <div className=''>
      
        <div className="flex flex-col gap-4 m-5">
          <div className="">
            <img className='bg-blue-500/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="Profile Image" />
          </div>

          <div className="flex-1 border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
              {profileData.name}
            </p>

            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>

              <button className='py-0.5 px-2 border text-xs rounded-full'>
                {profileData.experience}
              </button>
            </div>

            <div className="">
              <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-1'>
                About:
              </p>

              <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                {profileData.about}
              </p>
            </div>

            <p className='text-gray-600 font-medium mt-4'>
              Appointment fee: <span className='tetx-gray-800'> {currency} {isEdit ? <input type="number" onChange={(e) => setProfileData(prev => ({...prev, fee: e.target.value}))} name="" value={profileData.fee} /> : profileData.fee} </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className='text-sm'>
                {isEdit ? <input type="text" name="" onChange={() => setProfileData(prev => ({...prev, address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1} /> : profileData.address.line1}
                <br />
                {isEdit ? <input type="text" name="" onChange={() => setProfileData(prev => ({...prev, address:{...prev.address,line2:e.target.value}}))} value={profileData.address.line2} /> : profileData.address.line2}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input onChange={() => isEdit && setProfileData(prev => ({...prev, available: !prev.available}))} checked={profileData.available} type="checkbox"  />
              <label htmlFor="">Available</label>
            </div>


            {
              isEdit
              ? <button onClick={() => updateProfileData()} className='px-4 py-1 border border-blue-600 text-sm rounded-full mt-5 hover:bg-blue-600 hover:text-white transition-all'>
                  Save
                </button>
              : <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-blue-600 text-sm rounded-full mt-5 hover:bg-blue-600 hover:text-white transition-all'>
                  Edit
                </button>
            }

            
             
          </div>
        </div>

    </div>
  )
}

export default DoctorProfile
