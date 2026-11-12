import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate()

  return (
    <div className='md:mx-10'>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left */}
        <div className="">
            <img onClick={() => {navigate('/'); scrollTo(0,0)}} className='cursor-pointer mb-5 w-40' src={assets.logo} alt="Logo" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ad reprehenderit porro reiciendis pariatur dolorem iste dolorum qui fuga aliquam.
            </p>
        </div>

        {/* Center */}
        <div className="">
            <p className='text-xl font-medium mb-5'>
                Company
            </p>

            <ul className='flex flex-col gap-2 text-gray-600 cursor-pointer'>
                <li onClick={() => {navigate('/'); scrollTo(0,0)}}>Home</li>
                <li onClick={() => {navigate('about'); scrollTo(0,0)}}>About</li>
                <li onClick={() => {navigate('contact'); scrollTo(0,0)}}>Contact us</li>
                <li onClick={() => {navigate('/'); scrollTo(0,0)}}>Privacy policy</li>
            </ul>
        </div>

        {/* Right */}
        <div className="">
            <p className='text-xl font-medium mb-5'>
                Get in Touch
            </p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+265984368805</li>
                <li>raykareem@gmail.com</li>
            </ul>
        </div>
      </div>
      
      {/* Copyright text */}
      <div className="">
        <hr />
        <p className='py-5 text-sm text-center'>
            Copyright 2026 @ CoreStack Solutions - All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer
