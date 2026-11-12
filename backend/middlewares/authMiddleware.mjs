import jwt from 'jsonwebtoken'

const authAdmin = (req, res, next) => {
    try {
        const {
            admintoken
        } = req.headers

        if (!admintoken) {
            return res.json({
                success: false,
                msg: `Not authorized, Login again`
            })
        }

        const decodedToken = jwt.decode(admintoken)

        if (decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                msg: `Not authorized, Login again`
            })
        }

        next()
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message
        })
    }    
}

export default authAdmin