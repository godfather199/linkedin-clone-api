import Message from '../models/message.model.js'
import Chat from '../models/chat.model.js'



export const access_Chat = async (req, res, next) => {
    try {
        const {userId} = req.body
        const {id} = req.user

        let isChat = await Chat.findOne({
          users: {
            $all: [userId, id],
          },
        })
          .populate("users")
          .populate({
            path: "latestMessage.sender",
            select: "name pic email",
          });

        // If previous chat exists
        if(isChat) {
            return res.status(201).json({
                msg: 'Previous chat fetched',
                isChat
            })
        }  

        // Create new chat
        const createdChat = await Chat.create({
            users: [userId, id]
        })

        isChat = await Chat.findOne({
            _id: createdChat._id
        })
        .populate("users")

        res.status(201).json({
            msg: 'New chat created',
            isChat
        })

    } catch (error) {
        next(error)
    }
}



export const fetch_Chats = async (req, res, next) => {
    try {
        const {id} = req.user

        const all_Chats = await Chat.find({
          users: {
            $in: [id],
          },
        })
          .populate("users")
          .populate({
            path: "latestMessage.sender",
            select: "name pic email",
          })
          .sort({ updatedAt: -1 });

        res.status(201).json({
            msg: 'All chats fetched', 
            all_Chats
        })

    } catch (error) {
        next(error)
    }
}