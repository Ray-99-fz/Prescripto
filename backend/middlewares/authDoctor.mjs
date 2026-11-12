
import jwt from 'jsonwebtoken'

const authDoctor = (req, res, next) => {
    try {
        const {
            doctortoken
        } = req.headers

        if (!doctortoken) {
            return res.json({
                success: false,
                msg: `Not authorized, Login again`
            })
        }

        const decodedToken = jwt.verify(doctortoken, process.env.JWT_SECRET_KEY)
        console.log(`logging decoded token from authUser middleware: `, decodedToken)

        console.log(`logging user id from the authUser middleware: `, decodedToken.id)
        const { id } = decodedToken
        console.log(`logging destructured user id from the authUser middleware: `, id)

        req.doctorId = id
        console.log(`logging user id from the authUser middleware: `, req.doctorId)

        next()
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message
        })
    }    
}

export default authDoctor