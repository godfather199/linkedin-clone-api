import {Router} from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { access_Chat, fetch_Chats } from '../controllers/chat.controller.js'



const router = Router()



router.post('/', verifyToken, access_Chat)
router.get('/', verifyToken, fetch_Chats)


export default router