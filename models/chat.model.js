import {Schema, model} from 'mongoose'



const {ObjectId} = Schema.Types



const chatModel = new Schema({
    users: [
        {
            type: ObjectId,
            ref: 'user'
        }
    ],
    latestMessage: {
        type: ObjectId,
        ref: 'message'
    }
},
{
    timestamps: true
})



export default model('chat', chatModel)