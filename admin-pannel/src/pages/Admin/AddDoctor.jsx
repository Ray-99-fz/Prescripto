import { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocImage] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        experience: '1 year',
        fee: '',
        speciality: 'General physician',
        degree: '',
        address1: '',
        address2: '',
        about: ''
    })

    console.log(formData)
    console.log(docImg)

    const {backendUrl, adminToken} = useContext(AdminContext)

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (!docImg) {
                return toast.error(`Image not Selected!`)
            }

            const payload = new FormData()

            payload.append('image', docImg)

            
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value)
            })

            payload.append('address', JSON.stringify({line1:formData.address1, line2:formData.address2}))

            payload.forEach((key, value) => {
                console.log(`Payload after submission: ${key}: ${value}`)
            })

            console.log([...payload.entries()])

            console.log(payload.get('image'))

            const {data} = await axios.post(backendUrl+`/api/admin/add-doctor`,payload, {
                headers: { adminToken }
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

  return (
    <form onSubmit={handleSubmit} className='m-5 w-full'>
        <p className='mb-3 text-lg font-medium'>Add Doctor</p>

        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
            <div className="flex items-center gap-4 mb-8 text-gray-500">
                <label htmlFor="doc-img">
                    <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload Area" />
                </label>
                <input type="file" name='docImg' value={formData.docImg} onChange={(e) => setDocImage(e.target.files[0])}  id="doc-img" hidden/>
                <p>Upload doctor <br /> picture</p>
            </div>
        

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <p>Doctor's Name</p>
                    <input className='border rounded px-3 py-2' type="text" placeholder='Name' name="name" required 
                        value={formData.name} onChange={handleInputChange}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Doctor's Email</p>
                    <input className='border rounded px-3 py-2' type="email" placeholder='Email' name="email" required 
                        value={formData.email} onChange={handleInputChange}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Doctor's Password</p>
                    <input className='border rounded px-3 py-2' type='password' placeholder='Password' name="password" required 
                        value={formData.password} onChange={handleInputChange}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Experience</p>
                    <select className='border rounded px-3 py-2' name="experience" 
                        value={formData.experience} onChange={handleInputChange}
                    >
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="4 Years">4 Years</option>
                        <option value="5 Years">5 Years</option>
                        <option value="6 Years">6 Years</option>
                        <option value="7 Years">7 Years</option>
                        <option value="8 Years">8 Years</option>
                        <option value="9 Years">9 Years</option>
                        <option value="10 Years">10 Years</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Fee</p>
                    <input className='border rounded px-3 py-2' type="number" name="fee" required 
                        value={formData.fee} onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <p>Speciality</p>
                    <select className='border rounded px-3 py-2' name="speciality" 
                        value={formData.speciality} onChange={handleInputChange}
                    >
                        <option value="General physician">General physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatricians">Pediatricians</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Education</p>
                    <input className='border rounded px-3 py-2' type="text" name="degree" placeholder='Education' required 
                        value={formData.degree} onChange={handleInputChange}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Address</p>
                    <input className='border rounded px-3 py-2' type="text" name="address1" placeholder='address 1' required 
                        value={formData.address1} onChange={handleInputChange}
                    />
                    <input className='border rounded px-3 py-2' type="text" name="address2" placeholder='address 2' required 
                        value={formData.address2} onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
            <div className="">
                <p className='mt-4 mb-2'>About Doctor</p>
                <textarea className='w-full px-4 pt-2 border rounded' name="about" rows={5} required placeholder='Write about doctor'
                    value={formData.about} onChange={handleInputChange}
                ></textarea>
            </div>

            <button className='bg-[#5F6FFF] px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
        </div>
    </form>
  )
}

export default AddDoctor
