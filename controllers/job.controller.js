import User from '../models/user.model.js'
import Job from '../models/job.model.js'
import {upload_Image_Cloudinary} from '../utils/cloudinary.util.js'
import errorHandler from '../middlewares/errorHandler.js'



export const create_New_Job = async (req, res, next) => {
    try {
        const {id: logged_In_UserId} = req.user
        const {companyImg} = req.body

        const logged_In_User = await User.findById(logged_In_UserId)

        const {public_id, secure_url} = await upload_Image_Cloudinary(companyImg)

        const new_Job = await Job.create({
            ...req.body,
            companyLogo: {
                public_id,
                url: secure_url
            },
            jobAuthor: logged_In_UserId
        })

        logged_In_User.jobsCreated.push(new_Job._id)
        await logged_In_User.save()

        res.status(201).json({
            msg: 'Job created successfully',
            new_Job
        })

    } catch (error) {
        next(error)
    }
}



export const fetch_All_Jobs = async (req, res, next) => {
    try {
        const all_Jobs = await Job.find()

        res.status(201).json({
            msg: 'All jobs fetched',
            all_Jobs
        })
    } catch (error) {
        next(error)
    }
}



export const fetch_Single_Job = async (req, res, next) => {
    try {
        const {jobId} = req.params
        
        const job = await Job.findById(jobId).populate("jobAuthor applicants")

        res.status(201).json({
            msg: 'Job Details fetched',
            job
        })
    } catch (error) {
        next(error)
    }
}



export const apply_To_Job = async (req, res, next) => {
    try {
        const {id: applicantId} = req.user
        const {jobId} = req.params

        const applicant = await User.findById(applicantId)
        const jobApplied = await Job.findById(jobId) 

        if(jobApplied.jobAuthor.toString() === applicant._id.toString()) {
            return res.status(400).json({
                msg: "You cannot apply to your own created job"
            })
        }

        if(jobApplied.applicants.includes(applicantId)) {
            return next(errorHandler(400, 'Already applied to this job'))
        }

        jobApplied.applicants.push(applicantId)
        await jobApplied.save()

        applicant.jobsAppliedTo.push(jobId)
        await applicant.save()

        res.status(201).json({
            msg: 'Applied to job successfully',
            applicant,
            jobApplied
        })
    } catch (error) {
        next(error)
    }
}



export const unapply_From_Job = async (req, res, next) => {
    try {
        const {id: applicantId} = req.user
        const {jobId} = req.params

        const applicant = await User.findById(applicantId)
        const jobApplied = await Job.findById(jobId) 

        
        jobApplied.applicants = jobApplied.applicants.filter(item => item.toString() !== applicantId.toString())
        await jobApplied.save()

        applicant.jobsAppliedTo = applicant.jobsAppliedTo.filter(item => item.toString() !== jobId.toString())
        await applicant.save()

        res.status(201).json({
            msg: 'Unapplied to Job',
            applicant, 
            jobApplied
        })

    } catch (error) {
        next(error)
    }
}



export const fetch_Jobs_Created_By_User = async (req, res, next) => {
    try {
        const {id: logged_In_UserId} = req.user

        const user_Created_Jobs = await Job.find({jobAuthor: logged_In_UserId})

        res.status(201).json({
            msg: 'Created jobs fetched',
            user_Created_Jobs
        })

    } catch (error) {
        next(error)
    }
}



export const fetch_Jobs_Applied_By_User = async (req, res, next) => {
    try {
        const {id: logged_In_UserId} = req.user

        const logged_In_User = await User.findById(logged_In_UserId).populate(
          "jobsAppliedTo"
        );

        const {jobsAppliedTo, ...others} = logged_In_User

        // console.log('Result: ', logged_In_User.jobsAppliedTo)

        res.status(201).json({
            msg: 'Jobs Fetched',
            jobsAppliedTo
        })
    } catch (error) {
        next(error)
    }
}






