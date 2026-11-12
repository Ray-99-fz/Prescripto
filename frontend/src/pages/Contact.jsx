import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Contact = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 text-gray-500">
        <p className='uppercase'>
          contact <span className='text-gray-700 font-medium'>us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="About Image" />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className='uppercase font-semibold text-lg text-gray-600'>
            our office
          </p>
          <p className='text-gray-500'>
            Blantyre, <br /> Top Mandala Road
          </p>
          <p className='text-gray-500'>
            Tel: +265984368805 <br /> Email: raykareem@gmail.com
          </p>
          <p className='font-semibold text-lg text-gray-600'>
            careers at PRESCRIPTO
          </p>
          <p className='text-gray-500'>
            Learn more about our teams and job openings
          </p>
          <button className='border max-w-[150px] border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default Contact
