import {Schema, model} from 'mongoose'

const {ObjectId} = Schema.Types


const postSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    postImage: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    postedBy: {
        type: ObjectId,
        ref: 'user'
    },
    likes: [
        {
            type: ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            user: {
                type: ObjectId,
                ref: 'user'
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    featured: {
        type: Boolean
    }
},
{
    timestamps: true
})



export default model('post', postSchema)