
import { v2 as cloudinary } from 'cloudinary'
import fs from 'node:fs'

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true
  })

  console.log('Cloud name:', cloudinary.config().cloud_name)
  console.log('API key loaded:', Boolean(cloudinary.config().api_key))
  console.log('API secret loaded:', Boolean(cloudinary.config().api_secret))

  try {
    const result = await cloudinary.api.ping()
    console.log('Cloudinary authentication successful:', result)
  } catch (error) {
    console.error('Cloudinary ping failed:', error.message)
    return
  }

  // TEMPORARY diagnostic test: remove after troubleshooting.

const testFile =
  'C:/Users/hp/appointment/frontend/src/assets/assets_frontend/doc4.png'

console.log('Path being checked:', testFile)
console.log('File exists:', fs.existsSync(testFile))

if (!fs.existsSync(testFile)) {
  console.error('Test image was not found.')
  return
}

console.log('Image found successfully!')

  try {
    const uploadResult = await cloudinary.uploader.upload(testFile, {
      resource_type: 'image',
      public_id: `upload-test-${Date.now()}`
    })

    console.log('Upload successful:', uploadResult.secure_url)
  } catch (error) {
    console.error('Upload test failed:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
      error: error.error,
      response: error.response
    })
  }
}

export default connectCloudinary
