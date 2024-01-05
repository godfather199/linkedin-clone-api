import http from 'http'
import app from '../app.js'
import { Server } from 'socket.io'



// Create 'http' server
const server = http.createServer(app)

// Attach 'socket server'
const io = new Server(server, {
    cors: {
        // origin: 'http://localhost:5173'
        origin: 'https://linkedin-clone-client.onrender.com'
    }
})



// Socket event handlers
io.on('connection', (socket) => {
    console.log('User connected: ', socket.id)


    socket.on('setup', (userData) => {
        socket.join(userData?._id)
        // console.log('Setup: ', socket.rooms)
        socket.emit('connected')
    })


    socket.on('like_post', (info) => {
        // console.log('Like post: ', info)
        socket.in(info.post_Author).emit('like_post_notification', info)
    })


    socket.on('client_like_post_realtime', (info) => {
        // console.log('Like post: ', info)
        socket.in(info.post_Author).emit('server_like_post_realtime', info)
    })
    
    
    socket.on('post_comment', (info) => {
        // console.log('Post comment: ', info)
        socket.in(info.post_Author).emit('post_comment_notification', info)
    })


    socket.on('follow_user', (info) => {
        // console.log('Follow user: ', info)
        socket.in(info.user_Followed).emit('notification_follow_user', info)
    })


    socket.on('job_Applied', (info) => {
        // console.log('Job info: ', info)
        socket.in(info.job_Author_Id).emit('notification_Job_Applied', info)
    })


    socket.on('send_New_Message', (info) => {
        console.log('New Message: ', info)
        socket.in(info.receiver).emit('receive_New_Message', info)
    })


    socket.on('typing', (info) => {
        socket.in(info.receiver).emit('typing')
    })


    socket.on('stop typing', (info) => {
        socket.in(info.receiver).emit('stop typing')
    })



    // Disconnect from 'socket-server'
    socket.off('setup', () => {
        socket.leave(userData?._id)
        console.log('User disconnected: ', socket.rooms)
    })
})



export default server