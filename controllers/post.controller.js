import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import { v2 as cloudinary } from "cloudinary";



// Create Post
export const createPost = async (req, res, next) => {
    try {
        const {id} = req.user 
        const {current_Post_Pic} = req.body

        let newPost

        if(current_Post_Pic) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(
              current_Post_Pic,
              {
                folder: "Lindedin_Post_Image",
              }
            );

            
             newPost = await Post.create({
               ...req.body,
               postedBy: id,
               postImage: {
                 public_id,
                 url: secure_url,
               },
             });

        }
        else {
            newPost = await Post.create({
              ...req.body,
              postedBy: id,
            });
        }

        

        const user = await User.findById(id);

        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json({
          msg: "Post created successfully",
          newPost,
        });

    } catch (error) {
        next(error)
    }
}



// Home feed
export const posts_Of_Following = async (req, res, next) => {
    try {
        const {id} = req.user 
        
        const logged_In_User = await User.findById(id)

        const posts = await Post.find({
            postedBy: {
                $in: logged_In_User.following
            }
        })
        .populate("postedBy")
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        res.status(201).json({
            msg: 'Posts of following',
            posts
        })

    } catch (error) {
        next(error)
    }
}



// Like-unlike post
export const like_Unlike_Post = async (req, res, next) => {
    try {
        const {id: logged_In_UserId} = req.user
        const {postId} = req.params

        const post_To_Like = await Post.findById(postId);

        if (post_To_Like.likes.includes(logged_In_UserId)) {
          post_To_Like.likes = post_To_Like.likes.filter(
            (item) => item.toString() !== logged_In_UserId.toString()
          );

          await post_To_Like.save();

          return res.status(201).json({
            msg: "Post Unliked",
            post_To_Like,
          });
        } else {
          post_To_Like.likes.push(logged_In_UserId);

          await post_To_Like.save();

          return res.status(201).json({
            msg: "Post Liked",
            post_To_Like,
          });
        }

    } catch (error) {
        next(error)
    }
}



export const fetch_Post_By_Username = async (req, res, next) => {
    try {
        const {username} = req.params

        // const userInfo = await User.findOne({username})
        // .populate('posts')
        
        const userInfo = await User.findOne({username})
        .populate({
            path: 'posts',
            populate: {
                path: 'postedBy'
            }
        })

        const {posts, avatar,  ...others} = userInfo


        res.status(201).json({
            msg: "User Posts",
            posts,
            // avatar
            // userInfo
        })
    } catch (error) {
        next(error)
    }
}



export const edit_Post = async (req, res, next) => {
    try {
        const {current_Post_Pic, caption} = req.body
        const {postId} = req.params

        const post = await Post.findById(postId)

        if(current_Post_Pic) {
            console.log('Inside the function')
            // Delete image from cloudinary
            const {result} = await cloudinary.uploader.destroy(post.postImage.public_id)

            // Upload new image to cloudinary
            const {public_id, secure_url} = await cloudinary.uploader.upload(current_Post_Pic, {
                folder: "Lindedin_Post_Image"
            })

            post.postImage = {
                public_id,
                url: secure_url
            }
        }

        if(caption) {
            post.caption = caption
        }

        await post.save()

        res.status(201).json({
            msg: 'Post Updated',
            post
        })


    } catch (error) {
        next(error)
    }
}



export const delete_Post = async (req, res, next) => {
    try {
        // Fetch post from database
        // Delete image from cloudinary
        // Delete post from post-collection
        // Remove post from user-collection

        const {postId} = req.params
        const {id: userId} = req.user

        const post = await Post.findById(postId)
        const user = await User.findById(userId)

        const {result} = await cloudinary.uploader.destroy(post.postImage.public_id)

        await post.deleteOne({postId})

        user.posts = user.posts.filter(
          (item) => item.toString() !== postId.toString()
        );

        await user.save()

        res.status(201).json({
            msg: "Post deleted successfully",
            post
        })

    } catch (error) {
        next(error)
    }
}



export const toggle_Featured_Post = async (req, res, next) => {
    try {
        const {postId} = req.params

        const post = await Post.findById(postId)

        post.featured = !post.featured

        await post.save()

        let msg

        if(post.featured) {
            msg = 'Post Featured on the profile'
        } 
        else {
            msg = 'Post removed from the featured'
        }

        res.status(201).json({
            msg,
            post
        })
    } catch (error) {
        next(error)
    }
}




export const add_Comment = async (req, res, next) => {
    try {
        const {postId} = req.params
        const {id: loggedInUserId} = req.user
        const {comment} = req.body

        const post = await Post.findById(postId)

        post.comments.push({
            user: loggedInUserId,
            comment
        })

        await post.save()

        res.status(201).json({
            msg: 'Comment added successfully',
            post
        })
    } catch (error) {
        next(error)
    }
}



export const fetch_Post_By_Id = async (req, res, next) => {
    try {
        const {postId} = req.params

        const post = await Post.findById(postId)

        res.status(201).json({
            msg: 'Post fetched',
            post
        })
    } catch (error) {
        next(error)
    }
}