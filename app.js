import express from 'express'
import {config} from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import passport from 'passport'
import postRouter from './routes/post.route.js'
import userRouter from './routes/user.route.js'
import jobRouter from './routes/job.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'
import passportSetup from './passport.js'
import googleRouter from './routes/google.route.js'



// Initialize express
const app = express()
config()



// Middlewares
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: 'https://linkedin-clone-client.onrender.com',
    credentials: true
}))



// Passport setup
app.use(passport.initialize())
app.use(passport.session())



// Route Middlewares
app.use('/api/post', postRouter)
app.use('/api/user', userRouter)
app.use('/api/job', jobRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/auth', googleRouter)



// Error Middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong'

    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})



export default app