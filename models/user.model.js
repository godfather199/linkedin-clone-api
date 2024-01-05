import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'


const {ObjectId} = Schema.Types


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        // required: true
      },
      url: {
        type: String,
        // required: true
      },
    },
    coverImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    posts: [
      {
        type: ObjectId,
        ref: "post",
      },
    ],
    saved: [
      {
        type: ObjectId,
        ref: "post",
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    tagline: {
      type: String,
    },
    education: {
      name: {
        type: String,
      },
      timeline: {
        type: String,
      },
    },
    hashtags: [
      {
        type: String,
      },
    ],
    city: {
      type: String,
    },
    about: [
      {
        type: String,
      },
    ],
    previousOccupation: [
      {
        title: {
          type: String,
        },
        company: {
          type: String,
        },
        timeline: {
          type: String,
        },
      },
    ],
    jobsCreated: [
      {
        type: ObjectId,
        ref: "job",
      },
    ],
    jobsAppliedTo: [
      {
        type: ObjectId,
        ref: "job",
      },
    ],
  },
  {
    timestamps: true,
  }
);




// Hashing & saving password
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }

    next()
})


// Verifying password
userSchema.methods.comparePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
}





export default model('user', userSchema)