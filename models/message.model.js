import {Schema, model} from 'mongoose'



const {ObjectId} = Schema.Types



const messageModel = new Schema(
  {
    sender: {
      type: ObjectId,
      ref: "user",
    },
    chat: {
      type: ObjectId,
      ref: "chat",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



export default model('message', messageModel)