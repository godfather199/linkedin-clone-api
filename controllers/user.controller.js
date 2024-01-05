import User from '../models/user.model.js'
import errorHandler from '../middlewares/errorHandler.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";



// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      if (user.username === username) {
        return next(errorHandler(400, "Username already taken"));
      }

      return next(errorHandler(400, "Email already exists"));
    }

    const newUser = await User.create({ ...req.body });

    const { password, ...userDetails } = newUser._doc;

    res.status(201).json({
      msg: "User Registered successfully",
      userDetails,
    });
  } catch (error) {
    next(error);
  }
};


// Login User
export const loginUser = async (req, res, next) => {
    try {
        const {userInfo, password} = req.body

        const user = await User.findOne({
            $or: [{username: userInfo}, {email: userInfo}]
        }).select('+password')

        if(!user) {
            return next(errorHandler(400, 'Invalid username/email'))
        }

        const verifyPassword = await user.comparePassword(password)

        if(!verifyPassword) {
            return next(errorHandler(400, 'Invalid password'))
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                "expiresIn": '3d'
            }
        )

        const {password: userPassword, ...userDetails} = user._doc

        res
        .status(201)
        .cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            secure: true,   
            sameSite: 'None'
        })
        .json({
            msg: 'User login successfull',
            userDetails
        })

    } catch (error) {
        next(error)
    }
}



// Protected Route => Authenticate user
export const authenticateUser = async (req, res, next) => {
    try {
        res.status(201).json({
            success: true
        })    
    } catch (error) {
        next(error)
    }
}



// Follow/unfollow user
export const follow_Unfollow_User = async (req, res, next) => {
    try {
        const {id} = req.user
        const {userId} = req.params

        const logged_In_User = await User.findById(id)
        const user_To_Follow = await User.findById(userId)

        // console.log('User to follow: ', userId)
        // console.log('Check: ', logged_In_User.following.includes(user_To_Follow._id))
        // return

        if(logged_In_User.following.includes(user_To_Follow._id)) {
            logged_In_User.following = logged_In_User.following.filter(
              (item) => item.toString() !== user_To_Follow._id.toString()
            );

            // console.log('Check: ', logged_In_User.following)
            // return

            user_To_Follow.followers = user_To_Follow.followers.filter(
              (item) => item.toString() !== logged_In_User._id.toString()
            );

            await logged_In_User.save()
            await user_To_Follow.save()

            return res.status(201).json({
                msg: 'User Unfollowed',
                logged_In_User,
                user_To_Follow
            })
        }
        else {
          logged_In_User.following.push(user_To_Follow._id);
          user_To_Follow.followers.push(logged_In_User._id);

          await logged_In_User.save();
          await user_To_Follow.save();

          return res.status(201).json({
            msg: "User Followed",
            logged_In_User,
            user_To_Follow
          });
        }

    } catch (error) {
        next(error)
    }
}



// Fetch user by name
export const user_By_Name = async (req, res, next) => {
    try {
        const {username} = req.params

        const user = await User.findOne({username})
        .populate('followers following')
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: {
                    path: 'user'
                }
            }
        })
        

        res.status(201).json({
            msg: 'User info',
            user
        })

    } catch (error) {
        next(error)
    }
}



// User search bar
export const user_Search_Bar = async (req, res, next) => {
    try {
        const {userInfo} = req.query
        let users

        if (userInfo) {
          users = await User.find({
            $or: [
              {
                name: {
                  $regex: userInfo,
                  $options: "i",
                },
              },
              {
                username: {
                  $regex: userInfo,
                  $options: "i",
                },
              },
            ],
          });
        }


        res.status(201).json({
            msg: 'User fetched',
            users
        })
    } catch (error) {
        next(error)
    }
}



export const edit_User_Info = async (req, res, next) => {
    try {
        const {avatar, coverImage} = req.body
        const {id: userId} = req.user

        const user = await User.findById(userId)

        // Avatar
        // Updating avatar image
        if(avatar) {
          if (user.avatar.public_id) {
            console.log('Inside block 2')
            const { result } = await cloudinary.uploader.destroy(
              user.avatar.public_id
            );
          }
          console.log('Inside block 3')
          const { public_id, secure_url } = await cloudinary.uploader.upload(
            avatar,
            {
              folder: "Linkedin_User_Avatar_Image",
            }
          );

          req.body.avatar = {
            public_id,
            url: secure_url,
          };
        }

        // Cover Image
        // Updating cover image
        if (coverImage) {
          if (user.coverImage.public_id) {
            console.log('Inside block 4')
            const { result } = await cloudinary.uploader.destroy(
              user.coverImage.public_id
            );
          }

          console.log('Inside block 5')
          const coverImgData = await cloudinary.uploader.upload(coverImage, {
            folder: "Linkedin_User_Cover_Image",
          });

          req.body.coverImage = {
            public_id: coverImgData.public_id,
            url: coverImgData.secure_url,
          };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
          );

        res.status(201).json({
            msg: 'User updated',
            updatedUser
        })


    } catch (error) {
        
    }
}



export const logout_User = async (req, res, next) => {
  try {
    res
      .status(201)
      .cookie('access_token', '', {
        httpOnly: true
      })
      .json({
        msg: 'Logged out successfully'
      })
  } catch (error) {
    next(error)
  }
}



export const saved_Post = async (req, res, next) => {
  try {
    const {id: userId} = req.user
    const {postId} = req.params

    const loggedInUser = await User.findById(userId)

    loggedInUser.saved.push(postId)

    await loggedInUser.save()

    res.status(201).json({
      msg: 'Post Saved',
      loggedInUser
    })

  } catch (error) {
    next(error)
  }
}



export const fetch_Saved_Post = async (req, res, next) => {
  try {
    const {id: userId} = req.user

    const loggedInUser = await User.findById(userId)
    .populate({
      path: 'saved',
      populate: {
        path: 'postedBy'
      }
    })

    res.status(201).json({
      msg: 'Saved Post Fetched',
      loggedInUser
    })

  } catch (error) {
    next(error)
  }
}



export const remove_Saved_Post = async (req, res, next) => {
  try {
    const {id: userId} = req.user
    const {postId} = req.params

    const logged_In_User = await User.findById(userId)

    logged_In_User.saved = logged_In_User.saved.filter(item => item.toString() !== postId.toString())

    await logged_In_User.save()

    res.status(201).json({
      msg: 'Post removed from saved list',
      logged_In_User
    })

  } catch (error) {
    next(error)
  }
}



export const logged_In_User_Info = async (req, res, next) => {
  try {
    const {id: userId} = req.user

    const logged_In_User = await User.findById(userId)

    res.status(201).json({
      msg: 'Logged in user info',
      logged_In_User
    })
  } catch (error) {
    next(error)
  }
}



export const user_Details_By_Id = async (req, res, next) => {
  try {
    const {id: userId} = req.params

    const user = await User.findById(userId)

    res.status(201).json({
      msg: 'User fetched by id',
      user
    })
  } catch (error) {
    next(error)
  }
}