import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/mongodb.mjs'
import connectCloudinary from './config/cloudinary.mjs'
import barrelRouter from './routes/barrelRoute.mjs'

dotenv.config()

// App config
const app = express()
const PORT = process.env.PORT || 4000
connectDB()
await connectCloudinary()

const frontendOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5177",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean)

app.use(
    cors({
        origin: frontendOrigins,
        methods: ['POST', 'GET'],
        credentials: true
    })
)

// app middlewares
app.use(express.json())


// Api Endpoints

app.use('/api', barrelRouter)

app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(PORT, () => {
    console.log(`Server is listening from port: ${PORT}`)
})