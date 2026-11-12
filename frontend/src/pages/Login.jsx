import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {
    userToken,
    setUserToken,
    backendUrl
  } = useContext(AppContext)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name, value} = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }

      const loginPayload = {
        email: formData.email,
        password: formData.password
      }

      if (state === 'Sign Up') {
        const {
          data
        } = await axios.post(backendUrl+`/api/users/register`, registerPayload)

        if (data.success) {
          localStorage.setItem('userToken', data.userToken)
          setUserToken(data.userToken)
        }else {
          toast.error(data.message)
        }

      }else {
        const {
          data
        } = await axios.post(backendUrl+`/api/users/login`, loginPayload)

        if (data.success) {
          localStorage.setItem('userToken', data.userToken)
          setUserToken(data.userToken)
          console.log(userToken)
        }else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (userToken) {
      navigate('/')
    }
  }, [userToken])

  return (
    <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === 'Sign Up' ? "sign up" : "login"} to book appointment.
        </p>

        {
          state === 'Sign Up' && <div className="w-full">
            <p>Full Name</p>
            <input 
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text" 
              onChange={handleChange}
              name='name'
              value={formData.name}
            />
          </div>
        }
        <div className="w-full">
          <p>Email</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email" 
            onChange={handleChange}
            name='email'
            value={formData.email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password" 
            onChange={handleChange}
            name='password'
            value={formData.password}
          />
        </div>

        <button className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {
          state === 'Sign Up' ?
          <p>
            Already have an account? <span onClick={() => setState('Login')} className='text-[#5f6FFF] underline cursor-pointer'>Login here</span>
          </p>
          : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-[#5f6FFF] underline cursor-pointer'>click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
