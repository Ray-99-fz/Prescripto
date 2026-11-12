
import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
    try {
        const {
            usertoken
        } = req.headers

        if (!usertoken) {
            return res.json({
                success: false,
                msg: `Not authorized, Login again`
            })
        }

        const decodedToken = jwt.verify(usertoken, process.env.JWT_SECRET_KEY)
        console.log(`logging decoded token from authUser middleware: `, decodedToken)

        console.log(`logging user id from the authUser middleware: `, decodedToken.id)
        const { id } = decodedToken
        console.log(`logging destructured user id from the authUser middleware: `, id)

        req.userId = id
        console.log(`logging user id from the authUser middleware: `, req.userId)

        next()
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message
        })
    }    
}

export default authUser