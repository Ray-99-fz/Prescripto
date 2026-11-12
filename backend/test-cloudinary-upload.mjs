
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'node:fs/promises'
import path from 'node:path'

const testFile =
    'C:/Users/hp/appointment/frontend/src/assets/assets_frontend/doc4.png'

async function testCloudinaryUpload() {
    const config = {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    }

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        throw new Error('Cloudinary environment variables are missing.')
    }

    const fileBuffer = await fs.readFile(testFile)

    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `diagnostic-${Date.now()}`

    // Generate a valid signature using the SDK utility.
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            public_id: publicId
        },
        config.api_secret
    )

    // Send the upload directly over HTTP instead of using
    // cloudinary.uploader.upload().
    const form = new FormData()

    form.append(
        'file',
        new Blob([fileBuffer], { type: 'image/png' }),
        path.basename(testFile)
    )

    form.append('api_key', config.api_key)
    form.append('timestamp', String(timestamp))
    form.append('public_id', publicId)
    form.append('signature', signature)

    const endpoint =
        `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`

    console.log('Sending direct HTTP upload to Cloudinary...')
    console.log('File:', path.basename(testFile))
    console.log('File size:', fileBuffer.length, 'bytes')
    console.log('Cloud name:', config.cloud_name)
    console.log('Public ID:', publicId)

    const response = await fetch(endpoint, {
        method: 'POST',
        body: form
    })

    const responseBody = await response.text()

    console.log('\n========== RAW CLOUDINARY RESPONSE ==========')
    console.log('HTTP status:', response.status)
    console.log('HTTP status text:', response.statusText)
    console.log(
        'X-Cld-Error:',
        response.headers.get('x-cld-error')
    )
    console.log(
        'Content-Type:',
        response.headers.get('content-type')
    )
    console.log('Response body:', responseBody)
    console.log('=============================================')
}

testCloudinaryUpload().catch(error => {
    console.error('Diagnostic script failed:', error.message)
})
