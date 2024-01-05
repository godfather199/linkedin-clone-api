import errorHandler from "./errorHandler.js"
import jwt from 'jsonwebtoken'



const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) {
        return next(errorHandler(401, 'User not authenticated'))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if(err) {
            return next(errorHandler(403, 'User not authorized'))
        }

        req.user = data

        next()
    })
}


export default verifyToken