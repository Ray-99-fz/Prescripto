import { useContext, useState } from 'react'
import { assets } from '../assets/assets_admin/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Navigate, replace, useNavigate } from 'react-router-dom'
import { DoctorsContext } from '../context/DoctorsContext.jsx'

const Login = () => {
    const [state, setState] = useState('Admin')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    console.log(formData)

    const {setAdminToken, backendUrl} = useContext(AdminContext)
    const {
        doctorToken,
        setDoctorToken
    } = useContext(DoctorsContext)

    const navigate = useNavigate()


    const handleInputChange = async (e) => {
        const {name, value} = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const payload = {
                email: formData.email,
                password: formData.password
            }

            console.log(payload)

            if (state === 'Admin') {
                console.log(`Submitting as Admin`)

                const {
                    data
                } = await axios.post(backendUrl+`/api/admin/login`, 
                    payload
                )
                console.log(data)
                
                if (data.success) {
                    localStorage.setItem('adminToken', data.token)
                    setAdminToken(data.token)
                    navigate('/', {replace: true})
                }else {
                    toast.error(data.message)
                }
                
                console.log(data, data.token)
            }else {
                console.log(`Submitting as Doctor`)
                console.log(payload)

                const {
                    data
                } = await axios.post(backendUrl+`/api/doctors/login`,
                    payload
                )

                if (data.success) {
                    localStorage.setItem('doctorToken', data.doctorToken)
                    setDoctorToken(data.doctorToken)
                    navigate('/doctor-dashboard', {replace: true})
                    console.log(data.doctorToken)
                }else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


  return (
    <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
            <p className='text-2xl font-semibold m-auto'>
                <span className='text-[#5F6FFF]'>
                    {state}
                </span> Login

                
            </p>

            <div className="w-full">
                <p>Email</p>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required 
                    className='border border-[#DADADA] rounded w-full p-2 mt-1'
                />
            </div>
            <div className="w-full">
                <p>Password</p>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required 
                    className='border border-[#DADADA] rounded w-full p-2 mt-1'
                />
            </div>
            <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>
                Login
            </button>

            {
                state === 'Admin'
                ? <p>Doctor Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                : <p>Admin Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
            }
        </div>
    </form>
  )
}

export default Login
