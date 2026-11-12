
import React, { useState, useContext, useEffect } from 'react'

import { AppContext } from '../context/AppContext'

import { toast } from 'react-toastify'

import { assets } from '../assets/assets_frontend/assets.js'

import axios from 'axios'


const MyProfile = () => {

    const {
        userData,
        setUserData,
        loadUserProfileData,
        userToken,
        backendUrl,
    } = useContext(AppContext)


    const [isEdit, setIsEdit] = useState(false)

    // Stores the actual selected File object
    const [image, setImage] = useState(null)

    // Stores the temporary URL used for image preview
    const [imagePreview, setImagePreview] = useState('')


    // Generate a preview whenever a new image is selected
    useEffect(() => {

        if (!image) {
            setImagePreview('')
            return
        }

        const previewUrl = URL.createObjectURL(image)

        setImagePreview(previewUrl)

        // Clean up the temporary URL
        return () => {
            URL.revokeObjectURL(previewUrl)
        }

    }, [image])


    // Handle ordinary input changes
    const handleChange = (e) => {

        const { name, value } = e.target

        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    // Handle nested address changes
    const handleAddressChange = (e) => {

        const { name, value } = e.target

        setUserData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }))
    }


    // Handle image selection
    const handleImageChange = (e) => {

        const selectedImage = e.target.files?.[0]

        if (!selectedImage) return

        // Make sure the selected file is an image
        if (!selectedImage.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        setImage(selectedImage)
    }


    // Update user profile
    const updateUserProfileData = async () => {

        try {

            const payload = new FormData()


            // Append image only if a new image was selected
            if (image) {
                payload.append('image', image)
            }


            payload.append('name', userData.name)

            payload.append('phone', userData.phone)

            payload.append('gender', userData.gender)


            const dob = userData.dob === "Not Selected"
                ? ""
                : userData.dob?.slice(0, 10) || ""


            payload.append('dob', dob)


            payload.append(
                'address',
                JSON.stringify(userData.address)
            )

            payload.forEach((key, value) => {
                console.log(`Payload after submission: ${key}: ${value}`)
            })

            console.log([...payload.entries()])

            console.log(payload.get('image'))


            const { data } = await axios.post(
                `${backendUrl}/api/users/update-profile`,
                payload,
                {
                    headers: {
                        usertoken: userToken
                    }
                }
            )


            if (data.success) {

                toast.success('Profile updated successfully')

                await loadUserProfileData()

                setIsEdit(false)

                setImage(null)

            } else {

                toast.error(data.message)

            }


        } catch (error) {

            console.error(
                'Profile update error:',
                error.response?.data || error
            )

            toast.error(
                error.response?.data?.message || error.message
            )

        }
    }


    // Format date for HTML date input
    const formattedDob = (
        userData.dob === "Not Selected"
            ? ""
            : userData.dob?.slice(0, 10) || ""
    )


    return userData && (

        <div className='max-w-lg flex flex-col gap-2 text-sm'>

            {/* Profile Image */}

            {
                isEdit

                    ? <label htmlFor="image">

                        <div className="inline-block relative cursor-pointer">

                            <img
                                className="w-36 rounded opacity-75"
                                src={
                                    imagePreview ||
                                    userData.image
                                }
                                alt="User Image"
                            />

                            {/* Show upload icon only when no new image is selected */}

                            {!image && (
                                <img
                                    className='w-10 absolute bottom-12 right-12'
                                    src={assets.upload_icon}
                                    alt="Upload Icon"
                                />
                            )}

                        </div>


                        <input
                            className='hidden'
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                    </label>

                    : <img
                        className='w-36 rounded'
                        src={userData.image}
                        alt='Profile Picture'
                    />
            }


            {/* User Name */}

            {
                isEdit

                    ? <input
                        className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
                        type="text"
                        name="name"
                        value={userData.name || ""}
                        onChange={handleChange}
                    />

                    : <p className='font-medium text-3xl text-neutral-800 mt-4'>
                        {userData.name}
                    </p>
            }


            <hr className='bg-zinc-400 h-[1px] border-none' />


            {/* Contact Information */}

            <div>

                <p className='uppercase text-neutral-500 underline mt-3'>
                    contact information
                </p>


                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">

                    <p className='font-medium'>Email id:</p>

                    <p className='text-blue-500'>
                        {userData.email}
                    </p>


                    <p className='font-medium'>Phone:</p>

                    {
                        isEdit

                            ? <input
                                className='bg-gray-100 max-w-52'
                                type="tel"
                                name="phone"
                                value={userData.phone || ""}
                                onChange={handleChange}
                            />

                            : <p className='text-blue-400'>
                                {userData.phone}
                            </p>
                    }


                    <p>Address:</p>

                    {
                        isEdit

                            ? <p>

                                <input
                                    className='bg-gray-50'
                                    type="text"
                                    name="line1"
                                    value={userData.address?.line1 || ""}
                                    onChange={handleAddressChange}
                                />

                                <br />

                                <input
                                    className='bg-gray-50'
                                    type="text"
                                    name="line2"
                                    value={userData.address?.line2 || ""}
                                    onChange={handleAddressChange}
                                />

                            </p>

                            : <p className='text-gray-500'>
                                {userData.address?.line1}
                                <br />
                                {userData.address?.line2}
                            </p>
                    }

                </div>

            </div>


            {/* Basic Information */}

            <div>

                <p className='uppercase text-neutral-500 underline mt-3'>
                    basic information
                </p>


                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">

                    <p className='font-medium'>Gender:</p>

                    {
                        isEdit

                            ? <select
                                className='max-w-32 bg-gray-100'
                                name="gender"
                                value={userData.gender || ""}
                                onChange={handleChange}
                            >

                                <option value="Male">Male</option>

                                <option value="Female">Female</option>

                            </select>

                            : <p className='text-gray-400'>
                                {userData.gender}
                            </p>
                    }


                    <p className='font-medium'>Birthday:</p>

                    {
                        isEdit

                            ? <input
                                className='max-w-40 bg-gray-100'
                                type="date"
                                name="dob"
                                value={formattedDob}
                                onChange={handleChange}
                            />

                            : <p className='text-gray-400'>
                                {formattedDob || "Not Selected"}
                            </p>
                    }

                </div>

            </div>


            {/* Edit / Save Buttons */}

            <div className="mt-10">

                {
                    isEdit

                        ? <button
                            type="button"
                            className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all'
                            onClick={updateUserProfileData}
                        >
                            Save information
                        </button>

                        : <button
                            type="button"
                            className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all'
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </button>
                }

            </div>

        </div>

    )
}


export default MyProfile
