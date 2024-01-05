import {Router} from 'express'
import { fetch_All_Message, send_Message } from '../controllers/message.controller.js'
import verifyToken from '../middlewares/verifyToken.js'



const router = Router()



router.get('/:chatId', fetch_All_Message)
router.post('/new-message', verifyToken, send_Message)


export default router