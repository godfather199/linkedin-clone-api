import Message from '../models/message.model.js'
import Chat from '../models/chat.model.js'
import User from '../models/user.model.js'



export const fetch_All_Message = async (req, res, next) => {
    try {
        const {chatId} = req.params

        const messages = await Message.find({chat: chatId})
        .populate('sender', 'name avatar email')
        .populate('chat')

        res.status(201).json({
            msg: 'Fetched all messages',
            messages
        })
    } catch (error) {
        next(error)
    }
}



export const send_Message = async (req, res, next) => {
    try {
        const {content, chatId} = req.body
        const {id} = req.user

        let message = await Message.create({
            sender: id,
            chat: chatId,
            content
        })

        message = await Message.populate(message, [
            { path: "sender", select: "name avatar email" },
            { path: "chat" },
            // { path: "chat.users", select: "name avatar email" },
          ]);

        await Chat.findByIdAndUpdate(
            chatId,
            {
                latestMessage: message
            }
        )

        res.status(201).json({
            msg: 'New message created',
            message
        })
    } catch (error) {
        next(error)
    }
}