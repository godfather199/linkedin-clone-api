import {Router} from 'express'
import { authenticateUser, edit_User_Info, fetch_All_Users, fetch_Saved_Post, follow_Unfollow_User, logged_In_User_Info, loginUser, logout_User, registerUser, remove_Saved_Post, saved_Post, user_By_Name, user_Details_By_Id, user_Search_Bar } from '../controllers/user.controller.js'
import verifyToken from '../middlewares/verifyToken.js'


const router = Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/authenticate-user', verifyToken, authenticateUser)
router.get('/follow/:userId', verifyToken, follow_Unfollow_User)
router.get('/user-details/:username', verifyToken, user_By_Name)
router.get('/search-bar', user_Search_Bar)
router.put('/edit-user', verifyToken, edit_User_Info)
router.get('/logout', logout_User)
router.post('/saved-post/:postId', verifyToken, saved_Post)
router.get('/saved-post', verifyToken, fetch_Saved_Post)
router.delete('/saved-post/:postId', verifyToken, remove_Saved_Post)
router.get('/logged-in-user', verifyToken, logged_In_User_Info)
router.get('/user-details-id/:id', verifyToken, user_Details_By_Id)
router.get('/all-users', verifyToken, fetch_All_Users)


export default router



