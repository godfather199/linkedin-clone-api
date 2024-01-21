import {Router} from 'express'
import { add_Comment, createPost, delete_Post, edit_Post, fetch_Post_By_Id, fetch_Post_By_Username, like_Unlike_Post, new_User_Show_Posts, posts_Of_Following, toggle_Featured_Post } from '../controllers/post.controller.js'
import verifyToken from '../middlewares/verifyToken.js'



const router = Router()


router.get('/new-user-posts', new_User_Show_Posts)
router.post('/create-post', verifyToken, createPost)
router.get('/posts-following', verifyToken, posts_Of_Following)
router.get('/like-post/:postId', verifyToken, like_Unlike_Post)
router.get('/fetch-post/:username', verifyToken, fetch_Post_By_Username)
router.put('/edit-post/:postId', verifyToken, edit_Post)
router.delete('/delete-post/:postId', verifyToken, delete_Post)
router.get('/featured-post/:postId', verifyToken, toggle_Featured_Post)
router.post('/comment/:postId', verifyToken, add_Comment)
router.get('/:postId', fetch_Post_By_Id)


export default router