import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p className='uppercase'>
          about <span className='text-gray-700 font-medium'>us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About Image" />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos cum voluptas consequatur facere? Id possimus totam quisquam et numquam, delectus earum quam, quia ab esse ullam, eveniet inventore voluptatem dignissimos!</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis magni ad ut quibusdam minima! Fugiat excepturi ad quisquam accusamus blanditiis, et, quam esse sunt, nesciunt cum perspiciatis itaque perferendis fuga?</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur quis dolorem necessitatibus hic, natus quo quas labore inventore voluptate ipsa sunt, recusandae tempore amet deserunt excepturi quam nulla velit?</p>
        </div>
      </div>

      <div className="uppercase text-xl my-4">
        <p>
          why <span className='text-gray-700'>choose us</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>
            Efficiency:
          </b>
          <p>
            Streamlined appointment scheduling that fits into your busy lifestyle.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>
            Convinience:
          </b>
          <p>
            Access to a network of trusted healthcare professionals in your area.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>
            Personalization:
          </b>
          <p>
            Tailored recomendations and reminders to help you stay on top of your health.
          </p>
        </div>
      </div>

    </div>
  )
}

export default About
