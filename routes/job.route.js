import {Router} from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { apply_To_Job, create_New_Job, fetch_All_Jobs, fetch_Jobs_Applied_By_User, fetch_Jobs_Created_By_User, fetch_Single_Job, unapply_From_Job } from '../controllers/job.controller.js'



const router = Router()


router.post('/create-job', verifyToken, create_New_Job)
router.get('/fetch-all-jobs', fetch_All_Jobs)
router.get('/fetch-single-job/:jobId', fetch_Single_Job)
router.post('/apply-job/:jobId', verifyToken, apply_To_Job)
router.post('/unapply-job/:jobId', verifyToken, unapply_From_Job)
router.get('/jobs-created-user', verifyToken, fetch_Jobs_Created_By_User)
router.get('/jobs-applied-to-user', verifyToken, fetch_Jobs_Applied_By_User)




export default router