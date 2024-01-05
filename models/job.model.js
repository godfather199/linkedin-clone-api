import {Schema, model} from 'mongoose'



const {ObjectId} = Schema.Types


const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyLogo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  location: {
    type: String,
    required: true,
  },
  jobAuthor: {
    type: ObjectId,
    ref: "user",
    required: true
  },
  applicants: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
},
{
    timestamps: true
});




export default model('job', jobSchema)